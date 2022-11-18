import uuid
from datetime import datetime, timedelta, timezone
from .upsertTag import upsertTag

def upsertPost(context, post):
    (conn, cur, reddit, pushshift) = context

    SQL = """
INSERT INTO post
(id, title,created,reddit_id,reddit_score,upvote_ratio,reddit_link,external_link,thumbnail,text,subreddit,user_name,reddit_comment_count)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
ON CONFLICT (reddit_id)
DO UPDATE SET reddit_score = %s, upvote_ratio = %s, reddit_comment_count = %s
RETURNING id;
"""
    data = (
        str(uuid.uuid4()),
        post.title,
        datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
        post.id,
        post.score,
        post.upvote_ratio,
        "https://www.reddit.com" + post.permalink,
        post.url if not str.endswith(post.url, post.permalink) else None,
        post.thumbnail,
        post.selftext,
        post.subreddit_name_prefixed[2:],
        (post.author and post.author.name) or "reddit-anon",
        post.num_comments,
        # ON CONFLICT
        post.score,
        post.upvote_ratio,
        post.num_comments)
    cur.execute(SQL, data)
    id = cur.fetchone()[0]
    if (post.locked):
        upsertTag(context, 'reddit_locked', id, True, commit=False)
    if (post.over_18):
        upsertTag(context, 'nsfw', id, True, commit=False)
    conn.commit()
    return id