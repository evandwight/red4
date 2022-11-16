import { fancyApi } from 'lib/api/fancyApi';
import { API_GET_PROFILE } from 'lib/api/paths';

export const defaultProfile: any = { tag_filter: [] };

const handler = fancyApi(API_GET_PROFILE, { maybeWithUserIdAndProfile: true, }, async (req, res, props) => {
    res.status(200).json({ profile: props.profile || defaultProfile })
});

export default handler;