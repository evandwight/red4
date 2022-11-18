import { API_POSTS } from "lib/api/paths";
import prisma from "lib/prisma";
import { updateComments } from "lib/pythonScript";
import { axiosGet, hoursAgo, runOneTask } from "./util";

async function main() {
    const hotPosts = await Promise.all([
        axiosGet(API_POSTS, {sort: "hot", page:"1", sub: "all"}),
        axiosGet(API_POSTS, {sort: "hot", page:"2", sub: "all"}),
        axiosGet(API_POSTS, {sort: "hot", page:"3", sub: "all"}),]).then(([a, b, c]) => 
            [...a.data.posts, ...b.data.posts, ...c.data.posts].map(post => post.id));
    const posts = await prisma.post.findMany({
        where: {
            AND: [
                { id: { in: hotPosts } },
                { OR: [{ comment_update_time: null }, { comment_update_time: { lt: hoursAgo(4) } }] }
            ]
        },
        orderBy: { comment_update_time: { sort: 'asc', nulls: 'first' } }
    });
    if (posts.length) {
        const {id} = posts[0];
        await updateComments(id);
        console.log(`Updated ${id} - ${posts[0].comment_update_time}`);
    } else {
        console.log('No posts to update');
    }
}

if (require.main === module) {
    runOneTask('updateSomeComments', main);
}