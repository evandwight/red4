import { useRouter } from "next/router";
import { useEffect } from "react";

export function useStoreScrollPosition() {
    const router = useRouter();
    useEffect(() => {
        const handler = () => {
            const path = router.asPath;
            const scrollY = window.scrollY;
            sessionStorage.setItem(path, scrollY.toString());
        }
        router.events.on("routeChangeStart", handler);
        return () => router.events.off("routeChangeStart", handler);
    }, [router]);
}

export function useRestoreScrollPosition(loading) {
    const router = useRouter();
    useEffect(() => {
        if (!loading && router.isReady) {
            const key = router.asPath;
            const scrollY = sessionStorage.getItem(key);
            if (scrollY) {
                window.scrollTo({ top: parseFloat(scrollY) });
                sessionStorage.removeItem(key)
            }
        }
    }, [loading, router]);
}