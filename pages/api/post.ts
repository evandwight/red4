import { cachedApi } from 'lib/api/cachedApi';
import { API_POST } from 'lib/api/paths';
import { DisplayTags } from 'lib/commonTypes';
import getTags from 'lib/getTags';
import prisma from 'lib/prisma';
import { ApiError } from 'next/dist/server/api-utils';


const handler = cachedApi(API_POST,{ttl: 600}, async (_, props) => {
    const { id } = props.query;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const tagMap = getTags([post.id]);
    const postWithTags = {... post, tags: (tagMap[post.id] as DisplayTags)};
    return { post: postWithTags };
});

export default handler;