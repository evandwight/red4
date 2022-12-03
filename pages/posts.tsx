import ChangeSortButton from "components/ChangeSort";
import Layout from "components/Layout";
import NextIconLink from "components/NextIconLink";
import { Posts } from "components/Posts";
import { axiosGet } from "lib/api/axiosGet";
import { API_POSTS } from "lib/api/paths";
import { getUserIdOrNull } from "lib/api/utils";
import { VotesType } from "lib/commonTypes";
import { getOrCreateProfile } from "lib/getOrCreateProfile";
import { ExtractSSProps, serverSideErrorHandler } from "lib/pageUtils";
import { ABOUT, SEARCH_POST, SUBMIT_POST } from "lib/paths";
import { getVotesInternal } from "pages/api/getVotes";
import { defaultProfile } from "pages/api/profile";
import AddSymbol from 'svg/add-line.svg';
import QuestionSymbol from 'svg/question-line.svg';
import SearchSymbol from 'svg/search.svg';

export const getServerSideProps = serverSideErrorHandler(async (context, req) => {
    const userId = await getUserIdOrNull(req);
    let profile = defaultProfile;
    let initialVotes: VotesType = {};
    const { page: pageStr, sub, sort } = API_POSTS.querySchema.parse(context.query);
    const page = parseInt(pageStr || "1");
    const posts = (await axiosGet(API_POSTS, { page:pageStr, sub, sort })).data.posts;
    if (userId) {
        profile = await getOrCreateProfile(userId);
        initialVotes = await getVotesInternal(userId, posts.map(e => e.id));
    }
    return {
        props: { profile, posts, initialVotes, page, sort, sub }
    }
});


const PostListing = ({profile, posts, initialVotes, page, sort, sub}: ExtractSSProps<typeof getServerSideProps>) => {
    const pageLinks = {
        next: posts.length > 0 ? API_POSTS.queryString({ page: (page + 1).toString(), sub, sort }) : undefined,
        prev: page > 1 ? API_POSTS.queryString({ page: (page - 1).toString(), sub, sort }) : undefined,
    }
    return <div>
        <Posts {... { posts, initialVotes, profile, pageLinks, page }} />
    </div>
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
    const {sort, sub, page} = pageProps;
    return (
        <Layout subTitle={`${sort} ${sub} (${page})`} extraButtons={<ExtraButtons />}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default PostListing
