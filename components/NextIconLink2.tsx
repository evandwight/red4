import Link from "next/link";
import React from "react";


export default function NextIconLink2(props: { title: string, href?: string, children: any }) {
    if (!props.href) {
        return props.children
    } else {
        return <Link href={props.href} >
            <a title={props.title}>
                {props.children}
            </a>
        </Link>
    }
}