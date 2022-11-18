import { define_tag, tag, VoteDirection } from '@prisma/client';
import { CommentTreeNode } from "lib/commentTree";
import { InitialVotesType, PostType, ProfileType } from 'lib/commonTypes';
import { z } from "zod";
import { ApiUrlNoArg, createApiUrl, createApiUrlNoBody, FormErrorType } from "./ApiUrl";
import { ApiGetNoArg, createApiGet } from "./ApiGet";




export const API_POSTS = createApiGet(
    '/api/posts',
    z.object({
        page: z.string().regex(/[1-9][0-9]*/).default("1"),
        sub: z.string().default("all"),
        sort: z.string().regex(/hot|new/).default("hot"),
    }))
    <{ posts: PostType[] }>();

export const API_POST = createApiGet(
    '/api/post',
    z.object({ id: z.string().uuid(), }))
    <{ post: PostType }>();

export const API_COMMENTS = createApiGet(
    '/api/comments',
    z.object({ id: z.string().uuid(), }))
    <{ commentTree: CommentTreeNode[] }>();

export const API_VOTE = createApiUrlNoBody(
    '/api/vote',
    z.object({
        thing_id: z.string().uuid(),
        direction: z.nativeEnum(VoteDirection),
    }))
    <{ thing_id: string, direction: VoteDirection }>();

export const API_GET_VOTES = createApiUrl(
    '/api/getVotes',
    z.undefined(),
    z.object({ thing_ids: z.array(z.string().uuid()), }))
    <{ votes: InitialVotesType }>();

export const API_GET_PROFILE = new ApiUrlNoArg<{ profile: ProfileType }>('/api/profile');

export const API_LOAD_REDDIT_POST = createApiUrlNoBody(
    '/api/loadRedditPost',
    z.object({ id: z.string().regex(/[A-Za-z0-9]+/) }))
    <{ id: string }>();


// Forms

export const API_FORM_SUBMIT_POST = createApiUrl(
    '/api/forms/post/submit',
    z.undefined(),
    z.object({
        title: z.string().max(2000),
        text: z.string().max(5000).optional(),
        link: z.string().url().max(2000).optional(),
        overrideMeanTag: z.boolean().optional(),
        submitAnyways: z.boolean().optional(),
    }))
    <(FormErrorType & {enableOverrideMean?: boolean, enableSubmitAnyways?: boolean }) | { id: string }>();

export const API_FORM_SEARCH_POST = createApiUrl(
    '/api/forms/post/search',
    z.undefined(),
    z.object({ search_term: z.string().max(5000), }))
    <(FormErrorType & { notFound?: string }) | { id: string }>();

export const API_FORM_SUBMIT_COMMENT = createApiUrl(
    '/api/forms/submitComment',
    z.object({
        post_id: z.string().uuid(),
        parent_id: z.string().uuid().optional()
    }),
    z.object({
        text: z.string().max(5000),
        overrideMeanTag: z.boolean().optional(),
        submitAnyways: z.boolean().optional(),
    }))
    <(FormErrorType & {enableOverrideMean?: boolean, enableSubmitAnyways?: boolean }) | { id: string }>();

export const API_FORM_PROFILE = createApiUrl(
    '/api/forms/profile',
    z.undefined(),
    z.object({
        filter_tags: z.array(z.object({tag_id: z.string(), value: z.boolean()}))
    }))
    <FormErrorType | { }>();

export const API_FORM_INVITE_SEND = createApiUrl(
    '/api/forms/invite/send',
    z.undefined(),
    z.object({ email: z.string().email(), }))
    <FormErrorType | { code: string }>();


export const API_FORM_INVITE_ACCEPT = createApiUrl(
    '/api/forms/invite/accept',
    z.undefined(),
    z.object({ code: z.string(), }))
    <FormErrorType | {}>();

export const API_FORM_TAG_CREATE = createApiUrl(
    '/api/forms/tag/create',
    z.undefined(),
    z.object({ tag_id: z.string(), }))
    <FormErrorType | { tags: define_tag[] }>();

export const API_FORM_TAG_SET = createApiUrl(
    '/api/forms/tag/set',
    z.object({thing_id: z.string().uuid()}),
    z.array(z.object({tag_id: z.string(), value: z.boolean()})))
    <FormErrorType | { tags: {[key:string]:tag} }>();