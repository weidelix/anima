<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { hasMaximizedCard } from '../components/Card.svelte';
	import CardPlaceholder from '../components/CardPlaceholder.svelte';

	let popularGames: any[] = []; 
	let recentGames: any[] = [];
	
	onMount(async () => {
		popularGames = (await window.api.search({name: ''})).results;
		recentGames = (await window.api.search({name: '', date: '2021-01-01,2021-12-31'})).results;
	});
</script>

<div>
	<div class="flex flex-col space-y-4">
		<div>
			<div class="text-white text-left font-main text-2xl my-2">
				Popular <i class="fas fa-fire-alt text-orange"></i>
			</div>
			<div class="sc flex {$hasMaximizedCard ? 'space-x-0' : 'space-x-2'} content-start overflow-x-scroll h-60">
				{#each popularGames as game (game.id)}
					{#await window.api.compress(game.background_image)}
						<CardPlaceholder/>
					{:then image}
						<Card gameID={game.id} title={game.name} image={image}/>
					{/await}
				{/each}
			</div>
		</div>
	
		<div>
			<div class="text-white text-left font-main text-2xl my-2">
				Big Releases <i class="fas fa-meteor text-yellow-400"></i>
			</div>
			<div class="sc flex {$hasMaximizedCard ? 'space-x-0' : 'space-x-2'} content-start overflow-x-scroll h-60">
				{#each recentGames as game (game.id)}
					{#await window.api.compress(game.background_image)}
						<CardPlaceholder/>
					{:then image}
						<Card gameID={game.id} title={game.name} image={image}/>
					{/await}
				{/each}
			</div>
		</div>
	</div>
</div>