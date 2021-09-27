<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	export const hasMaximizedCard = writable(false);
	
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { onMount } from 'svelte';
	// import party from 'party-js';

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
	let favButton: HTMLDivElement;
	let contentBody: HTMLDivElement;
	let platforms: any[];

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

		platforms = gameData.parent_platforms;
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

<svelte:body on:keydown={closeDetailsPage}/>

<!-- Minimized -->
{#if !isMaximized}
	{#if !isSearchResult}
		<!-- Regular -->
		<div bind:this={contentBody} class="card-min flex flex-wrap justify-center place-items-center cursor-pointer"
				on:click={getGameDetails}>
			<div class="card-min-content text-white rounded-xl shadow-2xl overflow-hidden bg-black w-44 h-60"
					on:click={() => { isMaximized = !isMaximized; $hasMaximizedCard = true; }}
					in:receive={ !isMobile ? {key: BG} : {key: null}}
					out:send={ !isMobile ? {key: BG} : {key: null}}>
				<div class="flex flex-col w-full h-full">
					<div class="proj-img w-full h-full" style="background-image: url('{image}')"
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
					<div class="grid grid-cols-3 justify-around w-full my-3">
						<div bind:this={favButton} class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-red-400 hover:bg-red-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2"
								 on:click={() => {}}>
							<i class="far fa-heart text-2xl self-center"></i>
							<div class="text-xs text-center my-1">
								Add to favorites
							</div>
						</div>
						<div class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-yellow-400 hover:bg-yellow-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2">
							<i class="fas fa-layer-group text-2xl self-center"></i>
							<div class="text-xs text-center my-1">
								Queue game
							</div>
						</div>
						<div class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-blue-400 hover:bg-blue-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2"
								 on:click={() => window.api.openWebsite(gameData.website)}>
							<i class="fas fa-globe-americas text-2xl self-center"></i>
							<div class="text-xs text-center my-1">
								Visit website
							</div>
						</div>
					</div>
					<div class="flex flex-col justify-between">
						<div class="text-sm text-left overflow-hidden">
							<div class="text-base font-bold text-left text-heading my-2">About the game</div>
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
								{#if gameData.parent_platforms}
									{#each platforms as platforms}
										{#if platforms.platform.slug === "xbox"}
												<i class="fab fa-xbox text-xbox text-xl"></i>
										{/if}
										{#if platforms.platform.slug === "playstation"}
											<i class="fab fa-playstation text-blue-500 text-xl"></i>
										{/if}
										{#if platforms.platform.slug === "pc"}
											<i class="fab fa-windows text-blue-400 text-xl"></i>
										{/if}
										{#if platforms.platform.slug === "mac"}
											<i class="fab fa-apple text-gray-200 text-xl"></i>
										{/if}
										{#if platforms.platform.slug === "linux"}
											<i class="fab fa-linux text-white text-xl"></i>
										{/if}
										{#if platforms.platform.slug === "android"}
											<i class="fab fa-android text-green-500 text-xl"></i>
										{/if}
									{/each}
								{/if}
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