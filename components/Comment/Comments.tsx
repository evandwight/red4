import { IconLink } from 'components/IconLink';
import { UserText } from 'components/Post';
import { Tags } from 'components/Thing/Tags';
import { VoteButtons } from 'components/VoteButtons';
import { COLLAPSE_COMMENT_LIMIT, CommentTreeNode } from 'lib/commentTree';
import { CommentType, InitialVotesType, PostType, ProfileType } from "lib/commonTypes";
import { SET_TAG, SUBMIT_COMMENT } from 'lib/paths';
import { filterByProfile, timeSinceShort } from 'lib/utils';
import { useCallback, useState } from 'react';
import AddIcon from 'svg/add-line.svg';
import ReplyLine from 'svg/reply-line.svg';
import SubtractIcon from 'svg/subtract-line.svg';
import TagIcon from 'svg/tag-line.svg';



type CommentsType = { post: PostType, nodes: CommentTreeNode[], profile: ProfileType, initialVotes: InitialVotesType,
    collapseChildren? : boolean }
export function Comments({ post, nodes, profile, initialVotes, collapseChildren = true }: CommentsType) {
    const [collapse, setCollapse] = useState(collapseChildren);
    const expandedNodes = collapse ? nodes.filter(node => node.collapseOrder <= COLLAPSE_COMMENT_LIMIT) : nodes;
    const collapsedNodeCount = nodes.length - expandedNodes.length;
    return <div>
        {expandedNodes.map((node, i) =>
            <Comment key={i} {...{ node, profile, post, initialVotes, collapseChildren:collapse }} />)}
        {collapse && collapsedNodeCount > 0 && <CommentDepth depth={nodes[0].depth}>
            <button className="flex flex-row" onClick={() => setCollapse(false)}>
                <AddIcon className="w-6 fill-fuchsia-500 pr-1" /> 
                {collapsedNodeCount} more {collapsedNodeCount === 1 ? "reply" : "replies"}
            </button>
        </CommentDepth>}
    </div>
}

type ReactCommentType = { post: PostType, node: CommentTreeNode, profile: ProfileType, initialVotes: InitialVotesType,
    collapseChildren : boolean}
export function Comment({ node, profile, post, initialVotes, collapseChildren}: ReactCommentType) {
    const { comment } = node;
    const [expand, setExpand] = useState(true);
    const toggleExpand = useCallback(() => setExpand(!expand), [expand, setExpand]);
    const { show, reason } = filterByProfile(comment, profile);
    return <div id={`comment-${node.id}`}>
        <CommentDepth depth={node.depth}>
        <CommentInfo {...{ comment, expand, toggleExpand }} />
            {show && expand
                ? <div>
                    <div onClick={toggleExpand}><Tags thing={{ ...comment }} /></div>
                    <div onClick={toggleExpand}><UserText text={comment.text} /></div>
                    <CommentButtons {...{ post, comment, initialVotes, profile }} />
                </div>
                : expand ? <div className="bg-stone-500 text-center my-2">{reason}</div> : <></>}
            <hr className="border-stone-500" />
        </CommentDepth>
        {show && expand && <div>
            <Comments {... { post, nodes: node.children, profile, initialVotes, collapseChildren }} />
        </div>}
    </div>
}

export function CommentDepth({ depth, children }: { depth: number, children: JSX.Element[] | JSX.Element }) {
    return <div data-depth={depth} className="flex flex-row py-1">
        {depth > 0 && <div className={`flex flex-none justify-end px-2 comment-depth-${Math.min(depth - 1, 9)}`}>
            <div className={`w-1 h-full py-2 rounded-sm self-center comment-depth-color-${(depth - 1) % 6}`} />
        </div>}
        <div className="grow px-2">
            {children}
        </div>
    </div>
}

export function ToggleExpandButton({ expand, toggleExpand }: { expand: boolean, toggleExpand: () => void }) {
    const Img = expand ? SubtractIcon : AddIcon
    return <button title="expand collapse" onClick={toggleExpand}>
        <Img className="w-6 fill-fuchsia-500" />
    </button>
}

type CommentInfoType = { comment: CommentType, expand: boolean, toggleExpand: () => void }
export function CommentInfo({ comment, expand, toggleExpand }: CommentInfoType) {
    return <div onClick={toggleExpand} className="flex flex-row flex-wrap justify-left py-1 text-stone-500 text-center gap-x-1">
        <div className="px-1"><ToggleExpandButton {... {expand, toggleExpand}}/></div>
        <div className="px-1">by {`/u/${comment.user_name || "anon"}`}</div>
        <div className="px-1">{timeSinceShort(comment.created)}</div>
    </div>
}

type CommentButtonsType = {
    post: PostType, comment: CommentType,
    initialVotes: InitialVotesType, profile: ProfileType
}
export function CommentButtons({ post, comment, initialVotes, profile }: CommentButtonsType) {
    return <div className="sm:flex sm:flex-row sm:justify-end">
        <div className="flex flex-row justify-around py-1 sm:w-1/2 lg:w-1/3">
            <VoteButtons thing={comment} initialVotes={initialVotes} />
            <div><IconLink link={SUBMIT_COMMENT(post.id, comment.id)} Img={ReplyLine} title="submit comment" /></div>
            {profile.has_tags &&
                <div><IconLink link={SET_TAG(comment.id)} Img={TagIcon} title="set tag" /></div>}
        </div>
    </div>
}