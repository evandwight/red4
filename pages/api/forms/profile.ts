import { fancyApi } from 'lib/api/fancyApi';
import { API_FORM_PROFILE } from "lib/api/paths";
import prisma from 'lib/prisma';

const handler = fancyApi(API_FORM_PROFILE, { withUserId: true }, async (req, res, props) => {
    const {filter_tags} = props.body;
    const id = props.userId;
    const tag_filter = filter_tags.reduce((pv, {tag_id, value}) => {pv[tag_id] = value; return pv;}, {});
    await prisma.profile.update({ where: { id }, data: {tag_filter} });
    res.status(200).send({ });
});

export default handler;
