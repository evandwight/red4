import { post } from '@prisma/client';
import { cachedApi } from 'lib/api/cachedApi';
import { API_POSTS } from "lib/api/paths";
import getTags from 'lib/getTags';
import prisma, { prismaView } from 'lib/prisma';
import { post_with_score } from 'prisma/generated/client-views';

export async function getPostsWithTags({page, sub, sort}) {
    const perPage = 30;
    let query: any = { skip: (page - 1) * perPage, take: perPage };
    if (sub !== "all") {
        query.where = { subreddit: sub };
    }
    let posts: (post | post_with_score)[];
    if (sort === "hot") {
        query.orderBy = [{ hot: 'desc', },];
        posts = await prismaView.post_with_score.findMany(query);
    } else {
        query.orderBy = [{ created: 'desc', },];
        posts = await prisma.post.findMany(query);
    }

    const tagMap = await getTags(posts.map(post => post.id));
    const postsWithTags = posts.map(post => ({...post, tags: tagMap[post.id] || []}));
    return postsWithTags;
}

const handler = cachedApi(API_POSTS,{ttl: 600}, async (_, props) => {
    const { page: pageStr, sub, sort } = props.query;
    const page = parseInt(pageStr || "1");
    const posts = await getPostsWithTags({page, sub, sort});
    return { posts};

});

export default handler;