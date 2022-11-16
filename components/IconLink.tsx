import React from "react";

export function IconLink({ link, Img, title }: {link: string, Img: any, title: string}) {
    if (!link) {
        return <Img className="w-6 fill-stone-200"/>
    } else {
        return <a title={title} href={link}>
            <Img className="w-6 fill-fuchsia-500"/>
        </a>
    }
}