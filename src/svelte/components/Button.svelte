<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let color: 'green' | 'red' | 'yellow' | 'blue' | 'white' = 'green';
	export let bgColor: 'green' | 'red' | 'yellow' | 'blue' | 'transparent' | 'white' |  '' =  '';

	let classProp = '';
	export { classProp as class };
	
	const dispatch = createEventDispatcher();
</script>

<button class="p-3 text-xs text-{color === 'white' ? color : color + '-400'} 
							 hover:text-{color === 'white' ? color : color + '-400'} 
							 bg-{bgColor !== '' 
							 		? bgColor === 'white' || 'transparent' ? bgColor : bgColor + '-200'
									: color === 'white' ? color : color + '-200'} 
							 bg-opacity-10 hover:bg-opacity-30 rounded-xl transition {classProp}"
				on:click={() => { dispatch('click') }}>
	<slot/>
</button>