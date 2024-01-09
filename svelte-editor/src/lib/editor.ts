import {writable} from "svelte/store";
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

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

export interface OpenFile {
    id: string;
    filename: string;
    model: Monaco.editor.ITextModel;
}

export interface EditorStore {
    activeTab: OpenFile | null;
    tabs: Array<OpenFile>;
    fs: FSNode;
    editor: Monaco.editor.IStandaloneCodeEditor | null;
}

const fs: FSNode = {
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
                    id: '1',
                    type: 'file',
                    filename: 'test1.py',
                    content: "# test1.py"
                },
                {
                    id: '2',
                    type: 'file',
                    filename: 'test2.py',
                    content: "# test2.py"
                },
                {
                    id: '3',
                    type: 'file',
                    filename: 'test3.py',
                    content: "# test3.py"
                },
                {
                    id: '4',
                    type: 'file',
                    filename: 'test4.py',
                    content: "# test4.py"
                },
                {
                    id: '5',
                    type: 'file',
                    filename: 'test5.py',
                    content: "# test5.py"
                },
                {
                    id: '6',
                    type: 'file',
                    filename: 'test6.py',
                    content: "# test6.py"
                },
                {
                    id: '7',
                    type: 'file',
                    filename: 'test6.py',
                    content: "# test6.py"
                },
                {
                    id: '8',
                    type: 'file',
                    filename: 'test6.py',
                    content: "# test6.py"
                },
                {
                    id: '9',
                    type: 'file',
                    filename: 'test6.py',
                    content: "# test6.py"
                },
            ]
        }
    ]
};

export const editorStore = writable<EditorStore>({
    activeTab: null,
    tabs: [],
    fs: fs,
    editor: null
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

export function replace(node: FSNode, id: string, content: string) {
    if (node.type === "file") {
        return node.id === id ? {
            ...node,
            content
        } : node;
    }
    node.children = node.children.map((node) => replace(node, id, content));
    return node;
}

