import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Error() {
    const router = useRouter();
    const [{ code, message }, setError] = useState({ code: "500", message: "Unknown error" });
    useEffect(() => {
        if (router.isReady) {
            setError({ code: router.query.code as string, message: router.query.message as string });
        }
    }, [router]);
    return <>
        <Head><title>Error {code} - {message}</title></Head>
        <div>
            Error {code} -  {message}
        </div>
    </>
}

