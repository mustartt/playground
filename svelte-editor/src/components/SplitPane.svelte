<script lang="ts">
    import {onMount} from 'svelte';

    export let minWidth = 30;
    let splitterWidth = 8; /* 2 rem */
    let mousePos: any;
    let delta = 0;
    let isMouseDown = false;
    let containerW: any;
    let initialL: any;
    let leftW: any;
    let rightW: any;

    onMount(() => {
        leftW = (containerW - splitterWidth) / 2;
        rightW = (containerW - splitterWidth) / 2;
    });

    function handleMouseMove(e: any) {
        if (isMouseDown) {
            delta = mousePos - e.clientX;
            leftW =
                initialL - delta <= minWidth ?
                    minWidth
                    : initialL - delta >= containerW - splitterWidth - minWidth ?
                        containerW - splitterWidth - minWidth
                        :
                        initialL - delta;

            rightW = containerW - leftW - splitterWidth;
        }
    }

    function handleMouseDown(e: any) {
        mousePos = e.clientX;
        initialL = leftW;
        isMouseDown = true;
    }

    function handleMouseUp() {
        isMouseDown = false;
    }

    $: if (leftW && rightW && containerW && leftW + rightW !== containerW - splitterWidth) {
        const leftRatio = leftW / (leftW + rightW - splitterWidth / 2);
        leftW = containerW * leftRatio - splitterWidth / 2;
        rightW = containerW - leftW - splitterWidth / 2;
    }

</script>

<style>
    .window-hook {
        height: 100%;
        width: 100%;
        z-index: 5000;
        position: absolute;
        top: 0;
        left: 0;
    }

    .disable-select, .disable-select * {
        user-select: none; /* supported by Chrome and Opera */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        cursor: col-resize;
    }
</style>

<svelte:window
        on:mousemove={handleMouseMove}
        on:mouseup={handleMouseUp}
/>
<section
        bind:clientWidth={containerW}
        class={"flex h-full w-full bg-neutral-900 rounded"+ (isMouseDown ? " disable-select" : "")}
>
    <div
            style="width:{leftW}px !important"
            class="h-full w-1/2 rounded bg-neutral-800"
    >
        <slot name="left"></slot>
        {#if isMouseDown}
            <div class="window-hook"/>
        {/if}
    </div>
    <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Draggable Divider"
            aria-grabbed="{isMouseDown}"
            on:mousedown={handleMouseDown}
            class="flex h-full w-2 cursor-col-resize flex-col items-center justify-center rounded bg-neutral-900 hover:bg-neutral-500"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 14" width="2" height="14" fill="currentColor"
             class="text-neutral-400">
            <circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 1)"></circle>
            <circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 7)"></circle>
            <circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 13)"></circle>
        </svg>
    </div>
    <div
            style="width:{rightW}px !important"
            class="h-full w-1/2 rounded bg-neutral-800"
    >
        <slot name="right"></slot>
        {#if isMouseDown}
            <div class="window-hook"/>
        {/if}
    </div>
</section>

<!--<div class="h-screen w-screen bg-gray-50 p-5">-->
<!--    <SplitPane>-->
<!--        <div class="" slot="left">-->
<!--            Left-->
<!--        </div>-->
<!--        <div class="" slot="right">-->
<!--            Right-->
<!--        </div>-->
<!--    </SplitPane>-->
<!--</div>-->