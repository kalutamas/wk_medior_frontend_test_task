<script setup lang="ts">
  import { computed, ref } from 'vue'

  const name = ref('Vue felhasználó')
  const isOn = ref(false)

  const status = computed(() => (isOn.value ? 'ON' : 'OFF'))

  const toggle = () => {
    isOn.value = !isOn.value
  }
</script>

<template>
	<main class="min-h-screen bg-base-200 p-6 md:p-10">
		<section class="mx-auto max-w-3xl space-y-6">
			<header class="space-y-2 text-center">
				<h1 class="text-3xl font-bold tracking-tight">
          Vue + Tailwind + DaisyUI ellenorzes
        </h1>
				<p class="text-sm text-base-content/70">
					Ha ez a kartya DaisyUI stilussal jelenik meg es a spacing megfelelo, akkor minden rendben mukodik.
				</p>
			</header>

			<article class="card border border-base-300 bg-base-100 shadow-xl">
				<div class="card-body gap-5">
					<div class="flex flex-wrap items-center gap-2">
						<span class="badge badge-primary">Vue reaktivitas</span>
						<span class="badge badge-secondary">Tailwind osztalyok</span>
						<span class="badge badge-accent">DaisyUI komponensek</span>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<label class="form-control w-full">
							<span class="label-text mb-2">Nev (v-model)</span>
							<input
								v-model="name"
								type="text"
								class="input input-bordered w-full"
								placeholder="Ird be a neved"
							>
						</label>

						<div class="rounded-box border border-base-300 p-4">
							<p class="text-xs uppercase tracking-wide text-base-content/60">Elo kimenet</p>
							<p class="mt-2 text-lg font-semibold">Szia, {{ name }}</p>
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						<button class="btn btn-outline" @click="toggle">Kapcsolo: {{ status }}</button>
					</div>
				</div>
			</article>
		</section>
	</main>
</template>
