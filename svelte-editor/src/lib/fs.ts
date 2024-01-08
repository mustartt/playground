import {writable} from "svelte/store";

export interface FileNode {
    id: string;
    type: 'file';
    filename: string;
    content: string;
}

export interface DirectoryNode {
    id: string;
    type: 'dir';
    collapsed: boolean;
    name: string;
    children: Array<FSNode>;
}

export type FSNode = FileNode | DirectoryNode;

export const fsStore = writable<FSNode>({
    id: 'root',
    type: 'dir',
    collapsed: false,
    name: "root",
    children: [
        {
            id: '123',
            type: 'file',
            filename: 'hello world.py',
            content: "print('Hello World!')"
        },
        {
            id: '456',
            type: 'dir',
            name: 'other',
            collapsed: false,
            children: [
                {
                    id: '789',
                    type: 'file',
                    filename: 'test.py',
                    content: "print('Hello World!')"
                },
            ]
        }
    ]
});

export function toggle(node: FSNode, id: string) {
    if (node.type === 'file') {
        return node;
    }
    if (node.id === id) {
        return {
            ...node,
            collapsed: !node.collapsed
        };
    }
    node.children = node.children.map((node) => toggle(node, id));
    return node;
}

