<script lang="ts">
	let classProp = '';
	export { classProp as class};
</script>

<div class="{classProp} px-2 py-1 font-bold text-center text-white bg-white rounded-full"
		 style="min-width: 1.75rem;">
	<slot/>
</div>