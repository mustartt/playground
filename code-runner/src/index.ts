import express from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import cors from 'cors';
import * as os from 'os';
import * as pty from 'node-pty';
import {ParsedUrlQuery} from "node:querystring";
import ShellProcess, {TerminalOpenRequest} from "./terminal";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: "/socket",
    cors: {
        origin: '*',
        methods: '*'
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function spawnTerminal(rows: number, cols: number) {
    const isWindows = os.platform() === 'win32';
    const shell = isWindows ? 'powershell.exe' : 'bash';

    return pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: cols,
        rows: rows,
        cwd: isWindows ? process.env.USERPROFILE : process.env.HOME,
        env: Object.assign({TEST: "Environment vars work"}, process.env),
        useConpty: false
    });
}

function getConnectQuery(query: ParsedUrlQuery): TerminalOpenRequest {
    return {
        rows: parseInt(query.rows as string) || 24,
        cols: parseInt(query.cols as string) || 80,
    };
}

io.on('connection', (socket) => {
    console.log('a user connected');

    const openRequest = getConnectQuery(socket.handshake.query);
    const proc = new ShellProcess(openRequest);
    proc.register(socket);
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});