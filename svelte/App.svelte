<script lang="ts" context="module">
	declare let window : WindowAPI; 
</script>

<script lang="ts">
	import { hasMaximizedCard } from './components/Card.svelte';
	import HomePage from './Page/HomePage.svelte';
	import SearchPage from './Page/SearchPage.svelte';
	import party from 'party-js';
	
	let searchQuery = '';
	let isSearching = false;
	let inputElement: HTMLInputElement;
	let walapa: HTMLButtonElement;

	function enableSearch(e: KeyboardEvent | MouseEvent)
	 {
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

<!-- Bar -->
<div class="sc flex flex-col bg-main-color h-screen {$hasMaximizedCard ? 'overflow-hidden' : 'overflow-y-auto'}">
	<div class="flex px-5 py-5 w-full bg-main-color shadow 
	            justify-between sticky top-0" style="margin-bottom: 1rem;">
		<h1 class="text-white text-2xl text-left font-main">
			<span class="text-orange">hot</span>.dog
		</h1>
		<div class="flex flex-wrap flex-row content-center justify-end h-10">
			<div class="h-full">
				<button bind:this={walapa} on:click={() => party.confetti(walapa)} class="h-full">
					<i class="fas fa-gamepad text-xl transition duration-400 text-white hover:text-green-400 mx-3"></i>
				</button>
			</div>
			<div class="w-50 h-full">
				<input bind:this={inputElement} bind:value={searchQuery}
							 class="bg-main-color outline-none align-middle w-full h-full p-3 border-b-2 
											transition duration-400 text-sm border-transparent focus:border-green-400 text-white"
							 placeholder="Search" 
							 on:keydown={enableSearch} 
							 on:mousedown={enableSearch} 
							 on:focus={() => inputElement.select()}>
			</div>
			<div class:hidden={isSearching} on:click={enableSearch}>
				<i class="fas fa-search align-middle transition duration-400 text-white hover:text-green-400 m-3"></i>
			</div>
			<div class:hidden={!isSearching} on:click={() => searchQuery = ''}>
				<i class="fas fa-times align-middle transition duration-400 text-white hover:text-green-400 m-3"></i>
			</div>
		</div>
	</div>
	
	<main class="w-full flex-grow">
		<div class="{isSearching ? 'hidden' : ''} px-5 py-10">
			<HomePage/>
		</div>
		{#if isSearching}
		<div class="{!isSearching ? '' : ''} w-full h-full px-5 py-10">
			<SearchPage query={searchQuery}/>
			</div>
		{/if}	
	</main>
</div>

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';

	main {
		text-align: center;
		max-width: 240px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>