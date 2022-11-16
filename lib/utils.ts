import { ProfileType, ThingType } from "lib/commonTypes";
import { signIn } from "next-auth/react";

export function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export function timeSinceShort(value: Date) {
    let seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000);
    let days = seconds / 86400;
    if (days > 365) {
        return `${(days / 365).toFixed(1)}y`;
    } else if (days >= 1) {
        return `${days.toFixed(1)}d`;
    } else {
        return `${(seconds / 3600).toFixed(1)}h`;
    }
}

export function netloc(text) {
    if (!text) {
        return 'self';
    } else {
        try {
            let url = new URL(text);
            return url.hostname;
        } catch (_) {
            return 'unknown';
        }
    }
}

export function getCsrfToken() {
    return (document.querySelector('[name=csrfmiddlewaretoken]') as any)?.value;
}

export function filterByProfile<T extends ThingType>(thing: T, profile: ProfileType) {
    for (const {tag_id, value} of thing.tags) {
        if (value && !profile.tag_filter[tag_id]) {
            return {show: false, reason: `hidden_${tag_id}`}
        }
    }
    return {show: true};
}

export function commentTreeToList(nodes) {
    return nodes.reduce((pv, cv) => pv.concat([cv], commentTreeToList(cv.children)), []);
}

export function notAuthorizedToSignIn(error) {
    if (error?.response?.status === 401) {
        signIn('cognito');
    }
}