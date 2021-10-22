<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	declare const window: WindowAPI;

	export const isProfilePageOpen = writable(false);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import DetailsPage, { hasMaximizedCard } from './DetailsPage.svelte';
	import FloatingPanel from '../components/FloatingPanel.svelte';
	import Card from '../components/Card.svelte';
	import User from '../User';
	import quick from '../Quicksort';

	let library: any[] = []
	let show = false;
	let id = -1;
	let image = '';
	let name = '';
	let sortButton: HTMLButtonElement;
	let top = 10;
	let right = 10
	let openSortBy = false;
	let sortedBy = 'a-z';
	let profile = 'favorites';

	function closeProfilePage(e: KeyboardEvent) {
		if (!$hasMaximizedCard && e.key === 'Escape') {
			$isProfilePageOpen = false;
		}
	}

	function setPosition() {
		openSortBy = !openSortBy;
		let rect = sortButton.getBoundingClientRect();
		right = rect.right;
		top = rect.top;
	};

	onMount(async () => {
		library = User.readLibrary();
		quick.sort(library, quick.byNameAtoZ);
	});
</script>

<svelte:body on:keydown={closeProfilePage}/>

{#if show}
	<DetailsPage on:close={() => show = false} 
							 on:libraryUpdated={() => library = User.readLibrary()}
							 {id} {name} {image}/>
{/if}

<div class="flex flex-col w-full h-full pt-10">
	<div class="flex justify-between w-full rounded-xl">
		<div class="flex w-1/3 space-x-2">
			<button class="p-3 w-full text-white text-left font-bold text-xl rounded-xl
									 hover:text-red-400 hover:bg-red-200 hover:bg-opacity-20
										 {profile === 'favorites' ? 'text-red-400 bg-red-200 bg-opacity-20' : ''}"
							on:click={() => profile = "favorites"}>
					<i class="fas fa-heart text-xl"></i>
					Favorites
			</button>
			<button class="p-3 w-full text-white text-left font-bold text-xl rounded-xl
									 hover:text-yellow-400 hover:bg-yellow-200 hover:bg-opacity-20
										 {profile === 'queue' ? 'text-yellow-400 bg-yellow-200 bg-opacity-20' : ''}"
							on:click={() => profile = "queue"}>
				<i class="fas fa-layer-group text-xl"></i>
				Queue
			</button>
		</div>
		{#if profile === 'favorites'}
			<button bind:this={sortButton} class="p-3 text-sm font-bold transition duration-400 text-white hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl"
							on:click={() => setPosition()}>
				Sort by
				<i class="fas fa-sort text-sm"></i>
			</button>
		{/if}
	</div>
	<div class="flex flex-col w-full">
		<div class="flex">
			{#if openSortBy}
				<FloatingPanel right={right} top={top}>
					<div class="flex justify-between">
						<div class="font-bold my-3 mx-6">
							Sort by
						</div>
						<button class="font-bold transition duration-400 text-white hover:text-green-400 rounded-xl mx-4 my-3"
								on:click={() => setPosition()}>
							<i class="fas fa-times text-xl"></i>
						</button>
					</div>
	
					<div class="flex flex-col space-y-2 p-3">
						<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													 {sortedBy === 'a-z' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
										on:click={() => { quick.sort(library, quick.byNameAtoZ); sortedBy = 'a-z'; library = library;}}>
							<i class="fas fa-sort-alpha-down text-xl"></i>
							<span class="mx-3 font-bold">A - Z</span>
						</button>
						<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													 {sortedBy === 'z-a' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
										on:click={() => { quick.sort(library, quick.byNameZtoA); sortedBy = 'z-a'; library = library;}}>
							<i class="fas fa-sort-alpha-up text-xl"></i>
							<span class="mx-3 font-bold">Z - A</span>
						</button>
						<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													 {sortedBy === 'date-desc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
										on:click={() => { quick.sort(library, quick.byReleaseDesc); sortedBy = 'date-desc'; library = library;}}>
							<i class="fas fas fa-sort-numeric-down text-xl"></i>
							<span class="mx-3 font-bold">Release Date Descending</span>
						</button>
						<button class="text-left w-full transition duration-400 text-gray-200 hover:text-green-400 hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													 {sortedBy === 'date-asc' ? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
										on:click={() => { quick.sort(library, quick.byReleaseAsc); sortedBy = 'date-asc'; library = library;}}>
							<i class="fas fa-sort-numeric-up text-xl"></i>
							<span class="mx-3 font-bold">Release Date Ascending</span>
						</button>
					</div>
				</FloatingPanel>
			{/if}
			<div class="flex flex-wrap mt-3">
				{#if profile === 'favorites'}
					{#if library.length > 0}
						{#each library as card}
							<div class="m-2">
								<Card on:click={() => { show = true; id = card.id; name = card.name; 
																				image = card.background_image }}
											title={card.name} image={card.background_image} id={card.id}/>
							</div>
						{/each}
					{:else if library.length === 0}
						<div class="text-2xl font-bold text-white">No games in library</div>
					{/if}
				{:else if profile === 'queue'}
					<div class="text-2xl font-bold text-white">Under construction</div>
				{/if}
			</div>
		</div>
	</div>
</div>