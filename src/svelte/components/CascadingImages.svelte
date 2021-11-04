<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { scrollY } from '../App.svelte';
	import CascadingImage from './CascadingImage.svelte';
	import Button from '../components/Button.svelte';
	import Tag from '../components/Tag.svelte';
	import Compress from '../Compress';
	import { details } from '../Page/Details.svelte';
	import page from '../pager/page';

	export let ready = false;

	const dispatch = createEventDispatcher();

	let banners: any[] = [];  
	let i = 0;
	let timeout: NodeJS.Timeout;
	
	onMount(async () => {
		let date = new Date();
		let temp = (await window.anima.search({
			name: '', 
			date: `${date.getFullYear()}-${date.getMonth()+1}-01,${date.getFullYear()}-${date.getMonth()+1}-30`
		})).slice(0, 5);

		for (let j = 0; j < temp.length; j++) {
			banners.push(await window.anima.getDetails(temp[j].id));
			banners[j].background_image = await Compress.compress(temp[j].background_image, 1920, 1080, 0.8);
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
</script>

<div class="relative w-full h-screen mb-8 overscroll-auto" 
		 style="height: 100vh;">
	{#each banners as banner, index}
		{#if index === i}
			<div class="absolute left-0 top-0 w-full h-full bg-top bg-cover bg-no-repeat" 
					 style="background-image: url('{banner.background_image}');
									background-position: 50% {($scrollY) * 0.4}px;"
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
									{banner.developers[0].name}&nbsp • &nbsp;  
								</span>
								<Tag class="{!(banner.parent_platforms.some(el => el.platform.slug.includes("xbox"))) ? 'hidden' : ''}
									bg-xbox">
								<i class="fab fa-xbox"></i>
								</Tag>
								<Tag class="{!(banner.parent_platforms.some(el => el.platform.slug.includes("playstation"))) ? 'hidden' : ''}
													bg-blue-500">
									<i class="fab fa-playstation "></i>
								</Tag>
								<Tag class="{!(banner.parent_platforms.some(el => el.platform.slug === 'pc')) ? 'hidden' : ''}
													bg-blue-400">
									<i class="fab fa-windows"></i>
								</Tag>
								<Tag class="{!(banner.parent_platforms.some(el => (el.platform.slug === "macos") || 
																										(el.platform.slug === "ios")   ||
																										(el.platform.slug === "mac"))) ? 'hidden' : ''}
														bg-gray-400">
									<i class="fab fa-apple"></i>
								</Tag>
								<Tag class="{!(banner.parent_platforms.some(el => el.platform.slug === "linux")) ? 'hidden' : ''}
														bg-yellow-400">
									<i class="fab fa-linux"></i>
								</Tag>
								<Tag class="{!(banner.parent_platforms.some(el => el.platform.slug.includes("android"))) ? 'hidden' : ''}
														bg-green-500">
									<i class="fab fa-android"></i>
								</Tag>
							</div>
							<div class="mt-3 mb-6 text-5xl font-bold"
									in:fly={{ y: -20, delay: 100 }} out:fly={{ y: 20, delay: 100}}>
								{banner.name}
							</div>
							<Button class="px-3 py-2 w-28 text-base rounded" color="white" 
											on:click={() => {
												$details = {
													unique: 0, 
													transition: true,
													id: banner.id,
													name: banner.name,
													image: banner.background_image
												};
				
												page.go('/details');
											}}>
									Check out
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	{/each}
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