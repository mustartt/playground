<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
    import {editorStore, fsStore} from "$lib/editor";
    import type {Socket} from "socket.io-client";
    import {socketStore} from "$lib/socket";

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;
    let container: any;
    let resizeObserver: any;
    let timeoutId: any;
    let socket: Socket;
    let fileTimeoutId: any;

    socketStore.subscribe((value) => {
        socket = value.socket;
    });

    onMount(async () => {
        monaco = (await import('$lib/monaco')).default;

        editor = monaco.editor.create(editorContainer, {
            theme: "vs-dark",
            scrollBeyondLastLine: true,
            automaticLayout: false, // we use automatic layout to shrink
            padding: {
                top: 12
            },
            model: null
        });
        editorStore.update((value) => {
            value.editor = editor;
            return value;
        });

        resizeObserver = new ResizeObserver((entries) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                editor.layout();
            }, 25);
        });
        resizeObserver.observe(container);

        fsStore.subscribe((value) => {
            clearTimeout(fileTimeoutId);
            fileTimeoutId = setTimeout(() => {
                console.log('flush start');
                socket.emit('fs-flush', value);
            }, 1000);
        });
        socket.on('fs-flush', (value) => console.log('flush done'));
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<div class="flex-auto bg-black min-h-0" bind:this={container}>
    <div class="flex-auto h-full" bind:this={editorContainer}></div>
</div>

