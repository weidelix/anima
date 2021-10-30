<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const scrollY = writable(0); 
	export const query = writable('');

	declare let window : WindowAPI; 
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Details from './Page/Details.svelte';
	import Home from './Page/Home.svelte';
	import MyLibrary from './Page/MyLibrary.svelte';
	import Search  from './Page/Search.svelte';
	import User from './User';
	import Router, { activeRoute } from './pager/Router.svelte';
	import Route from './pager/Route.svelte';
	import page from './pager/page';
	
	let inputElement: HTMLInputElement;

	function enableSearch(e: KeyboardEvent | MouseEvent) {
		if((e as KeyboardEvent).key === 'Enter') {
			$query = inputElement.value;
		}

		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key !== 'Escape') {
			page.go('/search');
		}

		if ((e as KeyboardEvent).key === 'Escape') {
			page.back();
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
						overflow-y-auto bg-main-color"
		on:scroll={(e) => $scrollY = e.currentTarget.scrollTop}>

	<!-- Bar -->
	<div class="absolute left-0 top-0 flex justify-between px-5 py-2 w-full
							bg-main-color"
			 style="background-color: rgba(33, 33, 33, {$scrollY * 0.003})">
		<div class="flex content-center font-main text-2xl text-white text-left">
			<span class="text-white">anima</span>
		</div>
		<div class="flex flex-wrap justify-end content-center space-x-3 font-main">
			<div class="flex flex-wrap justify-end content-center text-xl text-white"
					 on:click={() => page.go('/')}>
				<button class="text-xs  hover:text-green-400 
										transition duration-400">
						Home
				</button>
			</div>
			<div class="flex flex-wrap justify-end content-center mr-5 text-xl text-white"
					 on:click={() => page.go('/library') }>
				<button class="text-xs {$activeRoute.path === '/library' ? 'text-green-400' : ''} hover:text-green-400 
										transition duration-400">
						Library
				</button>
			</div>
			<div class="flex h-full font-main">
				<input bind:this={inputElement}
							class="align-middle p-3 text-xs placeholder-white text-white bg-transparent 
											border-b-2 border-transparent focus:border-green-400 
											transition duration-400 outline-none"
							placeholder="Search" 
							on:keydown={enableSearch}
							on:mousedown={enableSearch} 
							on:focus={() => inputElement.select()}>
				<button class:hidden={$activeRoute.path === '/search'} on:click={enableSearch}>
					<i class="fas fa-search m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</button>
				<button class:hidden={$activeRoute.path !== '/search'} on:click={() => $query = ''}>
					<i class="fas fa-times m-3 align-middle text-green-400 hover:text-green-400 transition duration-400"></i>
				</button>
			</div>
		</div>
	</div>
	
	<main class="sc flex-grow w-full">
		<Router>
			<Route path="/" component={Home}/>
			<Route path="/search" component={Search}/>
			<Route path="/library" component={MyLibrary}/>
			<Route path="/details" component={Details}/>
		</Router>
	</main>
</div>

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>