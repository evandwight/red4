import { MaxHeap } from '@datastructures-js/heap';
import { CommentType } from 'lib/commonTypes';

export interface CommentTreeNode {
    children: CommentTreeNode[],
    comment: CommentType,
    id: string,
    parent_id: string | null,
    score: number,
    collapseOrder: number,
    depth: number,
}

export function createCommentTree(comments: CommentType[]) {
    let nodes: CommentTreeNode[] = comments.map(c => ({ comment: c, children: [], id: c.id, parent_id: c.parent_id, score: c.reddit_score + c.score, collapseOrder: 0, depth: 0 }));
    const scoreSort = (a, b) => b.score - a.score;
    nodes.sort(scoreSort);
    const nodeMap: { [key: string]: CommentTreeNode } = nodes.reduce((pv, cv) => { pv[cv.id] = cv; return pv; }, {});
    let root: CommentTreeNode[] = [];

    nodes.forEach(node => !!node.parent_id ? nodeMap[node.parent_id]?.children.push(node) : root.push(node));

    setDepth(root);

    let heap = new MaxHeap<CommentTreeNode>(val => val.score);
    let count = 1;
    while (!heap.isEmpty) {
        const node = heap.pop();
        node.collapseOrder = count;
        count += 1;
        node.children.forEach(val => heap.push(val));
    }

    return root;
}

export function setDepth(nodes, depth = 0) {
    nodes.forEach(node => {
        node.depth = depth;
        setDepth(node.children, depth + 1)
    });
}