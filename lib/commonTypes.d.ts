import { comment, post, profile, vote, VoteDirection } from "@prisma/client";
import { post_with_score } from "prisma/generated/client-views";

export type VotesType = {[key: string]: VoteDirection};
export type InitialVotesType = VotesType | null;

export type DisplayTags = {tag_id: string, value: boolean}[];
export type PostType = (post_with_score | post) & {tags: DisplayTags};
export type CommentType = comment & {tags: DisplayTags};
export type ThingType = {tags: DisplayTags};

// Alias for ease of use
export type ProfileType = profile & {tag_filter: {[key:string]: boolean}};
export type VoteType = vote;
