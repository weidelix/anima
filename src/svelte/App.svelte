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
	import MyLibrary from './Page/Library.svelte';
	import Search  from './components/Search.svelte';
	import User from './User';
	import Router, { activeRoute } from './pager/Router.svelte';
	import Route from './pager/Route.svelte';
	import page from './pager/page';
	import Button from './components/Button.svelte';
	import FloatingPanel from './components/FloatingPanel.svelte';
	
	let inputElement: HTMLInputElement;
	let inputContainer: HTMLDivElement;
	let isSearching = false;
	let right = 0;
	let top = 0;

	function enableSearch(e: KeyboardEvent | MouseEvent) {
		if((e as KeyboardEvent).key === 'Enter') {
			$query = inputElement.value;
		}
			
		if ((e as KeyboardEvent).key === 'Escape') {
			isSearching = false;
			inputElement.blur();
		}
	}

	function setPosition() {
		let rect = inputContainer.getBoundingClientRect();
		right = rect.right;
		top = rect.bottom - 36;
	};

	onMount(async () => {
		await User.init();
		setPosition();
	})
</script>

<svelte:body on:click={() => { isSearching = false; }}/>
<svelte:window on:resize={setPosition}/>

<div class="draggable flex justify-center 
						w-full h-9 text-white bg-main-color">
	<div class="absolute left-0 flex flex-wrap content-center px-2 h-9">
		<img class="w-5 h-5" src="../anima_icon.png" alt="logo"/>
	</div>

	<div class="flex flex-wrap content-center font-main text-xs text-white text-left">
		<span class="text-white opacity-80">anima</span>
	</div>

	<div class="absolute right-0 flex flex-wrap content-center h-9">
		<Button class="p-0 w-12 h-full opacity-80 hover:bg-white hover:opacity-100" 
						color="white" bgColor={false}
						rounded={false}
						on:click={window.app.minimize}>
			<i class="fas fa-minus"></i>
		</Button>
		<Button class="p-0 w-12 h-full opacity-80 hover:bg-white hover:opacity-100" 
						color="white" bgColor={false} rounded={false}
						on:click={window.app.maximize}>
			<i class="far fa-window-maximize"></i>
		</Button>
		<Button class="p-0 w-12 h-full opacity-80 hover:bg-red-600 hover:opacity-100 hover:bg-opacity-100"
						color="white" bgColor={false} rounded={false} 
						on:click={window.app.quit}>
			<i class="fas fa-times text-sm"></i>
		</Button>
	</div>
</div>

<div class="sc relative flex-grow flex flex-col w-full h-full overflow-y-auto"
		 on:scroll={(e) => $scrollY = e.currentTarget.scrollTop}>
	<!-- Bar -->
	<div class="fixed flex justify-between px-5 py-2 w-full
							bg-main-color transition duration-200"
			style="--tw-bg-opacity: {$activeRoute.path === '/' 
																? $scrollY > 300 || isSearching ? 1 : 0 
																: 1};
						 z-index: 9999;">
		<div class="flex content-center font-main text-xl text-white text-left">
			<span class="text-white">
				{
					$activeRoute.path.charAt(1).toUpperCase() + 
					$activeRoute.path.slice(2)
				}
			</span>
		</div>
		<div class="flex flex-wrap justify-end content-center space-x-1 font-main">
			<Button class="text-xs hover:bg-white"
							on:click={() => page.go('/')}
							color={'white'} 
							bgColor={$activeRoute.path === '/' ? true : false }>
					Home
			</Button>
			<Button class="text-xs hover:bg-white"
							on:click={() => page.go('/library') }
							color={'white'}
							bgColor={$activeRoute.path === '/library' ? true : false }>
					Library
			</Button>
			<div bind:this={inputContainer} class="flex w-80 h-full font-main"
					 on:click|stopPropagation={() => 
							{ 
								inputElement.select();
								isSearching = true; 
							}}>
				<input bind:this={inputElement}
							class="align-middle flex-grow p-3 text-xs placeholder-white text-white bg-transparent  
										 transition duration-400 outline-none"
							placeholder="Search" 
							on:keydown={enableSearch}
							on:mousedown={enableSearch}>
				<button class:hidden={isSearching} on:click={enableSearch}>
					<i class="fas fa-search m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</button>
				<button class:hidden={!isSearching} on:click={() => {$query = ''; inputElement.value = ''; }}>
					<i class="fas fa-times m-3 align-middle text-white hover:text-green-400 transition duration-400"></i>
				</button>
			</div>
			{#if isSearching}
				<FloatingPanel right={right} top={top} base={false}>
					<Search/>
				</FloatingPanel>
			{/if}
		</div>
	</div>
	
	<main class="sc flex-grow w-full h-screen">
		<Router>
			<Route path="/" component={Home}/>
			<Route path="/library" component={MyLibrary}/>
			<Route path="/details" component={Details}/>
		</Router>
	</main>
</div>

<style>
	@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>