import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import Media from './Media';

export function MediaElement({ link, redditUrl }: { link: string, redditUrl: string }) {
    if ((/\.(jpe?g|tiff?|png|webp|bmp|svg)$/i).test(link)) {
        return <DirectMediaElement link={link}/>
    } else if (redditUrl) {
        return <RedditMediaElement redditUrl={redditUrl}/>
    } else {
        return <></>
    }
}

export function DirectMediaElement({link}) {
    const containerRef = useRef(null);
    return <Container containerRef={containerRef} showSpinner={false}>
        <div className="flex justify-center items-center w-full h-full">
            <img src={link} alt="content" className="max-h-full max-w-full"/>
        </div>
    </Container>
}

export function RedditMediaElement({redditUrl}) {
    const [post, setPost] = useState<any | null>(null);
    const [showSpinner, setShowSpinner] = useState(true);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    // cors failure without www
    redditUrl = redditUrl.replace(/^https:\/\/reddit.com/, "https://www.reddit.com")
    useEffect(() => {
        fetch(`${redditUrl}.json?raw_json=1&profile_img=true&sr_detail=true`).then(response => 
            response.json()).then((json) => {
            setPost(json[0]?.data?.children?.[0]?.data)
        }).catch((error) => {
            console.log(error);
        })
    }, [redditUrl]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            const { width, height } = event[0].contentRect;
            setContainerSize({ width, height })
        });

        if (containerRef?.current) {
            resizeObserver.observe(containerRef.current);
        }
    }, [containerRef]);
    return <Container {... {containerRef, showSpinner}}>
        {post && <Media post={post} setShowSpinner={setShowSpinner} containerSize={containerSize} />}
    </Container>
}

export function Container({children, containerRef, showSpinner}) {
    return <div ref={containerRef} className={`h-[75vh] w-full px-2 bg-stone-500 ${showSpinner ? "overflow-y-hidden": "overflow-y-scroll"} overflow-x-hidden`}>
        {showSpinner && <div className="relative mx-auto w-full h-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <ImSpinner2 className="w-8 h-8 animate-spin" />
            </div>
        </div>}
        {children}
    </div>
}