<script lang="ts">
	import { register, activeRoute, prevPath } from './Router.svelte';

	export let path = '*';
	export let component = null;

	register({ path, component });
</script>

{#if $activeRoute.path === path || ($prevPath === path && $activeRoute.path === '/details')}
	<svelte:component this={component}/>
{/if}