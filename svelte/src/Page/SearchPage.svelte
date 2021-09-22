<script lang="ts" context="module">
	import { writable } from "svelte/store";

	declare let window : WindowAPI; 

	let recentSearches = writable([]);
</script>

<script lang="ts">
	import Card, { hasMaximizedCard } from "../components/Card.svelte";
	import { scale, fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

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
	let container: HTMLDivElement;

	async function search(name: string) {
		if (query !== '') {
			let searchedGames = (await window.api.search({name: query})).results;
			bestResultGames   = searchedGames.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));
			relatedGames      = searchedGames.filter(game => !game.name.toLowerCase().includes(query.toLowerCase()));
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
		console.log('asdf')
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
			<div class="text-white text-left font-bold text-2xl my-2">Best Results</div>
			<div class="sc flex {$hasMaximizedCard ? 'space-x-0' : 'space-x-2'} content-start overflow-x-scroll">
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