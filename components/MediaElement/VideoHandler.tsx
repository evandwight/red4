import VideoHandlerHack from 'components/MediaElement/VideoHandlerHack';
import React from 'react';
// VideoHandlerMediaSource is large (uses mux.js) reduce initial bundle size by lazy loading
const VideoHandlerMediaSource = React.lazy(() => import('./VideoHandlerMediaSource'));



export default function VideoHandler({ videoInfo, audio, onLoadingComplete }) {
    console.log({ videoInfo, audio, onLoadingComplete });
    if (!videoInfo?.hasAudio && !!audio) {
        if ('MediaSource' in window) {
            console.log('separate audio - media source')
            return <VideoHandlerMediaSource videoUrl={videoInfo.url} audioUrl={audio} onLoadingComplete={onLoadingComplete} />
        } else {
            console.log('separate audio - hack')
            return <VideoHandlerHack videoUrl={videoInfo.url} audioUrl={audio} onLoadingComplete={onLoadingComplete} />
        }
    } else {
        console.log('all in one')
        return <video className="max-h-full max-w-full"
            controls autoPlay muted loop preload="auto" playsInline draggable={false}
            onLoadStart={onLoadingComplete}>
            <source data-src={videoInfo.url} src={videoInfo.url} type="video/mp4" />
        </video>
    }
}
