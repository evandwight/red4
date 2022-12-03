import { Comments } from "components/Comment/Comments";
import { FullPost } from "components/Post";
import { axiosGet } from "lib/api/axiosGet";
import { API_COMMENTS, API_POST } from "lib/api/paths";
import { getUserIdOrNull } from "lib/api/utils";
import { VotesType } from "lib/commonTypes";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import { ExtractSSProps, serverSideErrorHandler } from "lib/pageUtils";
import { getVotesInternal } from "pages/api/getVotes";
import { defaultProfile } from "pages/api/profile";

export const getServerSideProps = serverSideErrorHandler(async (context, req) => {
    const userId = await getUserIdOrNull(req);
    let profile = defaultProfile;
    let initialVotes: VotesType = {};
    const { id } = API_POST.querySchema.parse(context.query);
    const post = (await axiosGet(API_POST, { id })).data.post;
    const comments = (await axiosGet(API_COMMENTS, { id })).data.commentTree;
    if (userId) {
        profile = await getOrCreateProfile(userId);
        const thing_ids = [post.id].concat(commentTreeToList(comments).map(node => node.id));
        initialVotes = await getVotesInternal(userId, thing_ids);
    }
    return {
        props: { profile, post, comments, initialVotes }
    }
});

export default function PostDetails({ profile, post, comments, initialVotes }: ExtractSSProps<typeof getServerSideProps>) {
    return <div>
        <FullPost {... { post, initialVotes, profile }} />
        <hr className="border-stone-500"></hr>
        <Comments {... { post, nodes: comments, initialCollapse: {}, overrideCollapse: false, parentId: null, initialVotes, profile }} />
    </div>
}

export function commentTreeToList(nodes) {
    return nodes.reduce((pv, cv) => pv.concat([cv], commentTreeToList(cv.children)), []);
}