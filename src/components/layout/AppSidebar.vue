<script setup lang="ts">
import { XMarkIcon, UserGroupIcon, MapIcon, MagnifyingGlassIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const emit = defineEmits<{
  (e: 'navigate'): void
  (e: 'close-drawer'): void
}>()

const route = useRoute()
</script>

<template>
  <aside class="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-200">
    <div class="border-b border-base-300 px-5 py-4 lg:hidden">
      <div class="flex items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-wide text-base-content/60">Navigáció</p>
          <p class="text-lg font-semibold">Ügyfél Admin</p>
        </div>

        <button
          class="btn btn-ghost btn-square lg:hidden"
          aria-label="Sidebar bezárása"
          @click="emit('close-drawer')"
        >
          <XMarkIcon class="h-8 w-8" />
        </button>
      </div>

      <label class="input input-bordered mt-3 flex items-center gap-2 rounded-full md:hidden">
        <MagnifyingGlassIcon class="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          name="search"
          placeholder="Keresés..."
          class="grow"
        >
      </label>
    </div>
    <ul class="menu w-full flex-1 pt-2 text-base-content">
      <li>
        <RouterLink
          to="/ugyfelek"
          class="relative rounded-field border border-transparent transition-colors"
          active-class="bg-base-300 font-semibold"
          @click="emit('navigate')"
        >
            <UserGroupIcon
              class="h-5 w-5"
              :class="route.path.startsWith('/ugyfelek') ? 'text-primary' : ''"
            />
            Ügyfelek
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/terkep"
          class="relative rounded-field border border-transparent transition-colors"
          active-class="bg-base-300 font-semibold"
          @click="emit('navigate')"
        >
            <MapIcon
              class="h-5 w-5"
              :class="route.path.startsWith('/terkep') ? 'text-primary' : ''"
            />
            Térkép
        </RouterLink>
      </li>
    </ul>

    <div class="border-t border-base-300 px-5 py-3 text-[11px] text-base-content/60 flex items-center justify-between gap-2">
      &copy; Kalu Tamás <span>|</span> <a class="inline-flex gap-1 items-center" href="mailto:kalutamas@gmail.com"><EnvelopeIcon class="h-4 w-4" /> kalutamas@gmail.com</a>
    </div>
  </aside>
</template>
