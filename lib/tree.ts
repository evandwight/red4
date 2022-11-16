export interface TreeNode<T> {
    data: T,
    children: TreeNode<T>[],
    parentId: string | null,
    id: string,
}

export function listToTree<T>(list: T[], options: { key_id?: string, key_parent?: string }): TreeNode<T>[] {
    const { key_id, key_parent } = { key_id: "id", key_parent: "parent", ...options };
    const nodes = list.map(e => ({ id: e[key_id], parentId: e[key_parent], data: e, children: [] as TreeNode<T>[] }));
    const map = listToMap(nodes);
    const root = [] as TreeNode<T>[];
    for (const node of Object.values(map)) {
        if (node.parentId) {
            map[node.parentId].children.push(node);
        } else {
            root.push(node);
        }
    }

    return root;
}

export function listToMap<T>(list: T[], key_id = 'id'): { [key: string]: T; } {
    return list.reduce((pv, cv) => {
        pv[cv[key_id]] = cv;
        return pv;
    }, {});
}

export function treeMap<A, B>(tree: TreeNode<A>[], func: (data: A) => B): TreeNode<B>[] {
    return tree.map(node => ({ ...node, data: func(node.data), children: treeMap(node.children, func) }));
}

export function treeSort<T>(tree: TreeNode<T>[], compareFn: (a: TreeNode<T>, b: TreeNode<T>) => number): TreeNode<T>[] {
    return tree.map(node => ({ ...node, children: treeSort(node.children, compareFn).sort(compareFn) }));
}