import {readable, writable} from "svelte/store";
import {io} from "socket.io-client";

const socket = io('http://localhost:3000', {
    path: '/socket',
    timeout: 5000,
    reconnectionAttempts: 5,
    query: {
        rows: 24,
        cols: 80
    }
});

socket.io.on("error", (err) => {
    console.error(err);
});

export const socketStore = writable({
    socket: socket
});
