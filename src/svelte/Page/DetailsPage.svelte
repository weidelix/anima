<script lang="ts" context="module">
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	
	export const hasMaximizedCard = writable(false);
	
	declare let window : WindowAPI;

	export const [send, receive] = crossfade({
			duration: 400,
		
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
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import User from '../User';

	export let id = -1;
	export let name = '';
	export let image = '';
	export let transition = true;

	const dispatch = createEventDispatcher();
	const TITLE = 2;
	const IMG = 3;

	let gameData : any = { id: -9999 }; 
	let metaColor = 'green';
	let titleColor = 'transparent';
	let lessDesc = '';
	let moreDesc = '';
	let showMore = false;
	let favButton: HTMLDivElement;
	let platforms: any[];
	let inLibrary = false;
	let inQueue = false;

	function closeDetailsPage(e: MouseEvent | KeyboardEvent) {
		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key === 'Escape') {
			dispatch('close');
			$hasMaximizedCard = false;
		}
	}

	async function getGameDetails() {
		gameData = await window.anima.getDetails(id);

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

	onMount(async () => {
		inLibrary = User.inLibrary(id);
		inQueue = User.inQueue(id);
		
		dispatch('open');
		getGameDetails();
	});

</script>

<svelte:body on:keydown={closeDetailsPage}/>

<div class="sc z-50 grid absolute overflow-auto
					overscroll-contain left-0 text-white 
					{(!hasMaximizedCard ? ' hidden ' : '')}
					h-full w-full"
		style="top: {window.scrollY}px"
		on:scroll|stopPropagation
		transition:fade={{duration: 200}}>

	<div class="card-max-content flex flex-col self-center
							justify-items-start place-self-center bold text-5xl bg-black
							shadow-lg w-full h-full bg-no-repeat bg-top bg-cover"
				style="background-image: url({gameData.background_image_additional}); 
							background-position: 0 -200px;
							background-size: 1920px 1080px;">
	
		<div class="flex flex-wrap content-start justify-end absolute w-full" on:click={closeDetailsPage}>
			<i class="fas fa-times text-2xl cursor-pointer m-4 transition duration-400 text-white hover:text-green-400"></i>
		</div>
		<div class="flex flex-col h-full p-5 bg-gradient-to-t from-main-color via-main-color">
			<div class="flex flex-cols w-full">
				<div class="bg-cover bg-top bg-white rounded-xl w-56 h-72" style="background-image: url({image === '' ? gameData.background_image : image})"
							in:receive={{key: transition ? IMG + id : null}}
							out:send={{key:  transition ? IMG + id : null}}>
				</div>
				<div class="self-end {titleColor} mx-5"
							in:receive={{key: transition ? TITLE + id : null}}
							out:send={{key: transition ? TITLE + id : null}}>
					<h1 class="text-3xl font-bold text-left">
						{name === '' ? gameData.name : name}
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
							on:click={() => {
								if (!inLibrary && gameData !== {})
									User.addToLibrary(gameData);
								else
									User.removeFromLibrary(gameData);

								inLibrary = User.inLibrary(id);
								dispatch('libraryUpdated')
							}}>
					<div class="{inLibrary ? '' : 'hidden'} flex justify-center w-full">
						<i class="fas fa-heart self-center text-2xl text-red-400"></i>
					</div>
					<div class="{!inLibrary ? '' : 'hidden'} flex justify-center w-full">
						<i class="far fa-heart self-center text-2xl"></i>
					</div>
					<div class="text-xs text-center my-1 {inLibrary ? 'text-red-400' : ''}">
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
							on:click={() => window.anima.openWebsite(gameData.website)}>
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