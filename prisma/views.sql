CREATE VIEW "post_with_score" AS
    SELECT *, 
    ((extract(epoch from created) - 1134028003)/45000 + log(GREATEST(abs(score + reddit_score)*2, 1))*sign(score + reddit_score)) as hot
    FROM post
    WHERE created > (NOW() - INTERVAL '1 DAY')
    ORDER BY hot desc;

ALTER VIEW "post_with_score" OWNER TO red4;

-- REFRESH MATERIALIZED VIEW "post_with_score";