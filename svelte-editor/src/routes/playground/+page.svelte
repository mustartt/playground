<script lang="ts">
    import SplitPane from "../../components/SplitPane.svelte";
    import Editor from "../../components/Editor.svelte";
    import Terminal from "../../components/Terminal.svelte";
    import FileViewer from "../../components/FileViewer.svelte";
</script>

<div class="h-screen flex flex-col">
    <div class="flex-none bg-white h-10"></div>
    <div class="p-2 flex-auto flex flex-row min-h-0">
        <div class="bg-neutral-800 mr-2 w-[16rem] h-full rounded">
            <FileViewer></FileViewer>
        </div>
        <div style="width: calc(100% - 16rem);">
            <SplitPane>
                <div slot="left" class="flex flex-col h-full">
                    <div class="flex-none bg-neutral-800 h-6 rounded-t"></div>
                    <Editor></Editor>
                    <div class="flex-none bg-neutral-800 h-6 rounded-b"></div>
                </div>
                <div slot="right" class="flex flex-col h-full">
                    <div class="flex-none bg-neutral-800 h-6 rounded-t"></div>
                    <Terminal></Terminal>
                    <div class="flex-none bg-neutral-800 h-6 rounded-b"></div>
                </div>
            </SplitPane>
        </div>
    </div>
</div>