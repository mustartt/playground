<script lang="ts">
    import {type DirectoryNode, type FSNode, fsStore} from "$lib/fs";
    import {onDestroy} from "svelte";
    import File from "./File.svelte";

    let root: FSNode;

    const unsubscribe = fsStore.subscribe((value) => {
        root = value;
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="flex flex-col w-full text-white">
    <File depth={0} file={root}></File>
</div>

