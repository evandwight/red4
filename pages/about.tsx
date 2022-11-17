import { TextLink } from "components/TextLink";
import { INVITE_TREE } from "lib/paths";
import Head from "next/head";

export default function About() {
    return <>
        <Head>
            <title>About</title>
        </Head>
        <h2>About</h2>
        <div>
            <p>Mm is community centered on link aggregation and discussion. A dumb pipe - post office style - designed to encourage a healthy community:</p>

            <ul className="list-disc list-inside">
                <li>a tagging system to categorize and filter submissions</li>
                <li>a user <TextLink href={INVITE_TREE}>invitation tree</TextLink> to combat spam</li>
                <li>a strong commitment to transparency</li>
                <li><TextLink href="https://github.com/evandwight/red4">open</TextLink> algorithms</li>
            </ul>
        </div>
        <h2>Questions or comments?</h2>
        <div>
            Email evan@domain.com
        </div>
    </>
}
