import prisma from "lib/prisma";
import { hoursAgo } from "./util";

function isRageBait(post) {
    return post.reddit_comment_count > (post.reddit_score * post.upvote_ratio)
        && post.upvote_ratio < 0.8;
}

async function main() {
    const posts = await prisma.post.findMany({ where: { created: { gt: hoursAgo(12) } } });
    const queries = posts.map(post => {
        const commonData = { tag_id: "rage_bait", thing_id: post.id };
        if (isRageBait(post)) {
            return prisma.tag.upsert({
                where: { tag_id_thing_id: commonData },
                create: { ... commonData, value: true }, update: { value: true }
            });
        } else {
            return prisma.tag.delete({ where: { tag_id_thing_id: commonData } });
        }
    });
    if (queries.length) {
        await prisma.$transaction(queries);
    }
}

if (require.main === module) {
    main();
}