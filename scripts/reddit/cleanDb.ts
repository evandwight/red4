import prisma from "../../lib/prisma";
import { alwaysKeepSubs } from "./util";

async function cleanPosts() {
    const oldDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ids = (await prisma.post.findMany({
        where: { created: { lt: oldDate }, subreddit: { notIn: alwaysKeepSubs } },
        select: { id: true }
    })).map(e => e.id);
    await prisma.post.deleteMany({ where: { id: {in: ids} }});
    await prisma.comment.deleteMany({ where: { post_id: {in: ids} }});
}
async function cleanInvites() {
    const oldDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.invitation.deleteMany({where: { created: {lt: oldDate}}});
}

async function main() {
    await cleanPosts();
    await cleanInvites();
    await prisma.$executeRaw`VACUUM FULL`;
}

if (require.main === module) {
    main();
}