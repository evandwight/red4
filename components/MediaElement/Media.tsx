import React, { useCallback, useEffect, useRef, useState } from "react";
import Gallery from "./Gallery";
import type { RedditMediaState } from "./lib/redditMediaState";
import { getRedditMediaState } from "./lib/redditMediaState";

import { IFrameImage, IFrameTweet, ImageWrapper } from './ImageWrapper';
import VideoHandler from "components/MediaElement/VideoHandler";

const Media = ({
    post,
    setShowSpinner,
    containerSize,
}) => {
    const mediaRef = useRef<HTMLDivElement>(null);
    const [redditMediaState, setRedditMediaState] = useState<RedditMediaState>({ isLoaded: false });

    const onLoaded = useCallback(() => {
        setShowSpinner(false);
    }, [setShowSpinner]);

    useEffect(() => {
        getRedditMediaState(post, containerSize).then((ms) => {
            setRedditMediaState(ms);
            const { isMP4, isImage, isIFrame, isTweet, isGallery } = ms;
            if ((isIFrame && !ms.isTweet)
                || (!isImage && !isTweet && !isMP4 && !isIFrame && !isGallery)) {
                onLoaded();
            }
        });
    }, [post, containerSize, onLoaded]);

    let child;
    const { isLoaded,
        isMP4, isImage, isIFrame, isTweet, isGallery,
        galleryInfo, imageInfo, videoInfo, videoAudio, iFrame } = redditMediaState;

    if (!isLoaded) {
        child = <></>
    } else if (isImage && !isIFrame && !isMP4) {
        child = <ImageWrapper {...{ post, imageInfo, onLoadingComplete: onLoaded, containerSize }} />
    } else if (isGallery) {
        child = <Gallery
            images={galleryInfo}
            maxheight={containerSize.height}
            postMode={true}
            mediaRef={mediaRef}
            uniformHeight={false}
            onLoadingComplete={onLoaded}
        />
    } else if (isTweet) {
        child = <IFrameTweet post={post} onLoadingComplete={onLoaded} />
    } else if (isIFrame && !isTweet) {
        child = <IFrameImage iFrame={iFrame} />
    } else if (isMP4 && !isIFrame) {
        child = <VideoHandler videoInfo={videoInfo} audio={videoAudio} onLoadingComplete={onLoaded} />
    } else {
        console.log({post})
        child = <a title="external link" href={post.external_link}>
            whoops
        </a>;
    }
    
    return <div className="flex justify-center items-center w-full h-full" ref={mediaRef}>
        {child}
    </div>
};

export default Media;
