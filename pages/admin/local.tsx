import { CommentInfo } from "components/Comment/Comments";
import { PostSmall } from "components/Post";
import { Tags } from "components/Thing/Tags";
import { UserText } from "components/UserText";
import { assertAdmin } from "lib/api/utils";
import { CommentType, PostType } from "lib/commonTypes";
import getTags from "lib/getTags";
import { ExtractSSProps, serverSideErrorHandler } from "lib/pageUtils";
import prisma from "lib/prisma";

export const getServerSideProps = serverSideErrorHandler(async (context, req) => {
    await assertAdmin(req);
    const clean = (x) => JSON.parse(JSON.stringify(x));
    const posts = clean(await prisma.post.findMany({ where: { is_local: true } }));
    const comments = clean(await prisma.comment.findMany({ where: { is_local: true } }));
    const tagMap = getTags(posts.concat(comments).map(thing => thing.id));
    const addTags = (things) => things.map(thing => ({ ...things, tags: tagMap[thing.id] || [] }));
    const profiles = await prisma.profile.findMany();
    return {
        props: {
            posts: addTags(posts) as PostType[],
            comments: addTags(comments) as CommentType[],
            profiles
        },
    }
});

const Local = ({ posts, comments, profiles }: ExtractSSProps<typeof getServerSideProps>) => {
    return <div>
        <h2>Local posts:</h2>
        <div>
            {posts.map(post => <PostSmall key={post.id} {... { post, initialVotes: {}, profile: {} }} />)}
        </div>
        <h2>Local comments:</h2>
        <div>
            {comments.map(comment => <div key={comment.id}>
                <CommentInfo {...{ comment, expand: true, toggleExpand: () => { } }} />
                <div>
                    <Tags thing={comment} />
                    <div><UserText text={comment.text} /></div>
                </div>
            </div>)}
        </div>
        <h2>Profiles:</h2>
        <div>
            {profiles.map(profile => <div key={profile.id}>
                {profile.user_name} {JSON.stringify(profile.tag_filter)}
            </div>)}
        </div>
    </div>
}

export default Local
