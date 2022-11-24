export function unescapeBackslash(text) {
    return text.replace(/\\(.)/g, "$1");
}

export function extractLinks(text: string) {
    let links: string[] = [];
    // \ = \x5C
    text = text.replace(/(^|[^\x5c])\[((?:[^\]\x5C]|\x5C.)+)\]\(((?:[^\)\x5C]|\x5C.)+)\)/mg,
        (match, p1, p2, p3) => {
            links.push(p3);
            return `${p1}${p2}[${links.length}]`
        });

    text = unescapeBackslash(text);
    links = links.map(unescapeBackslash);
    return {
        text,
        links,
    }
}