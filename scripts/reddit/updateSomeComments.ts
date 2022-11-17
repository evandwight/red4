import { API_POSTS } from "lib/api/paths";
import prisma from "lib/prisma";
import { updateComments } from "lib/pythonScript";
import { hoursAgo } from "./util";

async function main() {
    const hotPosts = await Promise.all([
        API_POSTS.postPlus({sort: "hot", page:"1", sub: "all"}, undefined),
        API_POSTS.postPlus({sort: "hot", page:"2", sub: "all"}, undefined),
        API_POSTS.postPlus({sort: "hot", page:"3", sub: "all"}, undefined)]).then(([a, b, c]) => 
            [...a.data.posts, ...b.data.posts, ...c.data.posts].map(post => post.id));
    const posts = await prisma.post.findMany({
        where: {
            AND: [
                { id: { in: hotPosts } },
                { OR: [{ comment_update_time: null }, { comment_update_time: { lt: hoursAgo(4) } }] }
            ]
        },
        orderBy: { comment_update_time: { sort: 'asc', nulls: 'last' } }
    });
    if (posts.length) {
        await updateComments(posts[0].id);
    }
}

if (require.main === module) {
    main();
}