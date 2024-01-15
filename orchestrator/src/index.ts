import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import {Docker} from "node-docker-api";
import {getPortPromise} from "portfinder";
import {Container} from "node-docker-api/lib/container";
import {logger} from "./logger";


dotenv.config();
const configuration = {
    host: process.env.HOSTNAME || 'localhost',
    port: Number.parseInt(process.env.PORT || '8000'),
};

logger.info('starting application');

const app = express();
const server = http.createServer(app);

app.use(cors());

const docker = new Docker({
    socketPath: "\\\\.\\pipe\\docker_engine"
});

docker.container.list().then(containers => {
    logger.info("cleaning up all containers...");
    for (const container of containers) {
        logger.debug(`cleaning up container ${container.id}`);
        container.stop(() => {
        })
            .then(stopped => stopped.delete())
            .then((_) => {
                logger.debug(`cleaned up container ${container.id}`);
            });
    }
});

const openContainers: Container[] = [];

function cleanupHandler() {
    logger.info('cleaning up before exiting');
    for (const container of openContainers) {
        logger.debug(`cleaning up container ${container.id}`);
        container.stop(() => {
        })
            .then(stopped => stopped.delete())
            .then((_) => {
                logger.debug(`cleaned up container ${container.id}`);
            });
    }
    process.exit(0);
}

process.on('SIGINT', cleanupHandler);
process.on('SIGTERM', cleanupHandler);
process.on('SIGQUIT', cleanupHandler);

interface CreateContainerResponse {
    host: string,
    port: number,
}

app.post('/api/coderunner', async (req, res) => {
    try {
        const port = await getPortPromise();
        logger.info(`starting new container mapped on port ${port}`);
        const container = await docker.container.create({
            "Image": "coderunner:test",
            "ExposedPorts": {
                "3000/tcp": {}
            },
            "Entrypoint": ["/usr/bin/npm", "run", "start"],
            "HostConfig": {
                "PortBindings": {
                    "3000/tcp": [{"HostPort": `${port}`}]
                }
            }
        }).then(container => {
            logger.info('created container %s', container.id);
            return container.start();
        }).then(container => {
            logger.info('started container %s', container.id);
            return container;
        });

        openContainers.push(container);
        const body: CreateContainerResponse = {
            host: configuration.host,
            port: port
        };
        res.send(body);
    } catch (err: unknown) {
        logger.error('failed to create container', err);
        res.status(500).send(err);
    }
});

server.listen(configuration.port, () => {
    logger.info(`server started on port ${configuration.port}`);
});
