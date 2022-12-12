import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Error() {
    const router = useRouter();
    const {code, message} = router.query;
    return <>
        <Head><title>Error {code} - {message}</title></Head>
        <div>
            Error {code} -  {message}
        </div>
    </>
}

