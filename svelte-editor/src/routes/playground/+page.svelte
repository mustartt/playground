<script lang="ts">
    import SplitPane from "../../components/SplitPane.svelte";
    import Editor from "../../components/Editor.svelte";
    import Terminal from "../../components/Terminal.svelte";
    import FileViewer from "../../components/FileViewer.svelte";
    import EditorHeader from "../../components/EditorHeader.svelte";
    import StartStop from "../../components/ui/StartStop.svelte";
    import FileToggle from "../../components/ui/FileToggle.svelte";
</script>

<div class="h-screen flex flex-col p-2">
    <div class="flex-none flex flex-row justify-between items-center bg-neutral-800 h-12 mb-2 px-1 rounded">
        <div class="flex flex-row items-center space-x-2">
            <FileToggle/>
            <h1 class="text-lg text-white">
                Playground
            </h1>
        </div>
        <div class="flex flex-row items-center">
            <StartStop running={true}/>
        </div>
        <div class="flex flex-row items-center space-x-2">

        </div>
    </div>
    <div class="flex-auto flex flex-row min-h-0">
        <div class="bg-neutral-800 mr-2 w-[16rem] h-full rounded p-2">
            <FileViewer></FileViewer>
        </div>
        <div style="width: calc(100% - 16rem);">
            <SplitPane>
                <div slot="left" class="flex flex-col h-full">
                    <EditorHeader/>
                    <Editor/>
                    <div class="flex-none bg-neutral-800 h-8 rounded-b"></div>
                </div>
                <div slot="right" class="flex flex-col h-full">
                    <div class="flex-none bg-neutral-800 h-8 rounded-t"></div>
                    <Terminal></Terminal>
                    <div class="flex-none bg-neutral-800 h-8 rounded-b"></div>
                </div>
            </SplitPane>
        </div>
    </div>
</div>