<script lang="ts" context="module">
	declare let window : WindowAPI;

	let popular: any[] = [];
	let releases: any[] = [];
</script>

<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import Card  from '../components/Card.svelte';
	import { details } from './Details.svelte';
	import CascadingImages from '../components/CascadingImages.svelte';
	import Loading from '../Page/Loading.svelte';
	import Compress from '../Compress';
	import page from '../pager/page';
	import { activeRoute } from '../pager/Router.svelte';

	let isReady = false;
	let cimsReady = false;

	beforeUpdate(() => {
		
	});

	afterUpdate(() => {
		if (cimsReady) isReady = true;
	});

	onMount(async () => {
		if (popular.length === 0 && releases.length === 0) {
			popular = await window.anima.search({name: ''});
			releases = await window.anima.search({name: '', date: '2021-01-01,2021-12-31'});
	
			for (let game of popular) {
				game.background_image = await Compress.compress(game.background_image);
			}
			
			for (let game of releases) {
				game.background_image = await Compress.compress(game.background_image);
			}
		}
	});

	$: if($activeRoute.path === '/search') {
		for (let j = 0; j < popular.length; j++) {
			URL.revokeObjectURL(popular[j].background_image);
		}
		
		for (let j = 0; j < releases.length; j++) {
			URL.revokeObjectURL(releases[j].background_image);
		}

		popular = [];
		releases = [];

		cimsReady = false;
	}
	
</script>

<div class="relative w-full h-full">
	<Loading ready={isReady}>
		<CascadingImages on:ready={() => cimsReady = true} ready={isReady}/>
		{#if cimsReady && $activeRoute.path === '/'}
			<div class="flex flex-col space-y-4 p-5 mt-10">
				<div>
					<div class="font-main text-white text-left text-2xl">
						Popular <i class="fas fa-fire-alt text-orange"></i>
					</div>
					<div class="sc overflow-x-scroll flex py-3 space-x-4 content-start">
						{#each popular as game (game.id)}
							<Card on:click={() => {
											$details = { 
																		unique: 0, 
																		transition: true, 
																		id: game.id, 
																		name: game.name, 
																		image: game.background_image 
																 };
											page.go('/details');
										}}
										id={game.id} title={game.name} image={game.background_image}
										rating={game.rating}/>
						{/each}
					</div>
				</div>
			
				<div>
					<div class="font-main text-white text-left text-2xl">
						Big Releases <i class="fas fa-meteor text-yellow-400"></i>
					</div>
					<div class="sc overflow-x-scroll flex py-3 space-x-4 content-start">
						{#each releases as game, i (game.id)}
							<Card on:click={() => {
											$details = { 
																		unique: 0, 
																		transition: true, 
																		id: game.id, 
																		name: game.name, 
																		image: game.background_image 
																 };
											page.go('/details');
										}}
										id={game.id} title={game.name} image={game.background_image}
										rating={game.rating}/>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</Loading>
</div>

