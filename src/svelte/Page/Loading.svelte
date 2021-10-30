<script lang="ts" context="module">
	declare const window: WindowAPI;

	let initalLoad = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Button from '../components/Button.svelte';

	export let ready = false;

	let timeout: NodeJS.Timeout;
	let isOnline = false;
	let checkingConnection = true;

	function checkConnection(duration: 10000 | 5000 | 3000) {
		checkingConnection = true;
		
		timeout = setTimeout(() => {
			let tries = 0;
			let interval: NodeJS.Timeout;

			interval = setInterval(() => {
				++tries;
				isOnline = navigator.onLine;
				
				if (isOnline) {
					checkingConnection = false;
					clearInterval(interval);
					clearTimeout(timeout);
				}
				
				if (tries === duration / 1000) {
					checkingConnection = false;
					clearInterval(interval);
					clearTimeout(timeout);
				}
			}, 1000);
		}, duration);
	}
	
	onMount(async () => {
		checkConnection(3000);
	});

	$: if (ready) {
		initalLoad = false;
	}
</script>


{#if !isOnline && !checkingConnection}
	<div class="absolute top-0 left-0 flex flex-col flex-wrap justify-center content-center w-screen h-screen text-white bg-main-color">
		<div class="flex justify-center">
			<i class="fas fa-skull-crossbones text-4xl"></i>
		</div>
		<h1 class="mt-2  font-main text-2xl text-white">
			<span class="text-white">No internet connection</span>
		</h1>
		<div class="flex justify-center mt-10 space-x-4 font-bold">
			<div class="w-20">
				<Button class="w-full" on:click={() => checkConnection(3000)} color={'green'}>Retry</Button>
			</div>
			<div class="w-20">
				<Button class="w-full" on:click={() => window.app.quit()} color={'red'}>Exit</Button>
			</div>
		</div>
	</div>
{:else if !ready || checkingConnection}
	{#if initalLoad}
		<div class="absolute top-0 left-0 bg-main-color flex flex-col flex-wrap content-center 
								justify-center text-white w-screen h-screen z-50 bg-center bg-no-repeat"
				style="background-image: url('../anima_icon.png');
								background-size: 8rem;"
				out:fade>
			<h1 class="text-white text-4xl font-main mt-48">
				<span class="text-white">anima</span>
			</h1>
			<div class="flex justify-center animate-spin mt-10">
				<i class="fas fa-circle-notch text-4xl"></i>
			</div>
		</div>
	{:else}
		<div class="w-full h-full bg-main-color flex flex-col flex-wrap content-center 
								justify-center text-white z-50 bg-center bg-no-repeat">
			<div class="flex justify-center animate-spin mt-10">
				<i class="fas fa-circle-notch text-4xl"></i>
			</div>
		</div>
	{/if}
{/if}

<div class:hidden={!ready}>
	<slot/>
</div>
