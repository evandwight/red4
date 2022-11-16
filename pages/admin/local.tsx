import { CommentInfo } from "components/Comment/Comments";
import { PostSmall, UserText } from "components/Post";
import { Tags } from "components/Thing/Tags";
import { assertAdmin } from "lib/api/utils";
import { CommentType, PostType } from "lib/commonTypes";
import getTags from "lib/getTags";
import prisma from "lib/prisma";
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
    await assertAdmin(context.req);
    const clean = (x) => JSON.parse(JSON.stringify(x));
    const posts = clean(await prisma.post.findMany({ where: { is_local: true } }));
    const comments = clean(await prisma.comment.findMany({ where: { is_local: true } }));
    const tagMap = getTags(posts.concat(comments).map(thing => thing.id));
    const addTags = (things) => things.map(thing => ({...things, tags: tagMap[thing.id] || []}));
    return {
        props: { posts: addTags(posts), comments: addTags(comments) },
    }
}


const Local = ({ posts, comments }: { posts: PostType[], comments: CommentType[] }) => {
    return <div>
        <div>Local posts:</div>
        <div>
            {posts.map(post => <PostSmall key={post.id} {... { post, initialVotes: {}, profile: {} }} />)}
        </div>
        <div>Local comments:</div>
        <div>
            {comments.map(comment => <div key={comment.id}>
                <CommentInfo {...{ comment, expand: true, toggleExpand: () => { } }} />
                <div>
                    <Tags thing={comment} />
                    <div><UserText text={comment.text} /></div>
                </div>
            </div>)}
        </div>
    </div>
}

export default Local
