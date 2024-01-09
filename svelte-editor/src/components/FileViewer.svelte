<script lang="ts">
    import {type FSNode, editorStore} from "$lib/editor";
    import {onDestroy} from "svelte";
    import File from "./File.svelte";

    let root: FSNode;

    const unsubscribe = editorStore.subscribe((value) => {
        root = value.fs;
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="flex flex-col w-full text-white">
    <File depth={0} file={root}></File>
</div>

