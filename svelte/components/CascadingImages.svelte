<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { scrollY } from '../App.svelte';
	import CascadingImage from './CascadingImage.svelte';

	export let ready = false;

	let banners: any[] = [];
	let bigText = '';
	let bigSubText = '';
	let bigImage = '';
	let i = 0;
	let id: NodeJS.Timeout;

	onMount(async () => {
		banners = await window.api.search({name: ''});
		banners = banners.slice(0, 5);

		change(0);
	});

	function change(value: number) {
		clearTimeout(id);

		i = value;

		if (i !== 5) {
			bigText = banners[i].name;
			bigImage = banners[i].background_image;
		} else {
			change(0);
		}

		id = setTimeout(() => {
			change(++i);
		}, 5000);
	}
</script>

<div class="w-full h-screen mb-8 overscroll-auto" style="height: 40rem;">
	<div class="w-full h-full bg-top bg-cover bg-no-repeat" 
		   style="background-image: url('{bigImage}');
			 				background-position: 50% {($scrollY) * 0.4}px;">
		<div class="bg-gradient-to-t from-main-color via-transparent w-full h-full">
			<div class="bg-gradient-to-r from-main-color via-transparent w-full h-full">
				<div class="flex flex-col space-between text-white h-full">
					<div class="flex-grow p-20">
					{#if ready}
						<div class="flex flex-col flex-wrap justify-center h-full" in:fly={{delay: 300, x: -100}}>
							<div class="text-base"></div>
							<div class="text-6xl font-bold">{bigText}</div>
							<button class="w-28 mt-6 px-4 py-2 transition bg-gray-500 bg-opacity-30 hover:bg-opacity-50 rounded">Check out</button>
						</div>
					{/if}
					</div>
					<div class="sc flex justify-start lg:justify-center space-x-4 self-end w-full overflow-x-auto p-5">
						{#each banners as game, index (game.id)}
							<div>
								{#await window.api.compress(game.background_image) then image}
									<CascadingImage border="rounded-2xl {i === index ? 'ring-4 ring-accent-green': ''}" 
																	on:click={() => change(index)} name={game.name} image={image}/>
								{/await}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>