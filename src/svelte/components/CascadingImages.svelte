<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { scrollY } from '../App.svelte';
	import CascadingImage from './CascadingImage.svelte';
	import Compress from '../Compress';
	import DetailsPage, { hasMaximizedCard } from '../Page/DetailsPage.svelte';

	export let ready = false;

	const dispatch = createEventDispatcher();
	let banners: any[] = [];  
	let bigText = '';
	let bigSubText = '';
	let bigImage = '';
	let i = 0;
	let timeout: NodeJS.Timeout;
	let show = false;
	let id = -1;
	
	onMount(async () => {
		let temp = (await window.api.search({name: ''})).slice(0, 5);

		for (let j = 0; j < temp.length; j++) {
			banners.push(await window.api.getDetails(temp[j].id));
			banners[j].background_image = await Compress.compress(temp[j].background_image, 1366, 736).then(value => {
				if (j === 4) {
					dispatch('ready');
				}
			});
		}

		change(0);
	});
	
	async function change(value: number) {
		clearTimeout(timeout);

		i = value;

		if (i !== 5) {
			bigText = banners[i].name;
			bigSubText = banners[i].developers[0].name;
			bigImage = banners[i].background_image;
			id = banners[i].id;
		} else {
			change(0);
		}

		timeout = setTimeout(() => {
			change(++i);
		}, 5000);
	}
</script>

{#if show}
	<DetailsPage on:close={() => show = false} transition={false} id={id}/>
{/if}

<div class="w-full h-screen mb-8 overscroll-auto" style="height: 100vh;">
	<div class="w-full h-full bg-top bg-cover bg-no-repeat" 
		   style="background-image: url('{bigImage}');
			 				background-position: 50% {($scrollY) * 0.4}px;">
		<div class="bg-gradient-to-t from-main-color via-transparent w-full h-full">
			<div class="bg-gradient-to-r from-main-color via-transparent w-full h-full">
				<div class="flex flex-col space-between text-white h-full">
					{#if ready}
						<div class="flex-grow p-20">
						<div class="flex flex-col flex-wrap justify-center h-full" in:fly={{delay: 300, x: -100}}>
							<div class="text-base">
								{bigSubText}
							</div>
							<div class="text-6xl font-bold">{bigText}</div>
									<button class="w-28 mt-6 px-4 py-2 transition bg-gray-500 bg-opacity-30 hover:bg-opacity-50 rounded"
									on:click={() => {$hasMaximizedCard = true; show = true; }}>
									Check out
								</button>
							</div>
						</div>
						<!-- {#await Compress.compressFiles(banners.map((el) => el.background_image), 300, 200) then images} -->
							<div class="sc flex justify-start lg:justify-center space-x-4 self-end w-full overflow-x-auto p-5">
								{#each banners as game, index (game.id)}
									<div in:fly={{delay: (50 * index), x: -100}}>
											<CascadingImage border="rounded-2xl {i === index ? 'ring-4 ring-accent-green': ''}" 
											on:click={() => change(index)} name={game.name} image={game.background_image}/>
									</div>
								{/each}
							</div>
						<!-- {/await} -->
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>