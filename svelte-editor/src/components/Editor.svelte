<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

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

        // Your monaco instance is ready, let's display some code!
        const model = monaco.editor.createModel(
            "console.log('Hello from Monaco! (the editor, not the city...)')",
            'javascript'
        );
        editor = monaco.editor.create(editorContainer, {
            theme: "vs-dark",
            scrollBeyondLastLine: true,
            automaticLayout: false, // we use automatic layout to shrink
            padding: {
                top: 24
            }
        });
        editor.setModel(model);

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

