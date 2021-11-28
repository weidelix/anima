<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition'

	export let right: number;
	export let top: number; 
	export let base = true;

	let panel: HTMLDivElement;

	onMount(() => {
		setPosition();
	});

	function setPosition() {
		panel.style.left = (right - panel.getBoundingClientRect().width).toString() + 'px';
		panel.style.top = top.toString() + 'px';
	}

	$: if (panel !== undefined && right && top) {
		setPosition();
	}
</script>

<div bind:this={panel} class="absolute" style="z-index: 9999;" on:click|stopPropagation>
	<div class="{base ? "text-left text-white bg-sub-color rounded-xl shadow-xl" : ''}"
				transition:fly={{ duration: 200, y: -30 }}>
		<slot/>
	</div>
</div>