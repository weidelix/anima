<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { details } from '../Page/Details.svelte';
	import page from '../pager/page';
	
	const dispatch = createEventDispatcher();

	export let title = '';
	export let id = -9999;
	export let unique = 10;
</script>

<div class="flex items-center p-3 w-full h-24 space-x-3 text-gray-300 hover:text-white 
					hover:bg-accent-green duration-200 ease-out"
		 on:click={() => {
			 	dispatch('click');
				$details = {unique: unique, transition: false, id: id, name: title, image: '' }
				page.go('/details');
		 }}>
		<div class="font-sans text-xs truncate">{title}</div>
</div>