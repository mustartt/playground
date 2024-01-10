<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import {io, Socket} from 'socket.io-client';
    import {socketStore} from "$lib/socket.js";

    let socket: Socket;
    let terminal: any;
    let container: any;
    let resizeObserver: any;
    let resizeTimeout: any;

    const xtermjsTheme = {
        foreground: '#F8F8F8',
        background: '#2D2E2C',
        selectionBackground: '#5DA5D533',
        selectionInactiveBackground: '#555555AA',
        black: '#1E1E1D',
        brightBlack: '#262625',
        red: '#CE5C5C',
        brightRed: '#FF7272',
        green: '#5BCC5B',
        brightGreen: '#72FF72',
        yellow: '#CCCC5B',
        brightYellow: '#FFFF72',
        blue: '#5D5DD3',
        brightBlue: '#7279FF',
        magenta: '#BC5ED1',
        brightMagenta: '#E572FF',
        cyan: '#5DA5D5',
        brightCyan: '#72F0FF',
        white: '#F8F8F8',
        brightWhite: '#FFFFFF'
    };

    interface TerminalClose {
        exitCode: number;
    }

    socketStore.subscribe((value) => {
        socket = value.socket;
    });

    onMount(async () => {
        const {Terminal} = await import('xterm');
        const {FitAddon} = await import('xterm-addon-fit');
        const term = new Terminal({
            cursorBlink: true,
            theme: xtermjsTheme
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminal);
        fitAddon.fit();

        term.writeln("");
        term.write('Initializing container...\r\n');
        term.writeln("");

        resizeObserver = new ResizeObserver((entries) => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                fitAddon.fit();
                const dim = fitAddon.proposeDimensions();
                socket.emit('resize', dim);
            }, 25);
        });
        resizeObserver.observe(container);

        socket.on('connect', () => {
            term.writeln("");
            term.writeln("Connected to container, starting terminal session...");
            term.writeln("");
            console.log('socket connected');

            socket.on('data', (data) => {
                term.write(data);
            });

            socket.on('close', (data: TerminalClose) => {
                term.write('\r\n');
                term.write(`Terminal closed with exit code ${data.exitCode}. \r\n`);
                socket.close();
            });

            term.onData((data) => {
                socket.emit('data', data);
            });
        });
    });

    onDestroy(() => {

    });
</script>

<link rel="stylesheet" href="node_modules/xterm/css/xterm.css"/>
<div class="flex-auto bg-black min-h-0" bind:this={container}>
    <div class="flex-auto h-full" bind:this={terminal}/> <!-- bind the element to the 'terminal' var -->
</div>
