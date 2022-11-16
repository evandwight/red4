def upsertTag(context, tagId, thingId, value, commit=True):
    (conn, cur, reddit, pushshift) = context
    SQL = """
INSERT INTO tag
(tag_id, thing_id, value)
VALUES (%s,%s,%s)
ON CONFLICT (tag_id, thing_id)
DO UPDATE SET value = %s
"""
    data = (tagId,thingId, value,
        # ON CONFLICT
        value)
    cur.execute(SQL, data)
    if commit:
        conn.commit()
    return