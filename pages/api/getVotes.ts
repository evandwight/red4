import { fancyApi } from 'lib/api/fancyApi';
import { API_GET_VOTES } from "lib/api/paths";
import { VotesType } from 'lib/commonTypes';
import prisma from 'lib/prisma';

const handler = fancyApi(API_GET_VOTES, { withUserId: true }, async (req, res, props) => {
    const { thing_ids } = props.body;
    const user_id = props.userId;
    const votes = await prisma.vote.findMany({ where: { thing_id: { in: thing_ids }, user_id } });
    const voteMap = votes.reduce((pv, cv) => { pv[cv.thing_id] = cv.direction; return pv; }, {} as VotesType)

    res.status(200).send({ votes: voteMap });
});

export default handler;