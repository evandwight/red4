import Link from "next/link";
import React from "react";

export function TextLink({ href, children }: {href: string, children: any}) {
    return <Link href={href}><a className="underline text-fuchsia-600">{children}</a></Link>
}