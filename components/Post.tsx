import { IconLink } from "components/IconLink";
import { MediaElement } from "components/MediaElement";
import NextIconLink from "components/NextIconLink";
import TaskIcon from "components/TaskIcon";
import { Tags } from "components/Thing/Tags";
import { VoteButtons } from "components/VoteButtons";
import { API_LOAD_REDDIT_POST } from "lib/api/paths";
import { POST_DETAIL, SET_TAG, SUBMIT_COMMENT } from "lib/paths";
import { isValidHttpUrl, netloc, notAuthorizedToSignIn, timeSinceShort } from "lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import DiscussLine from 'svg/discuss-line.svg';
import LinkSvg from 'svg/link.svg';
import RedditLine from 'svg/reddit-line.svg';
import RefreshLine from 'svg/refresh-line.svg';
import ReplyLine from 'svg/reply-line.svg';
import TagIcon from 'svg/tag-line.svg';
import QuestionIcon from 'svg/question-line.svg';
import { UserText } from "./UserText";

export function PostSmall({ post, initialVotes, profile }) {
    return <div>
        <Tags thing={post} />
        <div className="flex flex-row flex-wrap justify-start py-1">
            <Thumbnail post={post} />
            <div className="grow basis-1/2 sm:basis-4/5">
                <Link href={POST_DETAIL(post.id)}>
                    {post.title}
                </Link>
            </div>
        </div>
        <PostInfo post={post} />
        <PostButtons {... { post, initialVotes, profile, isFull: false }} />
    </div>
}

export function Thumbnail({ post }) {
    return <div className="px-2 grow basis-0 flex justify-center ">
        <div className="flex items-center w-[70px] h-[70px] bg-stone-500">
            {isValidHttpUrl(post.thumbnail)
                ? <a href={post.external_link}><img loading="lazy" src={post.thumbnail} alt="" /></a>
                : <QuestionIcon className="w-[70px] h-[70px] fill-stone-300" alt="" />
            }
        </div>
    </div>
}

export function PostInfo({ post }) {
    return <div className="flex flex-row flex-wrap justify-around py-1 text-stone-500 text-center gap-x-1">
        <div className="md:w-1/5 text-center">/r/{post.subreddit || "mm"}</div>
        <div className="md:w-1/5 text-center">/u/{post.user_name || "anon"}</div>
        <div className="md:w-1/5 text-center">{timeSinceShort(post.created)}</div>
        <div className="md:w-1/5 text-center">{netloc(post.external_link)}</div>
    </div>
}


export function PostButtons({ post, initialVotes, profile, isFull }) {
    const router = useRouter();
    const handleLoadRedditPost = () => {
        return API_LOAD_REDDIT_POST.post({ id: post.reddit_id })
            .then(response => { router.push(POST_DETAIL(response.data.id)) })
            .catch(error => {
                notAuthorizedToSignIn(error);
                throw error;
            });
    };

    return <div className="sm:flex sm:flex-row sm:justify-end">
        <div className="flex flex-row justify-around py-1 sm:w-1/2 lg:w-1/3">
            <VoteButtons thing={post} initialVotes={initialVotes} />
            <div id={`external-link-${post.id}`}><IconLink link={post.external_link} Img={LinkSvg} title="external link" /></div>
            <div id={`reddit-link-${post.id}`}><IconLink link={post.reddit_link} Img={RedditLine} title="reddit link" /></div>
            {profile.has_tags &&
                <div><NextIconLink href={SET_TAG(post.id)} imageObj={TagIcon} title="set tag" /></div>}
            {!isFull &&
                <div><a href={POST_DETAIL(post.id)} title="view comments"><DiscussLine className="w-6 fill-fuchsia-500"/></a></div>}
            {isFull &&
                <div><NextIconLink href={SUBMIT_COMMENT(post.id, null)} imageObj={ReplyLine} title="submit comment" /> </div>}
            {isFull && !post.is_local &&
                <div><TaskIcon title="refresh comments" func={handleLoadRedditPost} imageObj={RefreshLine} /></div>}
        </div>
    </div>
}

export function FullPost({ post, initialVotes, profile }) {
    return <div className="py-1 sm:py-4">
        <Tags thing={post} />
        {post.external_link && <MediaElement link={post.external_link} redditUrl={post.reddit_link} />}
        <div className="flex flex-row flex-wrap justify-start py-1">
            <Thumbnail post={post} />
            <div className="grow basis-1/2 sm:basis-4/5">
                <a href={POST_DETAIL(post.id)}>
                    {post.title}
                </a>
            </div>
        </div>
        {post.text && <div className="w-3/4 mx-auto">
            <UserText text={post.text} />
        </div>}
        <PostInfo post={post} />
        <PostButtons {... { post, initialVotes, profile, isFull: true }} />
    </div>
}
