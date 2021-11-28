<script lang="ts" context="module">
	import { writable } from "svelte/store";

	declare let window : WindowAPI; 

	export const recentSearches = writable([]);
</script>

<script lang="ts">
	import { scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import SearchCard from "../components/SearchCard.svelte";
	import Button from './Button.svelte';
	import { query } from '../App.svelte';
	import Compress from '../Compress';
	import { onDestroy } from "svelte";

	const emptySearchMessages = [
		'Try checking your speeling',
		'What\'s that?',
		'Try again in the future',
		'Well, well, well. How the turntables',
		'Try asking your mom'
	];

	const emptySearchEmoticons = [
		'¯\\_(ツ)_/¯',
		'( • - • )?',
		'(✿ •︡ ︹ •︠ )',
		'(╯ •︡ ● •︠ )╯┻━┻',
		'( ╥ ︹ ╥ )'
	];

	let emptySearchIndex;
	let bestResultGames : any[] = [];
	let relevanceList : any[] = [];

	async function search(name: string) {
		if ($query !== '') {
			
			addToRecents(name);

			// Delete previous blobs before searching 
			for (let j = 0; j < bestResultGames.length; j++) {
				URL.revokeObjectURL(bestResultGames[j].background_image);
				URL.revokeObjectURL(relevanceList[j].background_image);
			}

			let searchedGames = await window.anima.search({name: $query});
			
			bestResultGames   = searchedGames.filter(game => game.name.toLowerCase().includes($query.toLowerCase()));
			
			for (let j = 0; j < bestResultGames.length; j++) {
				bestResultGames[j].background_image = await Compress.compress(bestResultGames[j].background_image, 400, 500);
			}
	
			relevanceList = [...bestResultGames];
		}
	}

	function addToRecents(game: string) {
		if (!$recentSearches.includes(game)) {
			if ($recentSearches.length < 5) {
				$recentSearches.push(game);
			}
			else {
				$recentSearches.shift();
				$recentSearches.push(game);
			}
		}

		console.log($recentSearches.length);
	}

	function clearRecents() {
		$recentSearches = [];
	}

	function rotate(node, { duration, easing }) {
		return {
			duration,
			easing,
			css: t => {
				const ease = easing(t);
				return `
					transform: rotate(${ease * -360}deg);
				`;
			}
		};
	}

	onDestroy(() => {
		for (let j = 0; j < bestResultGames.length; j++) {
			URL.revokeObjectURL(bestResultGames[j].background_image);
			URL.revokeObjectURL(relevanceList[j].background_image);
		}

		bestResultGames = [];
		relevanceList = [];
	});

	$: search($query);
</script>

<div class="w-80 h-full bg-main-color rounded-b-xl">
	{#if bestResultGames.length !== 0 && $query !== ''}
		{#if bestResultGames.length !== 0}
			<div class="sc flex flex-col w-66 max-h-80 content-start overflow-x-scroll my-2">
				{#each bestResultGames as game (game.id)}
					<SearchCard id={game.id} title={game.name} image={game.background_image}/>
				{/each}
			</div>
		{/if}
	{:else if $query === ''}
		{#if $recentSearches.length === 0}
			<div class="grid place-content-center p-3 w-66 h-48">
				<div class="flex flex-wrap h-full" transition:scale={{duration: 200, start: 0.5}}>
					<i class="fas fa-box-open self-center text-white text-2xl"></i>
					<div class="text-white text-lg mx-2">No recent searches</div>
				</div>
			</div>
		{:else}
			<div class="space-y-3 p-3 w-66">
				<div class="flex h-7">
					<div class="flex items-center h-full">
						<div class="text-white text-left text-lg">
							Recents
							<i class="fas fa-history text-white text-xl" 
								 in:rotate={{duration: 1000, easing: cubicOut}}></i>
						</div>
					</div>
				</div>
				<div class="sc flex flex-col space-y-2 content-start">
					{#each $recentSearches as game}
						<div class="p-1 w-full text-gray-200 bg-white bg-opacity-0 hover:bg-opacity-30 text-xs rounded"
								 on:click={() => { $query = game; search($query); }}>
							{game}
						</div>
					{/each}
				</div>
				<div class="flex justify-center w-full h-5" on:click={() => { clearRecents(); }}> 
					<Button color={'red'} bgColor={false}>
						Clear
					</Button>
				</div>
			</div>
		{/if}
	{:else if bestResultGames.length === 0}
		<div class="grid place-content-center w-66 h-48 p-3 ">
			<div class="h-full" in:scale={{duration: 200, start: 0.5}}>
				<span class="hidden">{emptySearchIndex = Math.floor(Math.random() * emptySearchEmoticons.length)}</span>
				<div class="text-white text-center text-2xl my-2">
					{emptySearchEmoticons[emptySearchIndex]}
				</div>
				<div class="text-white text-center text-lg">
					{emptySearchMessages[emptySearchIndex]}
				</div>
			</div>
		</div>
	{/if}
</div>