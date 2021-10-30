<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Card  from '../components/Card.svelte';
	import { details } from './Details.svelte';
	import CascadingImages from '../components/CascadingImages.svelte';
	import Loading from '../Page/Loading.svelte';
	import Compress from '../Compress';
	import page from '../pager/page';
	import { activeRoute } from '../pager/Router.svelte';

	let isReady = false;
	let cimsReady = false;
	let popular: any[] = [];
	let releases: any[] = [];

	onMount(async () => {
		popular = await window.anima.search({name: ''});
		releases = await window.anima.search({name: '', date: '2021-01-01,2021-12-31'});

		for (let j = 0; j < popular.length; j++) {
			popular[j].background_image = await Compress.compress(popular[j].background_image, 400, 500);
		}
		
		for (let j = 0; j < releases.length; j++) {
			releases[j].background_image = await Compress.compress(releases[j].background_image, 400, 500);
		}
	});

</script>

<Loading ready={isReady}>
	<CascadingImages on:ready={() => cimsReady = true} ready={isReady}/>
	{#if cimsReady && $activeRoute.path === '/'}
		<div class="flex flex-col space-y-4 px-5 mt-20">
			<div>
				<div class="text-white text-left text-2xl font-bold my-2">
					Popular <i class="fas fa-fire-alt text-orange"></i>
				</div>
				<div class="sc flex space-x-4 content-start overflow-x-scroll">
					{#each popular as game}
						<Card on:click={() => {
										$details = { transition: true, id: game.id, name: game.name, image: game.background_image };
										page.go('/details');
									}}
									id={game.id} title={game.name} image={game.background_image}/>
					{/each}
				</div>
			</div>
		
			<div>
				<div class="text-white text-left text-2xl font-bold my-2">
					Big Releases <i class="fas fa-meteor text-yellow-400"></i>
				</div>
				<div class="sc flex space-x-4 content-start overflow-x-scroll">
					{#each releases as game}
						<Card on:click={() => {
										$details = { transition: true, id: game.id, name: game.name, image: game.background_image };
										page.go('/details');
									}}
									id={game.id} title={game.name} image={game.background_image}/>
					{/each}
					{(() => { isReady = true; return ''; })()}
				</div>
			</div>
		</div>
	{/if}
</Loading>
