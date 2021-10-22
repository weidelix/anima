<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition'

	export let border = '';
	export let image = '';
	export let name = '';

	const dispatch = createEventDispatcher();

	let down = 1; 
	let hover = false;
</script>

<div class="bg-white rounded-xl {border} shadow-xl transition hover:transform-gpu hover:scale-{down} bg-cover overflow-hidden" 
		on:click={() => dispatch('click')}
		on:mousedown={() => {down = 100}} on:mouseup={() => {down = 110}} 
		on:mouseleave={() => {down = 100; hover = false;}} on:mouseenter={() => {down = 110; hover = true;}}
		style=" background-image: url('{image}');">

	<div class="w-48 h-28 text-white transition {hover ? 'opacity-100' : 'opacity-0'}">
		<div class="bg-gradient-to-r from-black w-full h-full">
			<div class="flex flex-col flex-wrap justify-end h-full p-3">
				{#if hover}
					<div class="text-sm font-bold" transition:fly={{x: -50, duration: 200}}>{name}</div>
				{/if}
			</div>
		</div>
	</div>
</div>
