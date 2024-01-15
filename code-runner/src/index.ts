import express from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import cors from 'cors';
import {ParsedUrlQuery} from "node:querystring";
import ShellProcess, {TerminalOpenRequest} from "./terminal";
import FileSystem from "./filesystem";
import dotenv from 'dotenv';
import {logger} from "./logger";

dotenv.config();
const configuration = {
    workdir: process.env.WORKING_DIR,
    cwd: process.cwd()
};

logger.info('starting code-runner');

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

logger.info(`config: cwd ${configuration.cwd}`);
logger.info(`config: playground ${configuration.workdir}`);

const cwd = configuration.cwd;
if (!cwd) {
    logger.error('missing WORKING_DIR environment variable');
    process.exit(1);
}

function getConnectQuery(query: ParsedUrlQuery): TerminalOpenRequest {
    return {
        rows: parseInt(query.rows as string) || 24,
        cols: parseInt(query.cols as string) || 80,
    };
}

const initialTimeout = setTimeout(() => {
    logger.info('a user did not connect within time window, exiting');
    process.exit(0);
}, 10000);

io.on('connection', (socket) => {
    logger.info('a user connected');
    clearTimeout(initialTimeout);

    let clientTimeout: any;
    socket.on('heartbeat', () => {
        clearTimeout(clientTimeout);
        clientTimeout = setTimeout(() => {
            logger.info('user missed heartbeats exiting');
            process.exit(0);
        }, 10000);
    });

    const openRequest = getConnectQuery(socket.handshake.query);

    const proc = new ShellProcess(cwd, openRequest);
    const fs = new FileSystem(cwd);
    proc.register(socket);
    fs.register(socket);

    socket.on('disconnect', () => {
        setTimeout(() => {
            logger.info('user has disconnected exiting');
            process.exit(0);
        }, 1000);
    });
});

server.listen(3000, () => {
    logger.info('code-runner started on port 3000');
});