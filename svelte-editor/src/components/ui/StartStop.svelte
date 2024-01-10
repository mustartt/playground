<script lang="ts">
    export let running = false;
</script>

<button class={"flex flex-row px-4 py-2 text-white rounded transition-colors duration-50 " +
                ((!running) ? "bg-green-700 hover:bg-green-600" : "bg-red-700 hover:bg-red-600")}>
    {#if (!running)}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clip-rule="evenodd"/>
        </svg>
        <span class="pl-1">Start</span>
    {:else }
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z"
                  clip-rule="evenodd"/>
        </svg>
        <span class="pl-1">Stop</span>
    {/if}
</button>