<script lang="ts" context="module">
	import { writable } from "svelte/store";

	declare let window : WindowAPI; 

	let recentSearches = writable([]);
</script>

<script lang="ts">
	import { scale, fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";
	import Card, { hasMaximizedCard } from "../components/Card.svelte";
	import FloatingPanel from "../components/FloatingPanel.svelte";
	import quick, { byNameAtoZ, sort } from '../Quicksort';

	export let query = '';

	let emptySearchMessages = [
		'Try checking your speeling',
		'What\'s that?',
		'Try again in the future',
		'uh huh?',
		'Try asking your mom'
	];

	let emptySearchEmoticons = [
		'¯\\_(ツ)_/¯',
		'( • - • )?',
		'(✿ •︡ ︹ •︠ )',
		'(╯ •︡ ● •︠ )╯┻━┻',
		'( ╥ ︹ ╥ )'
	];

	let emptySearchIndex;
	let bestResultGames : any[] = [];
	let relatedGames : any[] = [];
	let relevanceList : any[] = [];
	let container: HTMLDivElement;
	let sortButton: HTMLButtonElement;
	let bottom = 10;
	let right = 10
	let openSortBy = false;
	let sortedBy = 'relevance';
	let sorter;

	function setPosition() {
		openSortBy = !openSortBy;
		let rect = sortButton.getBoundingClientRect();
		right = rect.right;
		bottom = rect.bottom;
	};

	async function search(name: string) {
		if (query !== '') {
			let searchedGames = (await window.api.search({name: query})).results;
			
			bestResultGames   = searchedGames.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));
			relatedGames      = searchedGames.filter(game => !game.name.toLowerCase().includes(query.toLowerCase()));
			relevanceList 		= [...bestResultGames];
		} 
	}

	function addToRecents(game: any) {
		if (!$recentSearches.includes(game)) {
			if ($recentSearches.length < 5) {
				$recentSearches.push(game);
			}
			else {
				$recentSearches.shift();
				$recentSearches.push(game);
			}
		}
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
	
	$: search(query);
</script>

<div bind:this={container} class="w-full h-full">
	{#if bestResultGames.length + relatedGames.length !== 0 && query !== ''}
		{#if bestResultGames.length !== 0}
			<div class="flex justify-between">
				<div class="text-white text-left font-bold text-2xl">Best Results</div>
				<button bind:this={sortButton} class="text-white text-sm font-bold transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-2"
								on:click={() => setPosition()}>
					<span class="h-full">Sort by</span>
					<i class="fas fa-sort text-sm"></i>
				</button>
				{#if openSortBy}
					<FloatingPanel right={right} top={bottom}>
						<div class="flex flex-col space-y-2">
							<button class="text-left w-full transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
														 {sortedBy === 'relevance' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
											on:click={() => { bestResultGames = [...relevanceList]; sortedBy = 'relevance';}}>
								<i class="fas fa-poll text-xl"></i>
								<span class="mx-3 font-bold">Relevance</span>
							</button>
							<button class="text-left w-full transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
														 {sortedBy === 'a-z' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
											on:click={() => { sort(bestResultGames, quick.byNameAtoZ); sortedBy = 'a-z'; bestResultGames = bestResultGames;}}>
								<i class="fas fa-sort-alpha-down text-xl"></i>
								<span class="mx-3 font-bold">A - Z</span>
							</button>
							<button class="text-left w-full transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
														 {sortedBy === 'z-a' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
											on:click={() => { sort(bestResultGames, quick.byNameZtoA); sortedBy = 'z-a'; bestResultGames = bestResultGames;}}>
								<i class="fas fa-sort-alpha-up text-xl"></i>
								<span class="mx-3 font-bold">Z - A</span>
							</button>
							<button class="text-left w-full transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
														 {sortedBy === 'date-desc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
											on:click={() => { sort(bestResultGames, quick.byNameZtoA); sortedBy = 'date-desc'; bestResultGames = bestResultGames;}}>
								<i class="fas fas fa-sort-numeric-down text-xl"></i>
								<span class="mx-3 font-bold">Release Date Descending</span>
							</button>
							<button class="text-left w-full transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
														 {sortedBy === 'date-asc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
											on:click={() => { sort(bestResultGames, quick.byNameZtoA); sortedBy = 'date-asc'; bestResultGames = bestResultGames;}}>
								<i class="fas fa-sort-numeric-up text-xl"></i>
								<span class="mx-3 font-bold">Release Date Ascending</span>
							</button>
						</div>
					</FloatingPanel>
				{/if}
			</div>
			<div class="sc flex {$hasMaximizedCard ? 'space-x-0' : 'space-x-2'} content-start overflow-x-scroll my-2">
				{#each bestResultGames as game}
					<div on:click={() => addToRecents(game)}>
						<Card gameID={game.id} title={game.name} image={game.background_image}/>
					</div>
				{/each}
			</div>
		{/if}
		{#if relatedGames.length !== 0}
			<div class="text-white text-left font-bold text-xl my-2">Related</div>
			<div class="sc flex flex-col {$hasMaximizedCard ? 'space-y-0' : 'space-y-2'} justify-start overflow-x-scroll">
				{#each relatedGames as game}
					<div on:click={() => addToRecents(game)}>
						<Card isSearchResult={true} gameID={game.id} title={game.name} image={game.background_image}/>
					</div>
				{/each}
			</div>
		{/if}
	{:else if query === ''}
		{#if $recentSearches.length === 0}
			<div class="grid place-content-center w-full h-full">
				<div class="my-2 h-full" transition:scale={{duration: 200, start: 0.5}}>
					<i class="fas fa-box-open text-white text-9xl"></i>
					<div class="text-white font-bold text-2xl my-2">No recent searches</div>
				</div>
			</div>
		{:else}
			<div class="flex justify-between cursor-pointer">
				<div>
					<div class="text-white text-left font-bold text-2xl my-4">
						Recents
						<i class="fas fa-history text-white text-2xl" in:rotate={{duration: 1000, easing: cubicOut}}></i>
					</div>
				</div>
				<div class="text-white text-left font-bold text-sm my-4 transition duration-400 text-xl text-white hover:text-red-400" 
				     on:click={() => { clearRecents()}}>
					<span>Clear</span>
					<i class="far fa-trash-alt"></i>
				</div>
			</div>
			<div class="sc flex flex-row {$hasMaximizedCard ? 'space-x-0' : 'space-x-2'} content-start overflow-x-scroll">
				{#each $recentSearches as recent, i (recent.id)}
					<div in:fly={{duration: 400 + (100 * i), x: 100}}>
						<Card gameID={recent.id} title={recent.name} image={recent.background_image}/>
					</div>
				{/each}
			</div>
		{/if}
	{:else if bestResultGames.length + relatedGames.length === 0}
		<div class="grid place-content-center w-full h-full">
			<div class="my-2 h-full" in:scale={{duration: 200, start: 0.5}}>
				<span class="hidden">{emptySearchIndex = Math.floor(Math.random() * emptySearchEmoticons.length)}</span>
				<div class="text-white text-6xl my-10">
					{emptySearchEmoticons[emptySearchIndex]}
				</div>
				<div class="text-white font-bold text-2xl">
					{emptySearchMessages[emptySearchIndex]}
				</div>
			</div>
		</div>
	{/if}
</div>