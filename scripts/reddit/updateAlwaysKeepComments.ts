import prisma from "lib/prisma";
import { updateComments } from "lib/pythonScript";
import { hoursAgo, runOneTask } from "./util";

async function main() {
    const posts = (await prisma.post.findMany({
        where: { created: { lt: hoursAgo(24) }, comment_update_time: null },
        take: 1
    }));
    for (const post of posts) {
        await updateComments(post.id);
    }
}

if (require.main === module) {
    runOneTask('updateAlwaysKeepComments', main);
}