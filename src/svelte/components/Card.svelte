<script lang="ts">
	import { send, receive } from '../Page/DetailsPage.svelte';
	import { createEventDispatcher } from 'svelte';
	import { hasMaximizedCard } from '../Page/DetailsPage.svelte';

	const dispatch = createEventDispatcher();

	export let id = -1;
	export let title = '';
	export let image = '';

	const TITLE = 2;
	const IMG = 3;
</script>

<div class="flex flex-wrap place-items-center cursor-pointer"
			on:click={() => { $hasMaximizedCard = true; dispatch('click')}}>
	<div class="text-white rounded-xl shadow-2xl bg-main-color w-44 h-60">
		<div class="flex flex-col w-full h-full">
			{#if !$hasMaximizedCard}
				<div class="bg-cover bg-top w-full h-full rounded-xl" style="background-image: url({image})"
					in:receive={{key: IMG + id}}
					out:send={{key: IMG + id}}>
					<div class="flex flex-wrap content-end bg-gradient-to-t from-gray-900 via-transparent p-5 h-full w-full">
						<div class="grid grid-cols-1 w-full"
								 in:receive={{key: TITLE + id}}
								 out:send={{key: TITLE + id}}>
							<h1 class="justify-self-start text-base font-bold text-left">
								{title}
							</h1>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
