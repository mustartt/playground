import os from "os";
import * as pty from 'node-pty';
import {Socket} from "socket.io";


export interface TerminalOpenRequest {
    rows: number,
    cols: number,
}

export interface TerminalResizeRequest {
    rows: number,
    cols: number,
}

export interface TerminalCloseRequest {
}

export default class ShellProcess {
    private proc: pty.IPty;

    constructor(request: TerminalOpenRequest) {
        const isWindows = os.platform() === 'win32';
        const shell = isWindows ? 'powershell.exe' : 'bash';
        this.proc = pty.spawn(shell, [], {
            name: 'xterm-256color',
            cols: request.cols,
            rows: request.rows,
            cwd: isWindows ? process.env.USERPROFILE : process.env.HOME,
            env: Object.assign({TEST: "Environment vars work"}, process.env),
            useConpty: false
        });
    }

    public register(socket: Socket) {
        this.proc.onData((data: string) => {
            socket.emit('data', data);
        });
        socket.on('data', (data: string) => {
            this.proc.write(data);
        });
        this.proc.onExit((ec) => {
            socket.emit('close', {
                exitCode: ec.exitCode.valueOf()
            });
        });
        socket.on('resize', (resize: any) => {
            const {rows, cols} = resize;
            this.proc.resize(cols, rows);
        });
        socket.on('close', () => {
            this.proc.kill();
        });
        socket.on('disconnect', (reason, description) => {
            this.proc.kill();
        });
    }
}