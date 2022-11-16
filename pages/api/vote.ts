import { VoteDirection } from '@prisma/client';
import { fancyApi } from 'lib/api/fancyApi';
import { API_VOTE } from "lib/api/paths";
import prisma from 'lib/prisma';


const handler = fancyApi(API_VOTE, { withUserId: true }, async (req, res, props) => {
    const { thing_id, direction } = props.query;
    const user_id = props.userId;
    const ret = await prisma.$transaction([
        prisma.vote.findFirst({ where: { thing_id, user_id } }),
        prisma.vote.upsert({
            where: { user_id_thing_id: { user_id, thing_id } },
            update: { direction },
            create: { thing_id, user_id, direction }
        }),])
    const oldDirection = ret[0]?.direction || VoteDirection.NONE;
    const newDirection = direction;
    const ScoreMap = {
        [VoteDirection.UP]: 1,
        [VoteDirection.NONE]: 0,
        [VoteDirection.DOWN]: -1,
    };
    const increment = ScoreMap[newDirection] - ScoreMap[oldDirection]
    const isPost = await prisma.post.findFirst({ where: { id: thing_id }, });
    const updateParams = { where: { id: thing_id }, data: { score: { increment } } };
    if (isPost) {
        await prisma.post.update(updateParams);
    } else {
        await prisma.comment.update(updateParams);
    }
    res.status(200).send({ thing_id, direction: newDirection });
});

export default handler;