<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;

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
            automaticLayout: true,
            padding: {
                top: 24
            }
        });
        editor.setModel(model);
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<div class="w-full h-full" bind:this={editorContainer}></div>