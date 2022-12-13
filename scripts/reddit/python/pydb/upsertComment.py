from datetime import datetime, timedelta, timezone
from .upsertTag import upsertTag

def upsertComment(context, comment, postId):
    (conn, cur, reddit, pushshift) = context
    SQL = """
INSERT INTO comment
(id, post_id, parent_id, created,reddit_id, parent_reddit_id,reddit_score,reddit_link,text,user_name)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
ON CONFLICT (reddit_id)
DO UPDATE SET reddit_score = %s, text = %s, user_name = %s
RETURNING id;
"""
    data = (
        comment.local_id,
        postId,
        comment.local_parent_id,
        datetime.fromtimestamp(comment.created_utc, tz=timezone.utc),
        comment.id,
        comment.parent_id,
        comment.score,
        "https://reddit.com" + comment.permalink,
        comment.body,
        comment.user_name,
        # ON CONFLICT
        comment.score,
        comment.body,
        comment.user_name)
    cur.execute(SQL, data)
    id = cur.fetchone()[0]
    if (comment.reddit_removed):
        upsertTag(context, 'reddit_removed', id, True, commit=False)
    conn.commit()
    return id
