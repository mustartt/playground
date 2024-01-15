import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import {Docker} from "node-docker-api";
import {getPortPromise} from "portfinder";
import {Container} from "node-docker-api/lib/container";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());

const docker = new Docker({
    socketPath: "\\\\.\\pipe\\docker_engine"
});

docker.container.list().then(containers => {
    console.log("cleaning up all containers...");
    for (const container of containers) {
        console.log("cleaning up container", container.id);
        container.stop(() => {
        })
            .then(stopped => stopped.delete())
            .then((_) => {
                console.log("cleaned up container", container.id);
            });
    }
});

interface CreateContainerResponse {
    host: string,
    port: number,
}


const openContainers: Container[] = [];

app.post('/api/coderunner', async (req, res) => {
    try {
        const port = await getPortPromise();
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
            return container.start();
        });

        openContainers.push(container);

        const body: CreateContainerResponse = {
            host: 'unknown',
            port: port
        };
        res.send(body);
    } catch (err: unknown) {
        res.status(500).send(err);
    }
});

server.listen(8000, () => {
    console.log("server started on port", 8000);
});

