<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: 'green' | 'red' | 'yellow' | 'blue' = 'green';
	
	const dispatch = createEventDispatcher();
</script>

<button class="p-3 w-full text-xs text-{color}-400 hover:text-{color}-400 bg-{color}-200 
							 bg-opacity-10 hover:bg-opacity-30 rounded-xl transition"
				on:click={() => { dispatch('click') }}>
	<slot/>
</button>