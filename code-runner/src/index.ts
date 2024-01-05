import express from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import cors from 'cors';
import * as os from 'os';
import * as pty from 'node-pty';
import {ParsedUrlQuery} from "node:querystring";

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

interface TerminalOpenRequest {
    rows: number,
    cols: number,
}

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

    const {rows, cols} = getConnectQuery(socket.handshake.query);
    const process = spawnTerminal(rows, cols);

    process.onData((data: string) => {
        socket.emit('data', data);
    });
    socket.on('data', (data: string) => {
        process.write(data);
    });

    process.onExit((ec) => {
        socket.emit('close', {
            exitCode: ec.exitCode.valueOf()
        });
        console.log(`process exited with ec ${ec.exitCode}.`);
    });

    socket.on('resize', (resize: any) => {
        const {rows, cols} = resize;
        process.resize(cols, rows);
    });

    socket.on('close', () => {
        process.kill();
    });

    socket.on('disconnect', (reason, description) => {
        process.kill();
        console.log('a user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});