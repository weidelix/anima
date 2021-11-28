<script lang="ts" context="module">
	import { createEventDispatcher, onMount } from 'svelte';
	import { send, receive } from '../Page/Details.svelte';
	import Tag from './Tag.svelte';
</script>

<script lang="ts">	
	export let unique = 0;
	export let id = -1;
	export let title = '';
	export let image = '';
	export let rating = 0;
	
	const dispatch = createEventDispatcher();
	const TITLE = 2;
	const IMG = 3;

	let card: HTMLDivElement;
	let rect: DOMRect;
	let width = 0;
	let height = 0;
	let x = 0;
	let y = 0;

	onMount(() => {
		rect = card.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
		
		card.parentElement.onscroll = () => {
			rect = card.getBoundingClientRect();
			x = rect.x;
			y = rect.y;
			card.previousElementSibling.dispatchEvent(new Event('scroll'));
		};
		
		card.onscroll = () => {
			rect = card.getBoundingClientRect();
			x = rect.x;
			y = rect.y;
			card.previousElementSibling.dispatchEvent(new Event('scroll'));
		}
	});
</script>
	
<div bind:this={card} class="cursor-pointer flex flex-wrap place-items-center h-60 
														 shadow-2xl"
		on:click={() => dispatch('click')}
		style="min-width: 11rem; max-width: 11rem;">
	{#if x < window.outerWidth && x + width >= 0}
		<div class="flex flex-col p-3 w-full h-full space-y-3 text-white
							bg-sub-color hover:bg-accent-green hover:bg-opacity-70 rounded-xl
							transition">
			<div class="w-full h-36 bg-cover bg-top rounded-xl" style="background-image: url({image})"
				in:receive={{key: IMG + id + unique}}
				out:send={{key: IMG + id + unique}}>
			</div>
			<div class="flex-grow flex flex-wrap content-end w-full">
				<div class="flex flex-col justify-between w-full h-full space-y-3"
							in:receive={{key: TITLE + id + unique}}
							out:send={{key: TITLE + id + unique}}>
					<div class="text-xs font-bold text-left subpixel-antialiased">
						{#if title.length > 30 && title.split(' ').length > 6}
							{title.slice(0, title.lastIndexOf(' ')) + ' ...'}
						{:else}
							{title}
						{/if}
					</div>
					<div class="flex flex-wrap justify-between w-full" style="font-size: 0.5rem;">
						<Tag class="bg-white bg-opacity-80">
							<span class="font-main text-black">{rating}</span>
						</Tag>

						<!-- For played games to be implemented -->
						<!-- <Tag class="bg-accent-green">
							<span class="font-main text-black">Played</span>
						</Tag> -->
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
