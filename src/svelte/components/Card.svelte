<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { send, receive } from '../Page/Details.svelte';
	
	export let unique = 0;
	export let id = -1;
	export let title = '';
	export let image = '';
	
	const dispatch = createEventDispatcher();
	const TITLE = 2;
	const IMG = 3;

</script>

<div class="flex flex-wrap place-items-center cursor-pointer"
			on:click={() => dispatch('click')} out:fade>
	<div class="text-white rounded-xl shadow-2xl bg-main-color w-44 h-60">
		<div class="flex flex-col w-full h-full">
			<div class="bg-cover bg-top w-full h-full rounded-xl" style="background-image: url({image})"
				in:receive={{key: IMG + id + unique}}
				out:send={{key: IMG + id + unique}}>
				<div class="flex flex-wrap content-end bg-gradient-to-t from-gray-900 via-transparent p-5 h-full w-full">
					<div class="grid grid-cols-1 w-full"
								in:receive={{key: TITLE + id + unique}}
								out:send={{key: TITLE + id + unique}}>
						<h1 class="justify-self-start text-base font-bold text-left">
							{title}
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
