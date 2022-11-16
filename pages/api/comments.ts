import { cachedApi } from 'lib/api/cachedApi';
import { fancyApi } from 'lib/api/fancyApi';
import { API_COMMENTS } from "lib/api/paths";
import { createCommentTree } from 'lib/commentTree';
import getTags from 'lib/getTags';
import prisma from 'lib/prisma';

export const handler = cachedApi(API_COMMENTS, {ttl: 600}, async (req, props) => {
    const { id } = props.query;
    const comments = await prisma.comment.findMany({ where: { post_id: id } });
    const tagMap = await getTags(comments.map(comment => comment.id));
    const commentsWithTags = comments.map(comment => ({...comment, tags: tagMap[comment.id] || []}));
    const commentTree = createCommentTree(commentsWithTags);
    return { commentTree };
});

export default handler;