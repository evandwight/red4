import { extractLinks } from "lib/userText";


export function UserText({ text }) {
    const { text: newText, links } = extractLinks(text);
    return <div className="break-all">
        <div>
            {newText.split('\n\n').map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <div>
            {links.map((link, i) => <p key={i}>
                [{i + 1}] - <a className="underline text-fuchsia-600" href={link}>
                    {link.length > 75 ? `${link.substring(0, 75)}...` : link}
                </a>
            </p>)}
        </div>
    </div>;
}
