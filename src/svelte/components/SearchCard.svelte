<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { details } from '../Page/Details.svelte';
	import page from '../pager/page';
	
	const dispatch = createEventDispatcher();

	export let title = '';
	export let image = '';
	export let id = -9999;
	export let unique = 10;
</script>

<div class="flex items-center p-3 w-full h-24 space-x-3 text-white hover:bg-accent-green
					  duration-200 ease-out"
		 on:click={() => {
			 	dispatch('click');
				$details = {unique: unique, transition: false, id: id, name: title, image: image }
				page.go('/details');
		 }}>
		<div class="h-12 bg-cover rounded-xl" 
				 style="min-width: 5rem;
				 				max-width: 5rem; 
				 				background-color: white; 
								background-image: url({image});"></div>
		<div class="font-sans text-sm truncate">{title}</div>
</div>