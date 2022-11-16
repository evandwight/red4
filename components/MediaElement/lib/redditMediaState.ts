import { findMediaInfo } from "./utils";

export type RedditMediaState = {
    isLoaded: boolean;
    isMP4?: boolean;
    isImage?: boolean;
    isIFrame?: boolean;
    isTweet?: boolean;
    isGallery?: boolean;
    galleryInfo?: any;
    imageInfo?: any;
    videoInfo?: any;
    videoAudio?: any;
    iFrame?: any;
}
export async function getRedditMediaState(post, containerSize): Promise<RedditMediaState> {
    const DOMAIN = window?.location?.hostname ?? "menosmalo.com";
    let mediaState: RedditMediaState = {isLoaded: true,};
    if (!post?.["mediaInfo"]) {
        console.log('findMediaInfo')
        let m = await findMediaInfo(post, false, DOMAIN);
        post["mediaInfo"] = m;
    }
    if (post["mediaInfo"].isVideo && !post?.selftext_html) {
        mediaState = { ...mediaState, ...findVideo({ post, containerSize }) };
    }
    if (post["mediaInfo"].isIframe) {
        mediaState = { ...mediaState, ...findIframe({ post }) };
    }
    if (!mediaState.isIFrame && !post?.selftext_html) {
        mediaState = { ...mediaState, ...findImage({ post, containerSize }) };
    }
    return mediaState;
}

function checkURL(url) {
    const placeholder =
        "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"; //"http://goo.gl/ijai22";
    //if (!url) return placeholder;
    if (!url?.includes("http")) return placeholder;
    return url;
};

function findImage({ post, containerSize }) {
    let isTweet, isIFrame, isGallery, isImage;
    let galleryInfo, imageInfo;
    isTweet = isIFrame = isGallery = isImage = false;
    galleryInfo = imageInfo = undefined;
    if (post.url.includes("twitter.com")) {
        isTweet = true;
        isIFrame = true;
    }

    if (post?.mediaInfo?.gallery) {
        isGallery = true;
        galleryInfo = post.mediaInfo.gallery;
    } else if (post?.mediaInfo?.imageInfo) {
        let num = post.mediaInfo.imageInfo.length - 1;

        //choose smallest image possible
        let done = false;
        let width = containerSize.width;
        post.mediaInfo.imageInfo.forEach((res, i) => {
            if (!done) {
                if (res.width > width) {
                    num = i;
                    done = true;
                }
            }
        });
        let imgheight = post.mediaInfo.imageInfo[num].height;
        let imgwidth = post.mediaInfo.imageInfo[num].width;
        isImage = true;
        imageInfo = {
            url: checkURL(post.mediaInfo.imageInfo[num].url.replace("amp;", "")),
            height: imgheight,
            width: imgwidth,
        };
        // }
    }
    return { isTweet, isIFrame, isGallery, isImage, galleryInfo, imageInfo };
};

function findAudio(url) {
    let regex = /([A-Z])\w+/g;
    let a: string = url;
    a = a.replace(regex, "DASH_audio");
    return { videoAudio: a };
};

const findVideo = ({ post, containerSize }) => {
    let isMP4 = false, isImage = false;
    let videoInfo;
    let imageData = {}, videoAudioData = {};

    let optimize = "720";
    let url = "";

    if (containerSize.height < 480) {
        optimize = "360";
    } else if (containerSize.height < 720) {
        optimize = "480";
    }

    if (post?.mediaInfo?.videoInfo) {
        url = post.mediaInfo.videoInfo.url;
        if (url.includes("DASH_1080")) {
            url = url.replace("DASH_1080", `DASH_${optimize}`);
        }
        if (url.includes("DASH_720")) {
            url = url.replace("DASH_720", `DASH_${optimize}`);
        }

        if (url.includes("v.redd.it")) {
            videoAudioData = findAudio(post.mediaInfo.videoInfo.url);
        }

        videoInfo = {
            url: url,
            height: post.mediaInfo.videoInfo.height,
            width: post.mediaInfo.videoInfo.width,
            hasAudio: post.mediaInfo.videoInfo?.hasAudio,
        }
        imageData = findImage({ post, containerSize });

        isImage = false;
        isMP4 = true;
    }
    return { ...imageData, ...videoAudioData, videoInfo, isMP4, isImage };
};

const findIframe = ({ post }) => {
    let isIFrame = false;
    let iFrame;
    if (post?.mediaInfo?.iFrameHTML) {
        iFrame = post.mediaInfo.iFrameHTML;
        isIFrame = true;
    }
    return { isIFrame, iFrame };
};