import { Comments } from "components/Comment/Comments";
import { FullPost } from "components/Post";
import { API_COMMENTS, API_GET_PROFILE, API_GET_VOTES, API_POST } from "lib/api/paths";
import { CommentTreeNode } from "lib/commentTree";
import { InitialVotesType, PostType, ProfileType } from "lib/commonTypes";
import { useRestoreScrollPosition } from "lib/restoreScroll";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PostDetails() {
    const router = useRouter();
    const [post, setPost] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentTreeNode[] | null>(null);
    const [initialVotes, setInitialVotes] = useState<InitialVotesType>(null);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();

    const [profile, setProfile] = useState<ProfileType | null>(null);
    useEffect(() => {
        API_GET_PROFILE.post().then(result => setProfile(result.data.profile)).catch(err => {
            setError(err?.response?.data || "error");
        });
    }, [])

    useEffect(() => {
        if (router.isReady) {
            const { id } = API_POST.querySchema.parse(router.query);
            API_POST.get({ id }).then(result => {
                setPost(result.data.post);
            }).catch(err => {
                setError(err?.response?.data || "error");
            });
            API_COMMENTS.get({ id }).then(result => {
                setComments(result.data.commentTree);
            }).catch(err => {
                setError(err?.response?.data || "error");
            });
        }
    }, [router]);

    useEffect(() => {
        if (status === "unauthenticated") {
            setInitialVotes({});
            return;
        } else if (post && comments && status === "authenticated") {
            const thing_ids = [post.id].concat(commentTreeToList(comments).map(node => node.id))
            API_GET_VOTES.post(undefined, { thing_ids }).then((results) => setInitialVotes(results.data.votes));
        }
    }, [post, comments, status]);

    useRestoreScrollPosition(!post || !profile || !comments);

    if (error) {
        return <div>{error}</div>
    } else if (!post || !profile) {
        return <div>Loading</div>
    } else {
        return <div>
            <FullPost {... { post, initialVotes, profile }} />
            <hr className="border-stone-500"></hr>
            {comments ?
                <Comments {... { post, nodes: comments, initialCollapse: {}, overrideCollapse: false, parentId: null, initialVotes, profile }} />
                : <div> Loading </div>}
        </div>
    }
}

export function commentTreeToList(nodes) {
    return nodes.reduce((pv, cv) => pv.concat([cv], commentTreeToList(cv.children)), []);
}