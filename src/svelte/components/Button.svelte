<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: 'green' | 'red' | 'yellow' | 'blue' | 'white' = 'green';
	export let bgColor = true;
	export let rounded = true;

	let classProp = '';
	export { classProp as class };
	
	const dispatch = createEventDispatcher();
</script>

<button class="flex flex-wrap justify-center content-center
							 {!classProp.includes('p-') ? 'p-3' : ''} 
							 text-xs text-{color === 'white' ? color : color + '-400'} 
							 hover:text-{color === 'white' ? color : color + '-400'} 
							 bg-{bgColor 
							 		? color === 'white' ? color : color + '-200'
									: 'transparent'} 
							 bg-opacity-10 hover:bg-opacity-30 {rounded ? 'rounded-xl' : ''}
							 transition {classProp}"
				on:click={() => { dispatch('click') }}>
	<slot/>
</button>