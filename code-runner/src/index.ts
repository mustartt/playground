import express from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import cors from 'cors';
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