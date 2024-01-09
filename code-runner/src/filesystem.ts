import * as fs from "fs";
import path from "node:path";

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

export default class FileSystem {
    private readonly cwd: string;

    constructor(cwd: string) {
        this.cwd = cwd;
    }

    async readProject() {
        return this.readRecursive(this.cwd);
    }

    async readDirectory(dir: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
    }

    async readFile(file: string): Promise<FSNode> {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    id: file,
                    type: 'file',
                    filename: path.basename(file),
                    content: data.toString()
                });
            });
        });
    }

    async isFile(file: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.stat(file, (statErr, stats) => {
                console.log("stats:", file, stats);
                if (statErr) {
                    reject(statErr);
                }
                resolve(stats.isFile());
            });
        });
    }

    async readRecursive(file: string): Promise<FSNode> {
        if (await this.isFile(file)) {
            console.log("file: ", file);
            return this.readFile(file);
        } else {
            console.log("dir: ", file);
            let children: FSNode[] = [];
            const dirs = await this.readDirectory(file);
            for (const dir of dirs) {
                const filePath = path.join(file, dir);
                children.push(await this.readRecursive(filePath));
            }
            return {
                id: file,
                type: 'dir',
                collapsed: false,
                name: file,
                children
            };
        }
    }
}