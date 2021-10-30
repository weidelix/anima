<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const selected = writable(-1);
	export const playing = writable('');
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import User, { profile } from '../User';
	import { details } from '../Page/Details.svelte';
	import page from '../pager/page';
	import Button from './Button.svelte';


	let isFirstGame = false;
	let container: HTMLDivElement;
	let posY = 0.0;
	let onPickup = false;
	
	export let isDragging = false;
	export let y = 0.0;
	export let index: number;
	export let title = '';
	export let image = '';
	export let id = -9999;

	function pickup() {
		onPickup = true;
		// isDragging = true;
		$selected = id;
	}
	
	function drag(y: number) {
		onPickup = false;

		if (isDragging)
		{
			let i = index;
			let height = container.getBoundingClientRect().height;
			posY += y;
			
			if (y > 0 && posY > 0) {
				i = Math.floor(posY / (height + 10)) + index;
			}
			else if (y < 0 && posY < 0) {
				i = Math.floor((posY + height) / (height + 10)) + index;
			}
			
			if (i >= $profile.queue.length)
				i = $profile.queue.length - 1;
			else if (i <= 0)
				i = 0;

			let temp = $profile.queue[index];
			
			if (!((new Set($profile.queue)).size !== $profile.queue.length) && index !== i) {
				$profile.queue = $profile.queue.filter(el => el.id !== id);
				$profile.queue.splice(i, 0, temp);
				User.writeQueue($profile.queue);
				posY = 0;
			}
		}
	}

	function drop() {
		onPickup = false;
		isDragging = false;
		posY = 0;
		isFirstGame = User.isFirstGame(id);

		if (isFirstGame)
			$playing = title;
	}

	onMount(() => {
		isFirstGame = User.isFirstGame(id);
		
		if (isFirstGame)
			$playing = title;
	});

	$: drag(y);
</script>

<svelte:window on:mouseup={drop}/>

<div bind:this={container} 
		 class="flex justify-between p-3 w-full h-24 text-white
						{onPickup ? 'bg-yellow-400 transition duration-500' : ''}
		 				{isDragging ? 'bg-yellow-400 transition-colors duration-500' 
						 						: 'transition duration-500'}
						{!onPickup && !isDragging ? 'bg-sub-color' : ''}
					  rounded-xl"
		 style="transform: translateY({posY}px) scale({isDragging || onPickup ? 1.02 : 1});"
		 on:mousedown={pickup}
		 on:mousemove={() => {
			 if (onPickup)
				isDragging = true;
		 }}>
	<div class="flex items-center w-auto h-full space-x-3">
		<div class="w-28 h-full bg-cover rounded-xl" 
				 style="background-color: white; background-image: url({image})"></div>
		<div>
			<div class="text-base font-bold">{title}</div>
			<div class="{!isFirstGame ? 'hidden' : ''}">
				<span class="h-full text-xs align-middle">
					Currently Playing 
				</span>
				<span class="text-xl text-accent-green align-top">▸</span>
			</div>
		</div>
	</div>
	<div class="flex justify-center items-center h-full space-x-3 font-main">
		<Button class="" on:click={() => { 
							User.removeFromQueue({id: id}); 
							isFirstGame = User.isFirstGame(id);

							if (isFirstGame)
								$playing = title;
						}}
						color={'red'}>
			Remove
		</Button>
		<Button class="" color={'blue'}
						on:click={() => { 
							$details = {transition: true, id: id, name: title, image: image }
							page.go('/details');
						}}>
			View
		</Button>
	</div>
</div>