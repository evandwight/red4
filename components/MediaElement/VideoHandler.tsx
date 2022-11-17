import VideoHandlerHack from 'components/MediaElement/VideoHandlerHack';
import React, { useEffect, useState } from 'react';
// VideoHandlerMediaSource is large (uses mux.js) reduce initial bundle size by lazy loading
const VideoHandlerMediaSource = React.lazy(() => import('./VideoHandlerMediaSource'));

export function optimizeVideo(videoInfo, containerSize)  {
    let audioUrl;

    let optimize, optimizeUrl;
    const {url} =  videoInfo;

    if (containerSize.height < 360) {
        optimize = "360";
    } else if (containerSize.height < 480) {
        optimize = "480";
    } else {
        optimize = "720";
    }

    if (url.includes("DASH_1080")) {
        optimizeUrl = url.replace("DASH_1080", `DASH_${optimize}`);
    } else if (url.includes("DASH_720")) {
        optimizeUrl = url.replace("DASH_720", `DASH_${optimize}`);
    } else {
        optimizeUrl = url;
    }

    if (url.includes("v.redd.it")) {
        const regex = /([A-Z])\w+/g;
        audioUrl = url.replace(regex,"DASH_audio");
    }

    return {
        originalVideoUrl: url,
        videoUrl: optimizeUrl,
        height: videoInfo.height,
        width: videoInfo.width,
        hasAudio: videoInfo?.hasAudio,
        audioUrl: audioUrl,
        containerSize,
    }
}

export default function VideoHandler({ videoInfo, containerSize, onLoadingComplete }) {
    const [optimalVideoInfo, setOptimalVideoInfo] = useState(optimizeVideo(videoInfo, containerSize));
    const {videoUrl, audioUrl, hasAudio} = optimalVideoInfo;

    if (!hasAudio && !!audioUrl) {
        if ('MediaSource' in window) {
            console.log('separate audio - media source')
            return <VideoHandlerMediaSource {... {videoUrl, audioUrl}} onLoadingComplete={onLoadingComplete} />
        } else {
            console.log('separate audio - hack')
            return <VideoHandlerHack {... {videoUrl, audioUrl}} onLoadingComplete={onLoadingComplete} />
        }
    } else {
        console.log('all in one')
        return <video className="max-h-full max-w-full"
            controls autoPlay muted loop preload="auto" playsInline draggable={false}
            onLoadStart={onLoadingComplete}>
            <source data-src={videoUrl} src={videoUrl} type="video/mp4" />
        </video>
    }
}
