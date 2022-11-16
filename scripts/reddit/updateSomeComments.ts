import prisma, { prismaView } from "../../lib/prisma";
import { updateComments } from "../../lib/pythonScript";
import { hoursAgo } from "./util";

async function main() {
    const hotPosts = (await prismaView.post_with_score.findMany({
        where: { created: { gt: hoursAgo(12), lt: hoursAgo(4) } },
        orderBy: { hot: 'desc' },
        take: 100,
        select: { id: true }
    })).map(e => e?.id);
    console.log({hotPosts});
    const posts = await prisma.post.findMany({
        where: {
            AND: [
                { id: { in: hotPosts } },
                { OR: [{ comment_update_time: null }, { comment_update_time: { lt: hoursAgo(4) } }] }
            ]
        },
        orderBy: { comment_update_time: { sort: 'asc', nulls: 'last' } }
    });
    console.log({posts});
    if (posts.length) {
        await updateComments(posts[0].id);
    }
}

if (require.main === module) {
    main();
}