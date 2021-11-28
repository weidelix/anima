<script lang="ts" context="module">
	declare let window : WindowAPI;

	let banners: any[] = [];  
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { scrollY } from '../App.svelte';
	import CascadingImage from './CascadingImage.svelte';
	import Button from '../components/Button.svelte';
	import Tag from '../components/Tag.svelte';
	import Compress from '../Compress'
	import { details } from '../Page/Details.svelte';
	import page from '../pager/page';
	import { activeRoute } from '../pager/Router.svelte';

	export let ready = false;

	const dispatch = createEventDispatcher();

	let i = 0;
	let timeout: NodeJS.Timeout;
	
	onMount(async () => {
		if (banners.length === 0) {
			let date = new Date();
			banners = (await window.anima.search({
				name: '', 
				date: `${date.getFullYear()}-${date.getMonth()+1}-01,${date.getFullYear()}-${date.getMonth()+1}-30`
			})).slice(0, 5);
	
			for (let j = 0; j < banners.length; j++) {
				banners[j] = await window.anima.getDetails(banners[j].id);
				banners[j].background_image = await Compress.compress(banners[j].background_image, 1366, 736, 0.8);
			}
		}
		dispatch('ready');
		change(0);
	});
	
	async function change(value: number) {
		clearTimeout(timeout);

		i = value;

		if (i === banners.length) {
			change(0);
		}

		timeout = setTimeout(() => {
			change(++i);
		}, 7000);
	}

	$: if($activeRoute.path === '/search') {
		for (let j = 0; j < banners.length; j++) {
			URL.revokeObjectURL(banners[j].background_image);
		}

		banners = [];
	}
</script>

<div class="relative w-full overscroll-auto" 
		 style="height: 90vh;">
	{#if banners.length > 0}
		{#key i}
			<div class="absolute left-0 top-0 w-full h-full bg-top bg-cover bg-no-repeat transform-gpu" 
					 style="background-image: url('{banners[i].background_image}');
									background-position: 0 {($scrollY) * 0.4}px;"
					transition:fade>
				<div class="bg-gradient-to-t from-main-color via-transparent w-full h-full">
					<div class="bg-gradient-to-r from-main-color via-transparent w-full h-full">
					</div>
				</div>
			</div>
			<div class="absolute left-0 top-0 flex flex-col justify-center w-full h-full
									text-white ">
				{#if ready}
					<div class="flex-grow px-14">
						<div class="flex flex-col flex-wrap justify-center h-full">
							<div class="flex space-x-1 text-xs" 
								 	 in:fly={{ y: -20, delay: 0 }} out:fly={{ y: 20, delay: 0}}>
								<span class="inline-block align-middle text-base">
									{banners[i].developers[0].name}&nbsp • &nbsp;  
								</span>
								<Tag class="{!(banners[i].parent_platforms.some(el => el.platform.slug.includes("xbox"))) ? 'hidden' : ''}
									bg-xbox">
								<i class="fab fa-xbox"></i>
								</Tag>
								<Tag class="{!(banners[i].parent_platforms.some(el => el.platform.slug.includes("playstation"))) ? 'hidden' : ''}
													bg-blue-500">
									<i class="fab fa-playstation "></i>
								</Tag>
								<Tag class="{!(banners[i].parent_platforms.some(el => el.platform.slug === 'pc')) ? 'hidden' : ''}
													bg-blue-400">
									<i class="fab fa-windows"></i>
								</Tag>
								<Tag class="{!(banners[i].parent_platforms.some(el => (el.platform.slug === "macos") || 
																										(el.platform.slug === "ios")   ||
																										(el.platform.slug === "mac"))) ? 'hidden' : ''}
														bg-gray-400">
									<i class="fab fa-apple"></i>
								</Tag>
								<Tag class="{!(banners[i].parent_platforms.some(el => el.platform.slug === "linux")) ? 'hidden' : ''}
														bg-yellow-400">
									<i class="fab fa-linux"></i>
								</Tag>
								<Tag class="{!(banners[i].parent_platforms.some(el => el.platform.slug.includes("android"))) ? 'hidden' : ''}
														bg-green-500">
									<i class="fab fa-android"></i>
								</Tag>
							</div>
							<div class="mt-3 mb-6 text-5xl font-bold"
									in:fly={{ y: -20, delay: 100 }} out:fly={{ y: 20, delay: 100}}>
								{banners[i].name}
							</div>
							<Button class="px-3 py-2 w-28 text-base rounded" color="white" 
											on:click={() => {
												$details = {
													unique: 0, 
													transition: true,
													id: banners[i].id,
													name: banners[i].name,
													image: banners[i].background_image
												};
				
												page.go('/details');
											}}>
									Check out
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/key}
	{/if}
	<div class="sc absolute bottom-0 right-0 flex flex-wrap justify-start lg:justify-center 
							space-x-4 self-end w-full overflow-x-auto p-5">
		{#if ready}
			{#each banners as game, index (game.id)}
				<div in:fly={{delay: (50 * index), x: -100}}>
						<CascadingImage border="rounded-2xl {i === index ? 'ring-4 ring-accent-green': ''}" 
						on:click={() => change(index)} name={game.name} image={game.background_image}/>
				</div>
			{/each}
		{/if}
	</div>
</div>