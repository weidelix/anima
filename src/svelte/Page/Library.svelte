<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	declare const window: WindowAPI;

	export const isProfilePageOpen = writable(false);
	export const profilePage = writable('favorites');
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import FloatingPanel from '../components/FloatingPanel.svelte';
	import Button from '../components/Button.svelte';
	import Card from '../components/Card.svelte';
	import QueueCard, { playing, selected } from '../components/QueueCard.svelte';
	import User, { profile } from '../User';
	import quick from '../Quicksort';
	import page from '../pager/page';
	import { details } from './Details.svelte';
	import { activeRoute } from '../pager/Router.svelte';

	let sortButton: HTMLButtonElement;
	let top = 10;
	let right = 10
	let openSortBy = false;
	let sortedBy = 'a-z';
	let y = 0;

	function closeProfilePage(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			$isProfilePageOpen = false;
		}
	}

	function setPosition() {
		let rect = sortButton.getBoundingClientRect();
		right = rect.right;
		top = rect.top - 36;
	};

	onMount(async () => {
		$profile.library = quick.sort($profile.library, quick.byNameAtoZ);
	});
</script>

<svelte:body on:keydown={closeProfilePage}/>
<svelte:window on:resize={setPosition}/>

<div class="flex flex-col px-5 mt-20 w-full space-y-3">
	<div class="flex justify-between w-full rounded-xl">
		<div class="flex w-1/3 space-x-2">
			<button class="p-3 w-full font-main text-white text-left text-xl rounded-xl
									 hover:text-red-400 hover:bg-red-200 hover:bg-opacity-20
										 {$profilePage === 'favorites' 
										 		? 'text-red-400 bg-red-200 bg-opacity-20' : ''}
										 transition"
							on:click={() => $profilePage = "favorites"}>
					<i class="fas fa-heart text-xl"></i>
					Favorites
			</button>
			<button class="p-3 w-full font-main text-white text-left text-xl rounded-xl
									 hover:text-yellow-400 hover:bg-yellow-200 hover:bg-opacity-20
										 {$profilePage === 'queue' 
										 		? 'text-yellow-400 bg-yellow-200 bg-opacity-20' : ''}
										 transition"
							on:click={() => {
																$profilePage = "queue";
																openSortBy = false;
															}}>
				<i class="fas fa-layer-group text-xl"></i>
				Queue
			</button>
		</div>
		{#if $profilePage === 'favorites'}
			<button bind:this={sortButton} 
							class="p-3 text-sm font-bold transition duration-400 text-white 
										hover:text-green-400 hover:bg-green-200 
										hover:bg-opacity-20 rounded-xl"
							on:click={() => { openSortBy = !openSortBy; setPosition(); }}>
				Sort by
				<i class="fas fa-sort text-sm"></i>
			</button>
		{:else if $profilePage === 'queue'}
			<Button class="font-main {$profile.queue.length > 0 ? '' : 'hidden'}" 
							color={'white'}
							bgColor={'white'}
							on:click={() => 
								{
									User.removeFromQueue({id: $profile.queue[0].id});
									$playing = $profile.queue[0].name;
								}}>
				Finish playing - "{$playing}"
			</Button>
		{/if}
	</div>
	<div class="flex flex-col">
		<div class="flex w-full">
			{#if openSortBy}
			<FloatingPanel right={right} top={top}>
				<div class="flex justify-between">
					<div class="font-bold my-3 mx-6">
						Sort by
					</div>
					<button class="font-bold transition duration-400 text-white 
												hover:text-green-400 rounded-xl mx-4 my-3"
							on:click={() => openSortBy = !openSortBy}>
						<i class="fas fa-times text-xl"></i>
					</button>
				</div>
				
				<div class="flex flex-col space-y-2 p-3">
					<button class="text-left w-full transition duration-400 
												text-gray-200 hover:text-green-400 
												hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													{sortedBy === 'a-z' 
														? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
									on:click={() => { 
																		$profile.library = quick.sort($profile.library, quick.byNameAtoZ); 
																		sortedBy = 'a-z';
																	}}>
						<i class="fas fa-sort-alpha-down text-xl"></i>
						<span class="mx-3 font-bold">A - Z</span>
					</button>
					<button class="text-left w-full transition duration-400 
												text-gray-200 hover:text-green-400 
												hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													{sortedBy === 'z-a' 
														? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
									on:click={() => { 
																		$profile.library = quick.sort($profile.library, quick.byNameZtoA); 
																		sortedBy = 'z-a';
																	}}>
						<i class="fas fa-sort-alpha-up text-xl"></i>
						<span class="mx-3 font-bold">Z - A</span>
					</button>
					<button class="text-left w-full transition duration-400 
												text-gray-200 hover:text-green-400 
												hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													{sortedBy === 'date-desc' 
														? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
									on:click={() => { 
																		$profile.library = quick.sort($profile.library, quick.byReleaseDesc); 
																		sortedBy = 'date-desc';
																	}}>
						<i class="fas fas fa-sort-numeric-down text-xl"></i>
						<span class="mx-3 font-bold">Release Date Descending</span>
					</button>
					<button class="text-left w-full transition duration-400 
												text-gray-200 hover:text-green-400 
												hover:bg-green-200 hover:bg-opacity-20 rounded-xl p-3
													{sortedBy === 'date-asc' 
														? 'text-green-400 bg-green-200 bg-opacity-20' : ''}"
									on:click={() => { 
																		$profile.library = quick.sort($profile.library, quick.byReleaseAsc); 
																		sortedBy = 'date-asc';
																	}}>
						<i class="fas fa-sort-numeric-up text-xl"></i>
						<span class="mx-3 font-bold">Release Date Ascending</span>
					</button>
				</div>
			</FloatingPanel>
			{/if}
			<div class="relative flex flex-wrap w-full">
				<!-- Favorites -->
				{#if $profilePage === 'favorites' && $activeRoute.path === '/library'}
					{#if $profile.library.length > 0}
						<div class="absolute left-0 top-0 flex flex-wrap w-full">
							{#each $profile.library as card (card.id)}
								<div class="m-2">
									<Card on:click={() => {
													$details = {
														unique: 0,
														transition: true, 
														id: card.id, 
														name: card.name, 
														image: card.background_image };
													page.go('/details');
												}}
												title={card.name} image={card.background_image} id={card.id}
												rating={card.rating}/>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-2xl font-bold text-white">No games in library</div>
					{/if}

				<!-- Queue -->
				{:else if $profilePage === 'queue' && $activeRoute.path === '/library'}
					{#if $profile.queue.length > 0}
						<div on:mousemove={(e) => y = e.movementY}
								 class="absolute left-0 top-0 flex flex-col w-full space-y-2">
							{#each $profile.queue as card, i (card.id)}
								<div class="{$selected === card.id ? 'z-50' : 'z-10'}">
									<QueueCard
												index={i} y={y}
												title={card.name} image={card.background_image} id={card.id}/>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-2xl font-bold text-white">No queued games</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>