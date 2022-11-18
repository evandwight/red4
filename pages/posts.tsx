import ChangeSortButton from "components/ChangeSort";
import Layout from "components/Layout";
import NextIconLink from "components/NextIconLink";
import { Posts } from "components/Posts";
import { API_GET_PROFILE, API_GET_VOTES, API_POSTS } from "lib/api/paths";
import { InitialVotesType, PostType } from "lib/commonTypes";
import { ABOUT, SEARCH_POST, SUBMIT_POST } from "lib/paths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddSymbol from 'svg/add-line.svg';
import QuestionSymbol from 'svg/question-line.svg';
import SearchSymbol from 'svg/search.svg';

const PostListing = () => {
    const router = useRouter();
    const { page: pageStr, sub, sort } = API_POSTS.querySchema.parse(router.query);
    const page = parseInt(pageStr || "1");
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [initialVotes, setInitialVotes] = useState<InitialVotesType>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (router.isReady) {
            setPosts(null);
            API_POSTS.get({ page:page.toString(), sub, sort }).then(result => {
                setPosts(result.data.posts);
            });
        }
    }, [router.isReady, page, sub, sort]);


    const [profile, setProfile] = useState<any>(null);
    useEffect(() => {
        API_GET_PROFILE.post().then(result => setProfile(result.data.profile));
    }, [])

    useEffect(() => {
        if (status === "unauthenticated") {
            setInitialVotes({});
            return;
        }
        else if (posts && status === "authenticated") {
            const thing_ids = posts.map(post => post.id);
            API_GET_VOTES.post(undefined, {thing_ids}).then((results) => setInitialVotes(results.data.votes));
        }
    },[posts, status]);

    if (!posts || !profile) {
        return <div>Loading</div>
    } else {
        const pageLinks = {
            next: posts.length > 0 ? API_POSTS.queryString({ page: (page + 1).toString(), sub, sort }) : undefined,
            prev: page > 1 ? API_POSTS.queryString({ page: (page - 1).toString(), sub, sort }) : undefined,
        }
        return <div>
            <div className="flex flex-row-reverse text-stone-500">
                {`${sort} ${sub} (${page})`}
            </div>
            <Posts {... { posts, initialVotes, profile, pageLinks, page }} />
        </div>
    }
}

function ExtraButtons() {
    return <>
        <div className="pl-2">
            <NextIconLink href={SUBMIT_POST} imageObj={AddSymbol} title="submit post" />
        </div>
        <div className="pl-2">
            <NextIconLink href={SEARCH_POST} imageObj={SearchSymbol} title="search for post" />
        </div>
        <div className="pl-2">
            <ChangeSortButton />
        </div>
        <div className="pl-2">
            <NextIconLink href={ABOUT} imageObj={QuestionSymbol} title="search for post" />
        </div>
    </>
}

PostListing.getLayout = function getLayout({ Component, pageProps }) {
    return (
        <Layout extraButtons={<ExtraButtons />}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default PostListing
