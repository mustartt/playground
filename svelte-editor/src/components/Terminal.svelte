<script lang="ts">
    import {onMount} from 'svelte';
    import {io, Socket} from 'socket.io-client';

    let socket: Socket;
    let terminal: any;

    onMount(async () => {
        const {Terminal} = await import('xterm');
        const {FitAddon} = await import('xterm-addon-fit');
        const term = new Terminal({
            cursorBlink: true,
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminal);
        fitAddon.fit();

        for (let i = 0; i < 800; i++) {
            term.write('Hello World ');
        }
        term.onData((data: any) => {
            console.log(data);
        });

        socket = io('http://localhost:3000', {
            path: '/socket',
            timeout: 5000,
            reconnectionAttempts: 5,
            query: {
                rows: 24,
                cols: 80
            }
        });

        socket.on('connect', () => {
            console.log('socket connected');

            socket.on('data', (data) => {
                console.log('socket', data);
                term.write(data);
            });

            setTimeout(() => {
                console.log('socket timer expired');
                socket.emit('close');
            }, 5000);
        });
    });
</script>

<link rel="stylesheet" href="node_modules/xterm/css/xterm.css"/>
<div class="h-full" bind:this={terminal}/> <!-- bind the element to the 'terminal' var -->