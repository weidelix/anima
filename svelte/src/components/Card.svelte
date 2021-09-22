<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const hasMaximizedCard = writable(false);
	
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { onMount } from 'svelte';
	// import PartyGlobal from 'party-js';
	import { party } from '../partyjs.mjs';
	let some: HTMLButtonElement;
	party.confetti(some);

	const [send, receive] = crossfade({
			duration: 150,
		
			fallback(node, params) {
				const style = getComputedStyle(node);
				const transform = style.transform === 'none' ? '' : style.transform;
		
			return {
					duration: 0,
					easing: cubicOut,
					css: t => `
						transform: ${transform} scale(${t});
						opacity: ${t};`
				};
			}
	});

	export let isSearchResult = false;
	export let gameID = -1;
	export let title = ' ';
	export let image = '';

	let gameData : any = {}; 
	let isMaximized = false;
	let isMobile = false;
	let metaColor = 'green';
	let titleColor = 'transparent';
	let lessDesc = '';
	let moreDesc = '';
	let showMore = false;
	let favButton: HTMLButtonElement;

	const BG = 0;
	const TITLE = 1;
	const IMG = 3;

	
	onMount(async () => {
		if (/Mobi|Android/i.test(navigator.userAgent)) {
			isMobile = true;
		}
	});
	
	function closeDetailsPage(e: MouseEvent | KeyboardEvent) {
		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key === 'Escape') {
			isMaximized = false; 
			$hasMaximizedCard = false;
		}
	}

	async function getGameDetails() {
		gameData = await window.api.getDetails(gameID);
		let score = gameData.metacritic;

		if 			(score >= 0 && score <= 49) metaColor = 'red'; 
		else if (score >= 50 && score <= 74) metaColor = 'yellow'; 
		else if (score >= 75 && score <= 100) metaColor = 'green';

		[lessDesc] = gameData.description.split('</p>');
		moreDesc = gameData.description.split(lessDesc)[1];
	}

	function more() {
		showMore = !showMore;
	}
</script>

<svelte:head>
	<!-- <script defer src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script> -->
</svelte:head>

<svelte:body on:keydown={closeDetailsPage}/>

<!-- Minimized -->
{#if !isMaximized }
	{#if !isSearchResult}
		<!-- Regular -->
		<div class="card-min flex flex-wrap justify-center place-items-center cursor-pointer"
				on:click={getGameDetails}>
			<div class="card-min-content text-white rounded-xl shadow-2xl overflow-hidden bg-black w-44 h-60"
					on:click={() => { isMaximized = !isMaximized; $hasMaximizedCard = true; }}
					in:receive={ !isMobile ? {key: BG} : {key: null}}
					out:send={ !isMobile ? {key: BG} : {key: null}}>
				<div class="flex flex-col w-full h-full">
					<div class="proj-img w-full h-full" style="background-image: url({image})"
						in:receive={{key: IMG}}
						out:send={{key: IMG}}>
						<div class="flex flex-wrap content-end bg-gradient-to-t from-gray-900 via-transparent p-5 h-full w-full">
							<div class="grid grid-cols-1 w-full">
								<h1 class="justify-self-start text-base font-bold text-left"
										in:receive={{key: TITLE}}
										out:send={{key: TITLE}}>
									{title}
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- As search result -->
		<div class="flex flex-cols">
			<div class="card-min flex flex-wrap justify-center place-items-center cursor-pointer"
					on:click={getGameDetails}>
					<div class="card-min-content rounded-xl shadow-2xl overflow-hidden bg-black w-32 h-40"
							on:click={() => { isMaximized = !isMaximized; $hasMaximizedCard = true; }}
							in:receive={ !isMobile ? {key: BG} : {key: null}}
							out:send={ !isMobile ? {key: BG} : {key: null}}>
						<div class="flex flex-col w-full h-full">
							<div class="proj-img w-full h-full" style="background-image: url({image})"
								in:receive={{key: IMG}}
								out:send={{key: IMG}}>
							</div>
						</div>
					</div>
			</div>
			<div class="grid grid-cols-1 px-2 w-full">
				<h1 class="justify-self-start text-white text-base font-bold text-left"
						in:receive={{key: TITLE}}
						out:send={{key: TITLE}}>
					{title}
				</h1>
			</div>
		</div>
	{/if}
{/if}

<!-- Maximized -->
{#if isMaximized}
	<div class="sc card-max grid absolute overflow-auto
							overscroll-contain left-0 text-white 
							{(!isMaximized ? ' hidden ' : '')}
							h-full w-full"
				style="top: {window.scrollY}px">

			<div class="card-max-content flex flex-col self-center
									justify-items-start place-self-center bold text-5xl bg-black
									shadow-lg w-full h-full bg-no-repeat bg-cover"
					 in:receive="{{key: BG}}"
					 out:send="{{key: BG}}"
					 style="background-image: url({gameData.background_image_additional}); 
					        background-position: 0 -200px">
			
				<div class="flex flex-wrap content-start justify-end absolute w-full" on:click={closeDetailsPage}>
					<i class="fas fa-times text-2xl cursor-pointer m-4 transition duration-400 text-white hover:text-green-400"></i>
				</div>
				<div class="flex flex-col h-full p-5 bg-gradient-to-t from-main-color via-main-color">
					<div class="flex flex-cols w-full">
						<div class="proj-img bg-white rounded-xl w-56 h-72" style="background-image: url({image})"
								in:receive={{key: IMG}}
								out:send={{key: IMG}}>
						</div>
						<div class="self-end {titleColor} mx-5">
							<h1 class="text-3xl font-bold text-left"
								in:receive={{key: TITLE}}
								out:send={{key: TITLE}}>
								{title}
							</h1>
							{#if gameData.developers}
								<div class="text-white text-base text-left">{gameData.developers[0].name}</div>
							{/if}
							{#if gameData.metacritic}
								<div class="text-left text-base">
									Metacritic <span class="p-1 bg-{metaColor}-500 rounded-md text-sm text-white font-bold">{gameData.metacritic}</span>
								</div>
							{/if}
						</div>
					</div>
					<div class="flex justify-around w-full">
						<div class="text-white my-2">
							<button bind:this={favButton} class="my-1" on:click={() => party.confetti(favButton)}>
								<i class="far fa-heart text-2xl"></i>
							</button>
							<div class="text-xs my-0.5">
								Add to favorites
							</div>
						</div>
						<div class="text-white my-2">
							<button class="my-1">
								<i class="fas fa-layer-group text-2xl"></i>
							</button>
							<div class="text-xs my-0.5">
								Queue game
							</div>
						</div>
						<div class="text-white my-2">
							<button class="my-1" on:click={() => window.api.openWebsite(gameData.website)}>
								<i class="fas fa-globe-americas text-2xl transition duration-400 text-white hover:text-blue-400 rounded-full"></i>
							</button>
							<div class="text-xs my-0.5">
								Visit website
							</div>
						</div>
					</div>
					<div class="flex flex-col justify-between">
						<div class="my-2 text-sm text-left overflow-hidden">
							<div class="my-2 text-base font-bold text-left text-heading">About the game</div>
							{@html lessDesc}
	
							{#if showMore}
								<br/>
								{@html moreDesc}
							{/if}
							{#if moreDesc !== '</p>'}
								<button class="text-green-400" on:click={more}>{!showMore ? 'show more' : 'show less'}</button>
							{/if}
						</div>
						<div class="flex w-full">
							<div class="my-2 text-sm font-bold text-left text-sub-heading">
								Available on
							</div>
							<div class="flex flex-wrap content-center space-x-2 mx-4">
								<i class="fab fa-xbox text-xbox text-xl"></i>
								<i class="fab fa-playstation text-blue-500 text-xl"></i>
								<i class="fab fa-windows text-blue-400 text-xl"></i>
								<i class="fab fa-apple text-white text-xl"></i>
								<i class="fab fa-android text-green-500 text-xl"></i>
							</div>
						</div>
					</div>
				</div>
		</div>
	</div>
{/if}

<style>
	.proj-img, .proj-cover-img{
		background-size: cover;
		background-position: center;
	}
</style>