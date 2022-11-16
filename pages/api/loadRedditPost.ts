import { fancyApi } from 'lib/api/fancyApi';
import { API_LOAD_REDDIT_POST } from "lib/api/paths";
import { loadRedditPost } from 'lib/pythonScript';
import { rateLimit, rateLimitByIp } from 'lib/redisUtils';

const handler = fancyApi(API_LOAD_REDDIT_POST, {withUserId: true}, async (req, res, props) => {
    await rateLimit('loadRedditCommentsCount', 30)
    await rateLimitByIp(req, 'loadRedditCommentsIp', 2)
    const local_id = await loadRedditPost(props.query.id);
    res.status(200).send({ id: local_id });
});

export default handler;