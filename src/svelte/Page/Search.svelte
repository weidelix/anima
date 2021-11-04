<script lang="ts" context="module">
	import { writable } from "svelte/store";

	declare let window : WindowAPI; 

	export const recentSearches = writable([]);
</script>

<script lang="ts">
	import { scale, fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import Card from "../components/Card.svelte";
	import { query } from '../App.svelte';
	import { details } from "./Details.svelte";
	import FloatingPanel from "../components/FloatingPanel.svelte";
	import Loading from '../Page/Loading.svelte';
	import quick from '../Quicksort';
	import Compress from '../Compress';
	import page from '../pager/page';
	import { activeRoute } from "../pager/Router.svelte";

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
	let relatedGames : any[] = [];
	let relevanceList : any[] = [];
	let container: HTMLDivElement;
	let sortButton: HTMLButtonElement;
	let top = 10;
	let right = 10
	let openSortBy = false;
	let sortedBy = 'relevance';
	let searchReady = false;

	function setPosition() {
		let rect = sortButton.getBoundingClientRect();
		right = rect.right;
		top = rect.top;
	};

	async function search(name: string) {
		searchReady = false;
		
		if ($query !== '') {

			let searchedGames = await window.anima.search({name: $query});
			
			bestResultGames   = searchedGames.filter(game => game.name.toLowerCase().includes($query.toLowerCase()));
			relatedGames      = searchedGames.filter(game => !game.name.toLowerCase().includes($query.toLowerCase()));
		}
		
		for (let j = 0; j < bestResultGames.length; j++) {
			bestResultGames[j].background_image = await Compress.compress(bestResultGames[j].background_image, 400, 500);
		}
		
		for (let j = 0; j < relatedGames.length; j++) {
			relatedGames[j].background_image = await Compress.compress(relatedGames[j].background_image, 400, 500);
		}

		relevanceList = [...bestResultGames];
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

	function closeSearchPage(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			page.back();
		}
	}

	$: search($query);
</script>

<svelte:body on:keydown={closeSearchPage}/>
<svelte:window on:resize={setPosition}/>

<div bind:this={container} class="w-full h-full {searchReady ? 'px-5 mt-20' : ''}">
	{#if bestResultGames.length + relatedGames.length !== 0 && $query !== '' && $activeRoute.path === '/search'}
		<!-- <Loading ready={searchReady}> -->
			{#if bestResultGames.length !== 0}
				<div class="flex justify-between">
					<div class="text-white text-left font-bold text-2xl">Best Results</div>
					<button bind:this={sortButton} class="text-sm font-bold transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-2"
									on:click={() => { setPosition(); openSortBy = !openSortBy; }}>
						<span class="h-full">Sort by</span>
						<i class="fas fa-sort text-sm"></i>
					</button>
					{#if openSortBy}
						<FloatingPanel right={right} top={top}>
							<div class="flex justify-between">
								<div class="font-bold my-3 mx-6">
									Sort by
								</div>
								<button class="font-bold transition duration-400 text-white hover:text-green-400 rounded-xl mx-4 my-3"
										on:click={() => openSortBy = !openSortBy}>
									<i class="fas fa-times text-xl"></i>
								</button>
							</div>

							<div class="flex flex-col space-y-2 p-3">
								<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
																{sortedBy === 'relevance' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
												on:click={() => { 
																					bestResultGames = [...relevanceList]; 
																					sortedBy = 'relevance';
																				}}>
									<i class="fas fa-poll text-xl"></i>
									<span class="mx-3 font-bold">Relevance</span>
								</button>
								<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
																{sortedBy === 'a-z' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
												on:click={() => { 
																					bestResultGames = quick.sort(bestResultGames, quick.byNameAtoZ); 
																					sortedBy = 'a-z'; 
																				}}>
									<i class="fas fa-sort-alpha-down text-xl"></i>
									<span class="mx-3 font-bold">A - Z</span>
								</button>
								<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
																{sortedBy === 'z-a' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
												on:click={() => { 
																					bestResultGames = quick.sort(bestResultGames, quick.byNameZtoA); 
																					sortedBy = 'z-a'; 
																				}}>
									<i class="fas fa-sort-alpha-up text-xl"></i>
									<span class="mx-3 font-bold">Z - A</span>
								</button>
								<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
																{sortedBy === 'date-desc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
												on:click={() => { 
																					bestResultGames = quick.sort(bestResultGames, quick.byReleaseDesc); 
																					sortedBy = 'date-desc'; 
																				}}>
									<i class="fas fas fa-sort-numeric-down text-xl"></i>
									<span class="mx-3 font-bold">Release Date Descending</span>
								</button>
								<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
																{sortedBy === 'date-asc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
												on:click={() => { 
																					bestResultGames = quick.sort(bestResultGames, quick.byReleaseAsc); 
																					sortedBy = 'date-asc';
																				}}>
									<i class="fas fa-sort-numeric-up text-xl"></i>
									<span class="mx-3 font-bold">Release Date Ascending</span>
								</button>
							</div>
						</FloatingPanel>
					{/if}
				</div>
				<div class="sc flex space-x-2 content-start overflow-x-scroll my-2">
					{#each bestResultGames as game, i (game.id)}
						<Card on:click={() => { 
										addToRecents(game);
										$details = { unique: 0, transition: true, id: game.id, name: game.name, image: game.background_image };
										page.go('/details');
									}}
								id={game.id} title={game.name} image={game.background_image}
								rating={game.rating}/>
						{#if relatedGames.length === 0 && i === bestResultGames.length - 1}
							{(() => { searchReady = true; return ''; })()}
						{/if}
					{/each}
				</div>
			{/if}
		{#if relatedGames.length !== 0}
			<div class="text-white text-left font-bold text-xl my-2">Related</div>
			<div class="sc flex flex-col justify-start 'space-y-2' overflow-x-scroll">
				{#each relatedGames as game, i (game.id)}
					<Card on:click={() => { 
									addToRecents(game);
									$details = { unique: 0, transition: true, id: game.id, name: game.name, image: game.background_image };
									page.go('/details');
								}}
								id={game.id} title={game.name} image={game.background_image}
								rating={game.rating}/>
					{#if i === relatedGames.length - 1}
						{(() => { searchReady = true; return ''; })()}
					{/if}
				{/each}
			</div>
		{/if}
	<!-- </Loading> -->
	{:else if $query === ''}
		{#if $recentSearches.length === 0}
			<div class="grid place-content-center w-full h-full">
				<div class="flex flex-wrap flex-col my-2 h-full" transition:scale={{duration: 200, start: 0.5}}>
					<i class="fas fa-box-open self-center text-white text-9xl"></i>
					<div class="text-white font-bold text-2xl my-2">No recent searches</div>
				</div>
			</div>
		{:else}
			<div class="flex justify-between px-5 mt-20">
				<div>
					<div class="text-white text-left font-bold text-2xl my-4">
						Recents
						<i class="fas fa-history text-white text-2xl" in:rotate={{duration: 1000, easing: cubicOut}}></i>
					</div>
				</div>
				<div class=" cursor-pointer text-left font-bold my-4 transition duration-400 text-xl text-white hover:text-red-400" 
				     on:click={() => { clearRecents()}}>
					<span>Clear</span>
					<i class="far fa-trash-alt"></i>
				</div>
			</div>
			<div class="sc flex flex-row px-5 space-x-2 content-start overflow-x-scroll">
				{#each $recentSearches as game, i (game.id)}
					<div in:fly={{duration: 400 + (100 * i), x: 100}}>
						<Card on:click={() => { 
										addToRecents(game);
										$details = { unique: 0, transition: true, id: game.id, name: game.name, image: game.background_image };
										page.go('/details');
									}} 
									id={game.id} title={game.name} image={game.background_image}
									rating={game.rating}/>
					</div>
				{/each}
			</div>
		{/if}
	{:else if bestResultGames.length + relatedGames.length === 0}
		<div class="grid place-content-center w-full h-full">
			<div class="my-2 h-full" in:scale={{duration: 200, start: 0.5}}>
				<span class="hidden">{emptySearchIndex = Math.floor(Math.random() * emptySearchEmoticons.length)}</span>
				<div class="text-white text-center text-6xl my-10">
					{emptySearchEmoticons[emptySearchIndex]}
				</div>
				<div class="text-white text-center font-bold text-2xl">
					{emptySearchMessages[emptySearchIndex]}
				</div>
			</div>
		</div>
	{/if}
</div>