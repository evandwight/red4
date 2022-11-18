import { profile } from "@prisma/client";
import { CommentInfo } from "components/Comment/Comments";
import { PostSmall, UserText } from "components/Post";
import { Tags } from "components/Thing/Tags";
import { assertAdmin } from "lib/api/utils";
import { CommentType, PostType, ProfileType } from "lib/commonTypes";
import getTags from "lib/getTags";
import prisma from "lib/prisma";
import { NextPageContext } from "next";
import { ApiError } from "next/dist/server/api-utils";

export async function getServerSideProps(context: NextPageContext) {
    try {
        if (!context.req) {
            throw new Error("Request undefined");
        }
        await assertAdmin(context.req);
        const clean = (x) => JSON.parse(JSON.stringify(x));
        const posts = clean(await prisma.post.findMany({ where: { is_local: true } }));
        const comments = clean(await prisma.comment.findMany({ where: { is_local: true } }));
        const tagMap = getTags(posts.concat(comments).map(thing => thing.id));
        const addTags = (things) => things.map(thing => ({ ...things, tags: tagMap[thing.id] || [] }));
        const profiles = await prisma.profile.findMany();
        return {
            props: { posts: addTags(posts), comments: addTags(comments), profiles },
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return { props: { error: { statusCode: error.statusCode, message: error.message } } };
        } else {
            return { props: { error: { statusCode: 500, message: "Internal server error" } } }
        }

    }
}

type PropsType = { posts: PostType[], comments: CommentType[], profiles: profile[] }
    | { error: { statusCode: number, message: string } };
const Local = (props: PropsType) => {
    if ("error" in props) {
        const { statusCode, message } = props.error;
        return <div>
            Error {statusCode} - {message}
        </div>
    }

    const { posts, comments, profiles } = props;
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
