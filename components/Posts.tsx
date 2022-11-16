import NextIconLink from 'components/NextIconLink';
import { PostSmall } from 'components/Post';
import { InitialVotesType, PostType, ProfileType } from 'lib/commonTypes';
import { filterByProfile } from 'lib/utils';
import LeftArrow from 'svg/arrow-left-line.svg';
import RightArrow from 'svg/arrow-right-line.svg';

type ReactPostsType = { posts: PostType[], initialVotes: InitialVotesType, 
    profile: ProfileType, pageLinks: {prev: string|undefined, next: string|undefined}, page: number }
export function Posts({ posts, initialVotes, profile, pageLinks, page }: ReactPostsType) {
    const navigation = <>
        <hr className="border-stone-500" />
        <div className="pagination">
            <div className="flex flex-row items-center justify-center">
                <NextIconLink imageObj={LeftArrow} title="previous page" href={pageLinks.prev}/>
                <div>
                    page {page}
                </div>
                <NextIconLink imageObj={RightArrow} title="next page" href={pageLinks.next} />
            </div>
        </div>
    </>


    if (posts.length === 0) {
        if (pageLinks.prev) {
            return <>
                <p>No more posts available</p>
                {navigation}
            </>
        } else {
            return <p>No posts are available</p>
        }
    } else {
        return <>
            <div className="divide-y divide-stone-500">
                {posts.map((post, i) => {
                    const {show, reason} = filterByProfile(post, profile);
                    if (show) {
                        return <PostSmall key={i} {... { post, initialVotes, profile }} />
                    } else {
                        return <div key={i} className="bg-stone-500 text-center my-2">{reason}</div>
                    }
                })}
            </div>
            {navigation}
        </>
    }
}