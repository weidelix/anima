<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let border = '';
	export let image = '';
	export let name = '';

	const dispatch = createEventDispatcher();

	let down = 1; 
	let hover = false;
</script>

<div class="bg-white rounded-xl {border} shadow-xl transition hover:transform-gpu hover:scale-110 bg-cover overflow-hidden" 
		 on:click={() => dispatch('click')}
		 on:mousedown={() => {down = 1}} on:mouseup={() => {down = 1.1}} 
		 on:mouseleave={() => {down = 1; hover = false;}} on:mouseenter={() => {down = 1.1; hover = true;}}
		 style="transform: scale3d({down}); background-image: url('{image}');">

	<div class="w-48 h-28 text-white transition {hover ? 'opacity-100' : 'opacity-0'}">
		<div class="bg-gradient-to-r from-main-color w-full h-full">
			<div class="flex flex-col flex-wrap justify-end h-full p-3">
				<div class="text-sm font-bold">{name}</div>
			</div>
		</div>
	</div>
</div>
