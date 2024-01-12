<script lang="ts">
    export let active = false;
    export let handler: () => void;
</script>

<button class={"flex flex-row items-center px-4 text-white text-nowrap mt-0.5 transition-colors hover:bg-neutral-700 " +
                (active ? "border-b-2 border-amber-400" : "")}
        on:click={handler}>
    <slot/>
</button>