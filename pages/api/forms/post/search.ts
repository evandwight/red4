import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_SEARCH_POST } from "lib/api/paths";
import prisma from 'lib/prisma';

const handler = fancyApi(API_FORM_SEARCH_POST, {}, async (req, res, props) => {
    const { search_term } = props.body;
    const urlRegex = /^https?:\/\/.+\/r\/.+\/comments\/([A-Za-z0-9]+)\/.+$/
    const redditIdRegex = /^[A-Za-z0-9]+$/
    const result = urlRegex.exec(search_term);
    const searchId = !!result ? result[1] : search_term;

    if (!redditIdRegex.test(searchId)) {
        res.status(200).send({ errors: ["Search term is not a url or reddit id"] });
        return;
    }

    const post = await prisma.post.findFirst({ where: { reddit_id: searchId } });

    if (!post) {
        res.status(200).send({ errors: [`Could not find reddit id (${searchId})`], notFound: searchId });
        return;
    }

    res.status(200).send({ id: post.id });
});

export default handler;