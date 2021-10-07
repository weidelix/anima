<script lang="ts" context="module">
	declare let window : WindowAPI;
</script>

<script lang="ts">
	import { scrollY } from '../App.svelte';
</script>

<div class="w-full h-screen mb-8 overscroll-auto" style="height: 40rem;">
	<div class="w-full h-full bg-top bg-cover bg-no-repeat" 
		   style="background-image: url('https://wallpaperaccess.com/full/6993436.jpg');
			 				background-position: 50% {($scrollY - 300) * 0.4}px;">
		<div class="bg-gradient-to-t from-main-color via-transparent w-full h-full">
			<div class="bg-gradient-to-r from-main-color via-transparent w-full h-full">
				<div class="flex flex-col space-between text-white h-full">
					<div class="flex-grow p-20">
						<div class="flex flex-col flex-wrap justify-center h-full">
							<div class="text-base">45.6 Billion Won is Child's Play</div>
							<div class="text-6xl font-bold">Squid Game</div>
							<button class="w-28 mt-6 px-4 py-2 transition bg-gray-500 bg-opacity-30 hover:bg-opacity-50 rounded">Check out</button>
						</div>
					</div>
					<div class="sc flex justify-start lg:justify-center space-x-4 self-end w-full overflow-x-auto p-5">
						<div class="bg-white rounded-xl shadow-xl transition hover:transform-gpu hover:scale-110">
							<div class="w-48 h-28 text-black">
								Placeholder

								image
								hover: title
							</div>
						</div>
						<div class="bg-green-400 rounded-xl shadow-xl transition hover:transform-gpu hover:scale-110">
							<div class="w-48 h-28 text-black">
								Placeholder

								image
								hover: title
							</div>
						</div>
						<div class="bg-blue-400 rounded-xl shadow-xl transition hover:transform-gpu hover:scale-110">
							<div class="w-48 h-28 text-black">
								Placeholder

								image
								hover: title
							</div>
						</div>
						<div class="bg-red-400 rounded-xl shadow-xl transition hover:transform-gpu hover:scale-110">
							<div class="w-48 h-28 text-black">
								Placeholder

								image
								hover: title
							</div>
						</div>
						<div class="bg-yellow-400 rounded-xl shadow-xl transition hover:transform-gpu hover:scale-110">
							<div class="w-48 h-28 text-black">
								Placeholder

								image
								hover: title
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>