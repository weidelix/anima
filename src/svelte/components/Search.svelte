<script lang="ts" context="module">
	import { writable } from "svelte/store";

	declare let window : WindowAPI; 

	export const recentSearches = writable([]);
</script>

<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import SearchCard from "../components/SearchCard.svelte";
	import Button from './Button.svelte';
	import { query } from '../App.svelte';
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
	let searchedGames : any[] = [];

	async function search(name: string) {
		if ($query !== '') {
			addToRecents(name);

			searchedGames = await window.anima.search({name: $query});
			searchedGames = searchedGames.map(game => {
																									return { id: game.id, name: game.name };
																								});
			searchedGames = searchedGames.filter(game => game.name.toLowerCase().includes($query.toLowerCase()));
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
		searchedGames = [];
	});

	$: search($query);
</script>

<div class="sc w-80 h-full overflow-y-scroll bg-main-color rounded-b-xl">
	{#if searchedGames.length !== 0 && $query !== ''}
		{#if searchedGames.length !== 0}
			<div class="sc flex flex-col w-66 max-h-80 content-start my-2">
				{#each searchedGames as game}
					<SearchCard id={game.id} title={game.name}/>
				{/each}
			</div>
		{/if}
	{:else if $query === ''}
		{#if $recentSearches.length === 0}
			<div class="grid place-content-center p-3 w-66 h-48">
				<div class="flex flex-wrap h-full">
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
	{:else if searchedGames.length === 0}
		<div class="grid place-content-center w-66 h-48 p-3 ">
			<div class="h-full">
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