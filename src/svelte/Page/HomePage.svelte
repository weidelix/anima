<script lang="ts" context="module">
	declare let window : WindowAPI;

	let popular: any[] = [];
	let releases: any[] = [];
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Card  from '../components/Card.svelte';
	import DetailsPage from './DetailsPage.svelte';
	import Button from '../components/Button.svelte';
	import CascadingImages from '../components/CascadingImages.svelte';
	import Compress from '../Compress';
	import { isSearchPageOpen } from './SearchPage.svelte';
	import { isProfilePageOpen } from './MyLibraryPage.svelte';

	let isReady = false;
	let cimsReady = false;
	let timeout: NodeJS.Timeout;
	let isOnline = false;
	let checkingConnection = true;

	// Selected game
	let id = -1;
	let name = '';
	let image = '';
	let show = false;

	function checkConnection(duration: 10000 | 5000 | 3000) {
		checkingConnection = true;
		
		timeout = setTimeout(() => {
			let tries = 0;
			let interval: NodeJS.Timeout;

			interval = setInterval(() => {
				++tries;
				isOnline = navigator.onLine;
				
				if (isOnline) {
					checkingConnection = false;
					clearInterval(interval);
					clearTimeout(timeout);
				}
				
				if (tries === duration / 1000) {
					checkingConnection = false;
					clearInterval(interval);
					clearTimeout(timeout);
				}
			}, 1000);
		}, duration);
	}

	async function nowOnline() {
		popular = await window.anima.search({name: ''});
		releases = await window.anima.search({name: '', date: '2021-01-01,2021-12-31'});

		for (let j = 0; j < popular.length; j++) {
			popular[j].background_image = await Compress.compress(popular[j].background_image, 400, 500);
		}

		for (let j = 0; j < releases.length; j++) {
			releases[j].background_image = await Compress.compress(releases[j].background_image, 400, 500);
		}
	}
	
	onMount(async () => {
		checkConnection(3000);
	});

	$: if (isOnline) {
		nowOnline();
	}
</script>

{#if show}
	<DetailsPage on:close={() => show = false} {id} {name} {image}/>
{/if}

{#if !isOnline && !checkingConnection}
	<div class="absolute flex flex-col flex-wrap justify-center content-center w-screen h-screen text-white bg-main-color">
		<div class="flex justify-center">
			<i class="fas fa-skull-crossbones text-4xl"></i>
		</div>
		<h1 class="mt-2  font-main text-2xl text-white">
			<span class="text-white">No internet connection</span>
		</h1>
		<div class="flex justify-center mt-10 space-x-4 font-bold">
			<div class="w-20">
				<Button on:click={() => checkConnection(3000)} color={'green'}>Retry</Button>
			</div>
			<div class="w-20">
				<Button on:click={() => window.app.quit()} color={'red'}>Exit</Button>
			</div>
		</div>
	</div>
{:else if !isReady || checkingConnection}
	<div class="absolute bg-main-color flex flex-col flex-wrap content-center 
							justify-center text-white w-screen h-screen z-50 bg-center bg-no-repeat"
			 style="background-image: url('../anima_icon.png');
			 				background-size: 8rem;"
			 out:fade>
		<h1 class="text-white text-4xl font-main mt-48">
			<span class="text-white">anima</span>
		</h1>
		<div class="flex justify-center animate-spin mt-10">
			<i class="fas fa-circle-notch text-4xl"></i>
		</div>
	</div>
{/if}

{#if isOnline}
	<div>
		<CascadingImages on:ready={() => cimsReady = true} ready={isReady}/>
		{#if cimsReady}
			<div class="flex flex-col space-y-4 px-5 mt-10">
				<div>
					<div class="text-white text-left text-2xl font-bold my-2">
						Popular <i class="fas fa-fire-alt text-orange"></i>
					</div>
					<div class="sc flex space-x-4 content-start overflow-x-scroll">
						<!-- {#await Compress.compressFiles(popular.map(el => el.background_image), 400, 500) then images} -->
							{#if !$isSearchPageOpen && !$isProfilePageOpen}
								{#each popular as game, i (game.id)}
									<Card on:click={() => { show = true; id = game.id; name = game.name; image = game.background_image; }}
												id={game.id} title={game.name} image={game.background_image}/>
								{/each}
							{/if}
						<!-- {/await} -->
					</div>
				</div>
			
				<div>
					<div class="text-white text-left text-2xl font-bold my-2">
						Big Releases <i class="fas fa-meteor text-yellow-400"></i>
					</div>
					<div class="sc flex space-x-4 content-start overflow-x-scroll">
						<!-- {#await Compress.compressFiles(releases.map(el => el.background_image)) then images} -->
							{#if !$isSearchPageOpen && !$isProfilePageOpen}
								{#each releases as game, i (game.id)}
									<Card on:click={() => { show = true; id = game.id; name = game.name; image = game.background_image; }}
												id={game.id} title={game.name} image={game.background_image}/>
								{/each}
								{(() => { isReady = true; return ''; })()}
							{/if}
						<!-- {/await} -->
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
