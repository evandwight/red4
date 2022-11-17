import { useRef, useState } from "react";


export default function VideoHandlerHack({ videoUrl, audioUrl, onLoadingComplete }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [userStarted, setUserStarted] = useState(false);
    return <div>
        {!userStarted && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => {
                if (audioRef.current && videoRef.current) {
                    audioRef.current.play();
                    videoRef.current.play();
                    audioRef.current?.fastSeek(videoRef.current.currentTime);
                    setUserStarted(true);
                }
            }}>Start video</button>
        </div>}
        <audio ref={audioRef} loop src={audioUrl} />
        <video ref={videoRef} className="max-h-full max-w-full"
            muted loop preload="auto" playsInline draggable={false}
            controls={userStarted}
            onLoadStart={onLoadingComplete}
            onSeeked={(event) => videoRef.current && audioRef.current?.fastSeek(videoRef.current.currentTime)}
            onPause={(event) => audioRef.current?.pause()}
            onPlay={(event) => audioRef.current?.play()}>
            <source data-src={videoUrl} src={videoUrl} type="video/mp4" />
        </video>
    </div >
}
