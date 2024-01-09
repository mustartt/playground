<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
    import {editorStore} from "$lib/editor";

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;
    let container: any;
    let resizeObserver: any;
    let timeoutId: any;

    onMount(async () => {
        // Import our 'monaco.ts' file here
        // (onMount() will only be executed in the browser, which is what we want)
        monaco = (await import('$lib/monaco')).default;

        editor = monaco.editor.create(editorContainer, {
            theme: "vs-dark",
            scrollBeyondLastLine: true,
            automaticLayout: false, // we use automatic layout to shrink
            padding: {
                top: 24
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
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<div class="flex-auto bg-black min-h-0" bind:this={container}>
    <div class="flex-auto h-full" bind:this={editorContainer}></div>
</div>

