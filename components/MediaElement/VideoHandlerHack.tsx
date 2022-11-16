import { useRef } from "react";


export default function VideoHandler({ videoUrl, audioUrl, onLoadingComplete }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    return <div>
        <audio ref={audioRef} src={audioUrl}/>
        <video ref={videoRef} className="max-h-full max-w-full"
        controls muted loop preload="auto" playsInline draggable={false}
        onLoadStart={onLoadingComplete}
        onSeeked={(event) => videoRef.current && audioRef.current?.fastSeek(videoRef.current.currentTime)}
        onPause={(event) => audioRef.current?.pause()}
        onPlay={(event) => audioRef.current?.play()}>
        <source data-src={videoUrl} src={videoUrl} type="video/mp4" />
    </video>
        
    </div>
}
