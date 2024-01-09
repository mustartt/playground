<script lang="ts">
    import {type OpenFile, editorStore} from "$lib/editor";
    import {onDestroy} from "svelte";
    import EditorHeaderTab from "./EditorHeaderTab.svelte";

    let tabs: Array<OpenFile>;
    let activeId: string;
    const unsubscribe = editorStore.subscribe((value) => {
        tabs = value.tabs;
        activeId = value.activeTab?.id || '';
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="flex-none flex flex-row bg-neutral-800 h-8 rounded-t overflow-y-hidden overflow-x-auto">
    {#each tabs as tab}
        <EditorHeaderTab filename={tab.filename} id={tab.id} active={tab.id === activeId}/>
    {/each}
</div>