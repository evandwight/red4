import Link from "next/link";
import React from "react";


export default function NextIconLink(props: { title: string, href?: string, imageObj: any }) {
    if (!props.href) {
        return <props.imageObj className="w-6 fill-stone-200" />
    } else {
        return <Link href={props.href} >
            <a title={props.title}>
                <props.imageObj className="w-6 fill-fuchsia-500" />
            </a>
        </Link>
    }
}