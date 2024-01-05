<script lang="ts">
    import SplitPane from "../../components/SplitPane.svelte";
    import Editor from "../../components/Editor.svelte";
    import Terminal from "../../components/Terminal.svelte";
</script>

<div class="p-2 h-screen">
    <SplitPane>
        <div slot="left" class="flex flex-col h-full">
            <div class="flex-none bg-neutral-800 h-6 rounded-t"></div>
            <div class="flex-1">
                <Editor></Editor>
            </div>
            <div class="flex-none bg-neutral-800 h-6 rounded-b"></div>
        </div>
        <div slot="right" class="flex flex-col h-full">
            <div class="flex-none bg-neutral-800 h-6 rounded-t"></div>
            <div class="flex-1 bg-black">
                <Terminal></Terminal>
            </div>
            <div class="flex-none bg-neutral-800 h-6 rounded-b"></div>
        </div>
    </SplitPane>
</div>
