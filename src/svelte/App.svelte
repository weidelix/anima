<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const scrollY = writable(0); 
	
	declare let window : WindowAPI; 
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { hasMaximizedCard } from './Page/DetailsPage.svelte';
	import HomePage from './Page/HomePage.svelte';
	import MyLibraryPage, { isProfilePageOpen } from './Page/MyLibraryPage.svelte';
	import SearchPage, { isSearchPageOpen } from './Page/SearchPage.svelte';
	import User from './User';
	
	let searchQuery = '';
	let inputElement: HTMLInputElement;

	function enableSearch(e: KeyboardEvent | MouseEvent) {
		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key !== 'Escape') {
			$isSearchPageOpen = true;
			$isProfilePageOpen = false;
		}

		if ((e as KeyboardEvent).key === 'Escape') {
			$isSearchPageOpen = false;
		}
	}

	onMount(async () => {
		await User.init();
	})
</script>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fredoka+One">
</svelte:head>

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
		<div class="flex flex-wrap justify-end content-center space-x-4 font-main">
			<div class="flex flex-wrap justify-end content-center text-xl text-white"
					 on:click={() => {$isProfilePageOpen = false; $isSearchPageOpen = false}}>
				<div class="text-xs  hover:text-green-400 
										transition duration-400">
						Home
				</div>
			</div>
			<div class="flex flex-wrap justify-end content-center mr-5 text-xl text-white"
					 on:click={() => $isProfilePageOpen = true}>
				<div class="text-xs {$isProfilePageOpen ? 'text-green-400' : ''} hover:text-green-400 
										transition duration-400">
						Library
				</div>
			</div>
			<div class="flex h-full font-main">
				<input bind:this={inputElement} bind:value={searchQuery}
							class="align-middle p-3 text-xs placeholder-white text-white bg-transparent 
											border-b-2 border-transparent focus:border-green-400 
											transition duration-400 outline-none"
							placeholder="Search" 
							on:keydown={enableSearch}
							on:mousedown={enableSearch} 
							on:focus={() => inputElement.select()}>
				<div class:hidden={$isSearchPageOpen} on:click={enableSearch}>
					<i class="fas fa-search m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</div>
				<div class:hidden={!$isSearchPageOpen} on:click={() => searchQuery = ''}>
					<i class="fas fa-times m-3 align-middle text-green-400 hover:text-green-400 transition duration-400"></i>
				</div>
			</div>
		</div>
	</div>
	
	<main class="sc flex-grow w-full">
		<div class:hidden={$isSearchPageOpen || $isProfilePageOpen}>
			<HomePage/>
		</div>
		{#if $isSearchPageOpen}
			<div class="w-full h-full px-5 py-10">
				<SearchPage query={searchQuery}/>
			</div>
		{:else if $isProfilePageOpen}
			<div class="w-full h-full px-5 py-10">
				<MyLibraryPage/>
			</div>
		{/if}	
	</main>
</div>

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>