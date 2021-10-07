<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const scrollY = writable(0); 
	
	declare let window : WindowAPI; 
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { hasMaximizedCard } from './components/Card.svelte';
	import HomePage from './Page/HomePage.svelte';
	import SearchPage from './Page/SearchPage.svelte';
	
	let searchQuery = '';
	let isSearching = false;
	let inputElement: HTMLInputElement;

	function enableSearch(e: KeyboardEvent | MouseEvent) {
		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key !== 'Escape') {
			isSearching = true;
		}

		if ((e as KeyboardEvent).key === 'Escape') {
			isSearching = false;
		}
	}

	function closeSearchPage(e: KeyboardEvent) {
		if (e.key === 'Escape' && isSearching && !$hasMaximizedCard) isSearching = false;
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fredoka+One">
</svelte:head>

<svelte:body on:keydown={closeSearchPage}/>

{#if navigator.onLine}
	<div class="sc flex flex-col bg-main-color w-screen h-screen {$hasMaximizedCard ? 'overflow-hidden' : 'overflow-y-auto'}"
			on:scroll={(e) => $scrollY = e.currentTarget.scrollTop}>
		<!-- Bar -->
		<div class="flex px-5 py-2 w-full bg-transparent 
								justify-between absolute left-0 top-0"
				style="background-color: rgba(33, 33, 33, {$scrollY * 0.004});">
			<h1 class="text-white text-2xl text-left font-main">
				<span class="text-white">anima</span>
			</h1>
			<div class="flex flex-wrap content-center justify-end h-10">
				<div class="flex h-full">
					<input bind:this={inputElement} bind:value={searchQuery}
								class="bg-transparent outline-none align-middle p-3 border-b-2 
												transition duration-400 text-sm placeholder-white border-transparent focus:border-green-400 text-white"
								placeholder="Search" 
								on:keydown={enableSearch} 
								on:mousedown={enableSearch} 
								on:focus={() => inputElement.select()}>
					<div class:hidden={isSearching} on:click={enableSearch}>
						<i class="fas fa-search align-middle transition duration-400 text-white hover:text-green-400 m-3"></i>
					</div>
					<div class:hidden={!isSearching} on:click={() => searchQuery = ''}>
						<i class="fas fa-times align-middle transition duration-400 text-white hover:text-green-400 m-3"></i>
					</div>
				</div>
			</div>
		</div>
		
		<main class="sc w-full flex-grow">
			<div class="{isSearching ? 'hidden' : ''}">
				<HomePage/>
			</div>
			{#if isSearching}
			<div class="w-full h-full px-5 py-10">
				<SearchPage query={searchQuery}/>
				</div>
			{/if}	
		</main>
	</div>
{:else}
	<div class="flex flex-col flex-wrap content-center justify-center text-white bg-main-color w-screen h-screen">
		<div class="flex justify-center">
			<i class="fas fa-skull-crossbones text-4xl"></i>
		</div>
		<h1 class="text-white text-2xl font-main mt-2">
			<span class="text-white">No internet connection</span>
		</h1>
		<div class="flex justify-center space-x-4 mt-10 font-bold font-main">
			<button class="transition text-green-400 bg-green-200 bg-opacity-10 hover:text-green-400 hover:bg-opacity-30 rounded-xl w-20 p-3">Retry</button>
			<button class="transition text-red-400 bg-red-200 bg-opacity-10 hover:text-red-400 hover:bg-opacity-30 rounded-xl w-20 p-3">Exit</button>
		</div>
	</div>
{/if}

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>