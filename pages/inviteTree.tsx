import prisma from "lib/prisma";
import { listToMap, listToTree, treeMap, TreeNode, treeSort } from "lib/tree";
import { NextPageContext } from "next";
import Head from "next/head";
import styles from "styles/InviteTree.module.css";


export async function getStaticProps(context: NextPageContext) {
    const invites = await prisma.invite.findMany();
    const ids = invites.map(invite => invite.to_id);
    const profiles = await prisma.profile.findMany({ where: { id: { in: ids } } });
    const profileMap = listToMap(profiles);
    const tree = listToTree(invites, { key_id: "to_id", key_parent: "from_id" });
    const treeWithNames = treeMap(tree, (data) => ({ id: data.to_id, user_name: profileMap[data.to_id].user_name }));
    const treeWithSortedNames = treeSort(treeWithNames, (a, b) => a.data.user_name.localeCompare(b.data.user_name));

    return {
        props: { nodes: treeWithSortedNames },
        revalidate: 600,
    }
}

type NodeType = TreeNode<{ id, user_name }>;

export function InviteNodes({ nodes, depth }: { nodes: NodeType[], depth: number }) {
    const noparent = depth === 1 ? styles.noparent : "";
    const tree = depth === 1 ? styles.tree : "";
    return <ul className={`${tree} ${styles.user_tree} ${noparent} border-stone-300`}>
        {nodes.map(node => <li key={node.id} className={`${noparent}`}>
            {node.data.user_name}
            <InviteNodes nodes={node.children} depth={depth + 1} />
        </li>)}
    </ul>
}

export default function InviteTree({ nodes }) {
    return <>
        <Head><title>Invite tree</title></Head>
        <h2>Invite tree</h2>
        <InviteNodes nodes={nodes} depth={1}/>
    </>
}

