<script lang="ts">
    import {editorStore} from "$lib/editor";

    export let active = false;
    export let id: string;
    export let filename: string;

    function handleClose() {
        editorStore.update((value) => {
            const idx = value.tabs.findIndex((f) => f.id === id);
            if (idx === -1) return value;

            if (value.tabs.length <= 1) {
                value.activeTab = null;
                value.editor?.setModel(null);
            } else if (idx + 1 < value.tabs.length) {
                const target = value.tabs[idx + 1];
                value.activeTab = target;
                value.editor?.setModel(target.model);
            } else {
                const target = value.tabs[idx - 1];
                value.activeTab = target;
                value.editor?.setModel(target.model);
            }

            value.tabs[idx].model.dispose();
            value.tabs = [...value.tabs.slice(0, idx), ...value.tabs.slice(idx + 1)];

            return value;
        });
    }

    function handleSwitchTab() {
        editorStore.update((value) => {
            value.activeTab = value.tabs.find((f) => f.id === id) || null;
            const model = value.activeTab?.model;
            if (model) {
                value.editor?.setModel(model);
            }
            return value;
        });
    }
</script>

<div class={"flex flex-row items-center text-white rounded-t " + (active ? "bg-[#1f1f1f]" : "")}>
    <button class="pl-6 pr-2 py-2 flex-nowrap text-nowrap" on:click={handleSwitchTab}>{filename}</button>
    <button class="hover:bg-neutral-600 rounded mr-2"
            on:click={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
             class="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
        </svg>
    </button>
</div>