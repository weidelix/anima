<script lang="ts" context="module">
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { scrollY } from '../App.svelte';
	
	export const details = writable({ 
		unique: 0,
		transition: false, 
		id: -9999, 
		name: '', 
		image: ''});
	
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
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import User from '../User';
	import page from '../pager/page';
	import Tag from '../components/Tag.svelte';
	import Compress from '../Compress';

	const dispatch = createEventDispatcher();
	const TITLE = 2;
	const IMG = 3;

	let gameData : any = { id: -9999 }; 
	let metaColor = 'green';
	let titleColor = 'transparent';
	let lessDesc = '';
	let moreDesc = '';
	let showMore = false;
	let platforms: any[] = [];
	let inLibrary = false;
	let inQueue = false;

	function closeDetailsPage(e: MouseEvent | KeyboardEvent) {
		if ((e as MouseEvent).button === 0 || (e as KeyboardEvent).key === 'Escape') {
			dispatch('close');
		}
	}

	async function getGameDetails() {
		gameData = await window.anima.getDetails($details.id);

		if ($details.image === '' || $details.image === null) {
			$details.image = await Compress.compress(gameData.background_image);
			gameData.background_image_additional = await Compress.compress(gameData.background_image_additional);
		}

		platforms = gameData.parent_platforms;

		[lessDesc] = gameData.description.split('</p>');
		moreDesc = gameData.description.split(lessDesc)[1];
	}

	function more() {
		showMore = !showMore;
	}

	onMount(async () => {
		inLibrary = User.inLibrary($details.id);
		inQueue = User.inQueue($details.id);

		dispatch('open');
		getGameDetails();
	});

	onDestroy(() => {
		// URL.revokeObjectURL($details.image);
		URL.revokeObjectURL(gameData.background_image_additional);
	})
</script>

<svelte:body on:keydown={closeDetailsPage}/>

<div class="sc grid absolute overflow-auto
					overscroll-contain left-0 text-white 
					h-full w-full"
		style="top: {$scrollY}px;
					 z-index: 99999"
		on:scroll|stopPropagation
		transition:fade={{duration: 200}}>

	<div class="card-max-content flex flex-col self-center
							justify-items-start place-self-center bold text-5xl bg-black
							shadow-lg w-full h-full bg-no-repeat bg-top bg-cover"
				style="background-image: url({gameData.background_image_additional}); 
							background-position: 0 -200px;
							background-size: 1920px 1080px;">
	
		<div class="flex flex-wrap content-start justify-end absolute w-full" on:click={() => page.back()}>
			<i class="fas fa-times text-2xl cursor-pointer m-4 transition duration-400 text-white hover:text-green-400"></i>
		</div>
		<div class="flex flex-col h-full p-5 bg-gradient-to-t from-main-color via-main-color">
			<div class="flex flex-cols w-full">
				<div class="bg-cover bg-top bg-white rounded-xl w-56 h-72" 
						 style="background-image: url({$details.image})"
						 in:receive={{key: $details.transition ? IMG + $details.id + $details.unique : null}}
						 out:send={{key:  $details.transition ? IMG + $details.id + $details.unique : null}}>
				</div>
				<div class="self-end {titleColor} mx-5"
							in:receive={{key: $details.transition ? TITLE + $details.id + $details.unique : null}}
							out:send={{key: $details.transition ? TITLE + $details.id + $details.unique: null}}>
					<h1 class="text-3xl font-bold text-left">
						{$details.name === '' ? gameData.name : $details.name}
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
				<div class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-red-400 hover:bg-red-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2"
							on:click={() => {
								if (!inLibrary && gameData !== {})
									User.addToLibrary(gameData);
								else
									User.removeFromLibrary(gameData);

								inLibrary = User.inLibrary($details.id);
							}}>
					<div class="{inLibrary ? '' : 'hidden'} flex justify-center w-full">
						<i class="fas fa-heart self-center text-2xl text-red-400"></i>
					</div>
					<div class="{!inLibrary ? '' : 'hidden'} flex justify-center w-full">
						<i class="far fa-heart self-center text-2xl"></i>
					</div>
					<div class="text-xs text-center my-1 {inLibrary ? 'text-red-400' : ''}">
						{#if inLibrary}
							In Favorites
						{:else}
							Add to Favorites
						{/if}
					</div>
				</div>
				<div class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-yellow-400 hover:bg-yellow-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2
										{inQueue ? 'text-yellow-400' : ''}"
							on:click={() => {
								if (!inQueue && gameData !== {})
									User.addToQueue(gameData);
								else
									User.removeFromQueue(gameData);

								inQueue = User.inQueue($details.id);
							}}>
					<i class="fas fa-layer-group text-2xl self-center"></i>
					<div class="text-xs text-center my-1">
						{#if inQueue}
							In Queue
						{:else}
							Add to Queue
						{/if}
					</div>
				</div>
				{#if gameData.website !== undefined || gameData.website !== ''}
					<div class="flex flex-wrap flex-col justify-center transition duration-400 text-white hover:text-blue-400 hover:bg-blue-200 hover:bg-opacity-20 rounded-xl w-full h-full p-2"
								on:click={() => window.anima.openWebsite(gameData.website)}>
						<i class="fas fa-globe-americas text-2xl self-center"></i>
						<div class="text-xs text-center my-1">
							Visit Website
						</div>
					</div>
				{/if}
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
					<div class="flex flex-wrap content-center space-x-2 mx-4" style="font-size: 0.7rem;">
						{#if platforms.length > 0}
							<Tag class="{!(platforms.some(el => el.platform.slug.includes("xbox"))) ? 'hidden' : ''}
												bg-xbox">
							<i class="fab fa-xbox"></i>
							</Tag>
							<Tag class="{!(platforms.some(el => el.platform.slug.includes("playstation"))) ? 'hidden' : ''}
												bg-blue-500">
								<i class="fab fa-playstation "></i>
							</Tag>
							<Tag class="{!(platforms.some(el => el.platform.slug === 'pc')) ? 'hidden' : ''}
												bg-blue-400">
								<i class="fab fa-windows "></i>
							</Tag>
							<Tag class="{!(platforms.some(el => (el.platform.slug === "macos") || 
																									(el.platform.slug === "ios")   ||
																									(el.platform.slug === "mac"))) ? 'hidden' : ''}
													bg-gray-400">
								<i class="fab fa-apple"></i>
							</Tag>
							<Tag class="{!(platforms.some(el => el.platform.slug === "linux")) ? 'hidden' : ''}
													bg-yellow-400">
								<i class="fab fa-linux"></i>
							</Tag>
							<Tag class="{!(platforms.some(el => el.platform.slug.includes("android"))) ? 'hidden' : ''}
													bg-green-500">
								<i class="fab fa-android"></i>
							</Tag>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>