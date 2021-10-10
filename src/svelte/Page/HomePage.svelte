<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Card  from '../components/Card.svelte';
	import DetailsPage, { hasMaximizedCard } from './DetailsPage.svelte';
	import CascadingImages from '../components/CascadingImages.svelte';
	import Compress from '../Compress';

	let popular: any[] = [];
	let releases: any[] = [];
	let isReady = false;
	let cimsReady = false;

	// Selected game
	let id = -1;
	let name = '';
	let image = '';
	let show = false;

	onMount(async () => {
		popular = await window.api.search({name: ''});
		releases = await window.api.search({name: '', date: '2021-01-01,2021-12-31'});
	});
</script>

{#if show}
	<DetailsPage on:close={() => show = false } {id} {name} {image}/>
{/if}

{#if !isReady}
	<div class="absolute bg-main-color flex flex-col flex-wrap content-center justify-center text-white w-screen h-screen z-50" out:fade>
		<h1 class="text-white text-4xl font-main">
			<span class="text-white">anima</span>
		</h1>
		<div class="flex justify-center mt-5 animate-spin">
			<i class="fas fa-circle-notch text-4xl"></i>
		</div>
	</div>
{/if}

<div>
	<CascadingImages on:ready={() => cimsReady = true} ready={isReady}/>
	{#if cimsReady}
		<div class="flex flex-col space-y-4 px-5 mt-10">
			<div>
				<div class="text-white text-left font-main text-2xl my-2">
					Popular <i class="fas fa-fire-alt text-orange"></i>
				</div>
				<div class="sc flex space-x-4 p-1 content-start overflow-x-scroll">
					{#await Compress.compressFiles(popular.map(el => el.background_image), 400, 500) then images}
						{#each popular as game, i (game.id)}
							<Card on:click={() => { show = true; id = game.id; name = game.name; image = images[i] }}
										id={game.id} title={game.name} image={images[i]}/>
						{/each}
					{/await}
				</div>
			</div>
		
			<div>
				<div class="text-white text-left font-main text-2xl my-2">
					Big Releases <i class="fas fa-meteor text-yellow-400"></i>
				</div>
				<div class="sc flex space-x-4 content-start overflow-x-scroll">
					{#await Compress.compressFiles(releases.map(el => el.background_image), 400, 500) then images}
						{#each releases as game, i (game.id)}
							<Card on:click={() => { show = true; id = game.id; name = game.name; image = images[i] }}
										id={game.id} title={game.name} image={images[i]}/>
							{(() => { isReady = true; return ''; })()}
						{/each}
					{/await}
				</div>
			</div>
		</div>
	{/if}
</div>