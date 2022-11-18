import { TextLink } from "components/TextLink";
import { ABOUT_TAGGING, GITHUB, INVITE_TREE } from "lib/paths";
import Head from "next/head";

export default function About() {
    return <>
        <Head>
            <title>About</title>
        </Head>
        <h2>About</h2>
        <div>
            <p>Mm is community centered on link aggregation and discussion. A dumb pipe - post office style - with features designed to encourage a healthy community:</p>

            <ul className="list-disc list-inside">
                <li>a <TextLink href={ABOUT_TAGGING}>tagging</TextLink> system to categorize and filter submissions</li>
                <li>a user <TextLink href={INVITE_TREE}>invitation tree</TextLink> to combat spam</li>
                <li>a strong commitment to transparency</li>
                <li>open algorithms - <TextLink href={GITHUB}>github</TextLink></li>
                <li>restoring locked and removed reddit submissions - continue the conversation</li>
            </ul>
        </div>
        <h2 id="tagging">Tagging</h2>
        <div>
            <p>Most moderation on reddit removes submissions in order to improve content quality. However, removal is heavy handed. Tagging and letting the user decide whether to filter by that tag achieves the same goal, without draconian rule.</p>
            <p>Further, optional tagging removes the need for trust. If the tag doesn't help you, then you don't need to use it. On mm, any invited account can create a tag and help filter feeds. On mm there are:</p>
            <ul className="list-disc list-inside">
                <li>more people tagging</li>
                <li>better quality feeds</li>
                <li>less stressed moderators</li>
            </ul>
        </div>
        <h2>Questions or comments?</h2>
        <div>
            Email evan@domain.com
        </div>
    </>
}
