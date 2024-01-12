import * as fs from "fs";
import path from "node:path";
import {Socket} from "socket.io";

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
    private readonly root: string;

    constructor(cwd: string) {
        this.root = cwd;
    }

    register(socket: Socket) {
        socket.on('fs-reload', async () => {
            try {
                const data = await this.readProject();
                socket.emit('fs-reload', {
                    error: null,
                    data: data
                });
            } catch (err: unknown) {
                socket.emit('fs-reload', {
                    error: err,
                    data: null
                });
            }
        });
        socket.on('fs-flush', async (data: FSNode) => {
            try {
                await this.writeProject(data);
                socket.emit('fs-flush', {
                    error: null,
                });
            } catch (err: unknown) {
                socket.emit('fs-flush', {
                    error: err,
                });
            }
        });
    }

    async writeFiles(dir: string, data: FSNode): Promise<void> {
        return new Promise((resolve, reject) => {
            if (data.type === 'file') {
                const file = path.join(dir, data.filename);
                fs.appendFile(file, data.content, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            } else {
                const directory = path.join(dir, data.name);
                fs.mkdir(directory, {recursive: true}, async (err) => {
                    if (err) {
                        reject(err);
                    }
                    const requests = [];
                    for (const child of data.children) {
                        requests.push(this.writeFiles(directory, child));
                    }
                    await Promise.all(requests);
                    resolve();
                });
            }
        });
    }

    async cleanDirectory(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readdir(this.root, async (err, files) => {
                if (err) {
                    reject(err);
                }
                const requests = [];
                for (const file of files) {
                    requests.push(new Promise<void>((resolve1, reject1) => {
                        fs.rm(path.join(this.root, file),
                            {recursive: true, force: true},
                            (err) => {
                                if (err) {
                                    reject1(err);
                                }
                                resolve1();
                            });
                    }));
                }
                await Promise.all(requests);
                resolve();
            });
        });
    }

    async writeProject(data: FSNode): Promise<void> {
        await this.cleanDirectory();
        return new Promise((resolve, reject) => {
            fs.mkdir(this.root, {recursive: true}, async (err) => {
                if (err) {
                    reject(err);
                }
                const requests = [];
                for (const child of (data as DirectoryNode).children) {
                    requests.push(this.writeFiles(this.root, child));
                }
                await Promise.all(requests);
                resolve();
            });
        });
    }

    async readProject() {
        return this.readRecursive(this.root);
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
                if (statErr) {
                    reject(statErr);
                }
                resolve(stats.isFile());
            });
        });
    }

    async readRecursive(file: string): Promise<FSNode> {
        if (await this.isFile(file)) {
            return this.readFile(file);
        } else {
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
                name: path.basename(file),
                children
            };
        }
    }
}