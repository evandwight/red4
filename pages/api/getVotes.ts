import { fancyApi } from 'lib/api/fancyApi';
import { API_GET_VOTES } from "lib/api/paths";
import { VotesType } from 'lib/commonTypes';
import prisma from 'lib/prisma';

export async function getVotesInternal(user_id, thing_ids) {
    const votes = await prisma.vote.findMany({ where: { thing_id: { in: thing_ids }, user_id } });
    const voteMap = votes.reduce((pv, cv) => { pv[cv.thing_id] = cv.direction; return pv; }, {} as VotesType)
    return voteMap;
}

const handler = fancyApi(API_GET_VOTES, { withUserId: true }, async (req, res, props) => {
    const { thing_ids } = props.body;
    const user_id = props.userId;
    const votes = await getVotesInternal(user_id, thing_ids);

    res.status(200).send({ votes });
});

export default handler;