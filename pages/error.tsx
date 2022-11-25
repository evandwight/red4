import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Error() {
    const router = useRouter();
    const [{code, message}, setError] = useState({code: "500", message: "Unknown error"});
    useEffect(() => {
        if (router.isReady) {
            setError({code: router.query.code as string, message: router.query.code as string});
        }
    }, [router]);
    return <div>
        {code}
    </div>
}

