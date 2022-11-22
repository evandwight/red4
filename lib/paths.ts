import { toQueryStr } from "lib/utils";

export const GITHUB = "https://github.com/evandwight/red4";

export const POSTS = (props: {sub: string, page: string, sort: string}) => `/posts?${toQueryStr(props)}`;
export const POST_DETAIL = (id: string) => `/post?id=${id}`;
export const ACCESS_DENIED = `/accessDenied`;
export const ABOUT = '/about';
export const ABOUT_TAGGING = `${ABOUT}#tagging`;
export const INVITE_TREE = '/inviteTree';

// Forms 
export const SUBMIT_POST = '/forms/post/submit';
export const SEARCH_POST = '/forms/post/search';

export const SUBMIT_COMMENT = (post_id, parent_id) =>
    `/forms/submitComment?post_id=${post_id}${!!parent_id ? `&parent_id=${parent_id}` : ""}`;

export const PROFILE = '/forms/profile';

export const INVITE = '/forms/invite/send';
export const ACCEPT_INVITE = '/forms/invite';

export const MANAGE_TAG = '/forms/tag/manage';
export const SET_TAG = (id) => `/forms/tag/set?id=${id}`;

// Admin

export const ADMIN_LOCAL = '/admin/local';