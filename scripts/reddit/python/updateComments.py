import sys
import time
import uuid
from datetime import datetime, timedelta, timezone
from pydb.upsertComment import upsertComment

from util import getTools, skipIfBusy


def updateRedditComments(context, postId):
    (conn, cur, reddit, pushshift) = context
    print(postId)
    cur.execute("select reddit_id from post where id = %s", (postId,))
    reddit_id = cur.fetchone()
    print(reddit_id)
    if reddit_id is None:
        return
    updateComments(context, reddit.submission(reddit_id[0]), postId)

def isCommentRemoved(comment):
    return comment.body == '[removed]' and comment.author is None

def updateComments(context, redditSubmission, postId):
    (conn, cur, reddit, pushshift) = context
    comments = redditSubmission.comments
    comments.replace_more(limit=0)
    comments = comments.list()
    for i, comment in enumerate(comments):
        if comment.score_hidden:
            comment.score = len(comments) - i
    commentMap = {comment.id: comment for comment in comments}
    removedComments = []

    for comment in comments:
        comment.local_id = str(uuid.uuid4())
        comment.user_name = (comment.author and comment.author.name) or "reddit-anon"
        comment.removed_from_reddit = isCommentRemoved(comment)
        if comment.removed_from_reddit:
                removedComments.append(comment.id)

    for comment in comments:
        comment.local_parent_id = commentMap[comment.parent_id[3:]].local_id if comment.parent_id.startswith("t1_") else None          

    if len(removedComments) > 0:
        if len(removedComments) > 100:
            print('Too many removed comments to load from pushshift')
            removedComments = removedComments[:100]    
        pushshiftRemovedComments = list(pushshift.search_comments(ids=removedComments, limit=100, metadata=True))
        for psComment in pushshiftRemovedComments:
            if psComment.id in commentMap:
                comment = commentMap[psComment.id]
                comment.body = psComment.body
                comment.user_name = psComment.author
                comment.removed_from_reddit = True

    for comment in comments:
        upsertComment(context, comment, postId)
    
    cur.execute('UPDATE post SET comment_update_time = %s WHERE id = %s ', (datetime.now(tz=timezone.utc), postId))
    conn.commit()


if __name__ == "__main__":
    context = getTools()
    updateRedditComments(context, sys.argv[1])
