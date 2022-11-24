export function extractLinks(text: string) {
    const links: string[] = [];
    const linkRegex = /(^|[^\\])\[((?:[^\n\]]|\\\])+)\]\(((?:[^\n\]]|\\\))+)\)/g;
    text = text.replace(linkRegex, (match, p1, p2, p3) => {
        console.log({p1,p2,p3});
        links.push(p3);
        return `${p1}${p2}[${links.length}]`
    });
    console.log(text);
    return {
        text,
        links,
    }
}