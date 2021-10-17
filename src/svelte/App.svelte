<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const scrollY = writable(0); 
	
	declare let window : WindowAPI; 
</script>

<script lang="ts">
	import { hasMaximizedCard } from './Page/DetailsPage.svelte';
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

<div class="sc flex flex-col w-screen h-screen 
						{$hasMaximizedCard ? 'overflow-hidden' : 'overflow-y-auto'} 
						bg-main-color"
		on:scroll={(e) => $scrollY = e.currentTarget.scrollTop}>

	<!-- Bar -->
	<div class="absolute left-0 top-0 flex justify-between px-5 py-2 w-full
							bg-main-color"
			 style="background-color: rgba(33, 33, 33, {$scrollY * 0.003})">
		<div class="flex content-center font-main text-2xl text-white text-left">
			<span class="text-white">anima</span>
		</div>
		<div class="flex flex-wrap  justify-end content-center h-10">
			<div class="flex h-full">
				<input bind:this={inputElement} bind:value={searchQuery}
							class="align-middle p-3 text-sm placeholder-white text-white bg-transparent 
											border-b-2 border-transparent focus:border-green-400 
											transition duration-400 outline-none"
							placeholder="Search" 
							on:keydown={enableSearch}
							on:mousedown={enableSearch} 
							on:focus={() => inputElement.select()}>
				<div class:hidden={isSearching} on:click={enableSearch}>
					<i class="fas fa-search m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</div>
				<div class:hidden={!isSearching} on:click={() => searchQuery = ''}>
					<i class="fas fa-times m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</div>
			</div>
		</div>
	</div>
	
	<main class="sc flex-grow w-full">
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

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>