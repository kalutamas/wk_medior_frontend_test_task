<script setup lang="ts">
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import thomasAndersonImage from '@/assets/images/thomas_anderson.png'

const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const userMenuRef = ref<HTMLDetailsElement | null>(null)
const isDarkMode = ref(false)
const themeStorageKey = 'vk-test-task.theme'
const lightThemeName = ref('corporate')
const darkThemeName = 'night'

// Témát alkalmaz a dokumentumon és localStorage-ba menti.
const applyTheme = () => {
  const theme = isDarkMode.value ? darkThemeName : lightThemeName.value
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(themeStorageKey, theme)
}

// Sötét/világos mód között vált és alkalmazza az új témát.
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  applyTheme()
}

// Külső kattintásra bezárja a felhasználói menüt.
const handleOutsideClick = (event: MouseEvent) => {
  const menu = userMenuRef.value
  const target = event.target as Node | null

  if (!menu || !target) return
  if (!menu.open) return
  if (menu.contains(target)) return

  menu.open = false
}

onMounted(() => {
  // Az index.html témáját veszi alapértelmezett világos témának.
  lightThemeName.value = document.documentElement.getAttribute('data-theme') || 'corporate'

  const savedTheme = localStorage.getItem(themeStorageKey)
  if (savedTheme === darkThemeName) {
    isDarkMode.value = true
  } else if (savedTheme === lightThemeName.value || savedTheme === 'light') {
    isDarkMode.value = false
  } else {
    isDarkMode.value = document.documentElement.getAttribute('data-theme') === darkThemeName
  }

  applyTheme()
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <header class="navbar border-b border-base-300 bg-base-100 px-4 md:px-6">
    <div class="navbar-start gap-2">
      <button class="btn btn-ghost btn-square lg:hidden" @click="emit('toggle-drawer')">
        <Bars3Icon class="h-8 w-8" />
      </button>
      <h1 class="flex items-center gap-2 font-semibold"> <UserCircleIcon class="h-6 w-6" /> Ügyfél Admin</h1>
    </div>

    <div class="navbar-center hidden md:flex">
      <label class="input input-bordered flex items-center gap-2 w-82 rounded-full">
        <MagnifyingGlassIcon class="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          name="search"
          placeholder="Keresés..."
          class="grow"
        >
      </label>
    </div>

    <div class="navbar-end">
      <details ref="userMenuRef" class="dropdown dropdown-end">
        <summary class="btn btn-ghost">
            <div class="avatar avatar-online avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-8 rounded-full">
                  <img :src="thomasAndersonImage" alt="Thomas Anderson" />
                </div>
            </div>
            <span class="hidden md:flex">Thomas Anderson</span>
        </summary>
        <ul class="menu dropdown-content z-20 mt-2 w-full min-w-fit rounded-box border border-base-300 bg-base-100 p-2 shadow">
          <li>
            <a class="flex items-center gap-2">
              <UserCircleIcon class="h-4 w-4" />
              Profil
            </a>
          </li>
          <li>
            <button
              type="button"
              role="switch"
              :aria-checked="isDarkMode"
              class="flex w-full gap-2 rounded-field px-2 py-1.5 text-sm hover:bg-base-200"
              @click="toggleTheme"
            >
            <label class="toggle toggle-sm text-base-content pointer-events-none">
                <input :checked="isDarkMode" type="checkbox" tabindex="-1" aria-hidden="true">
                <SunIcon class="h-3.5 w-3.5" />
                <MoonIcon class="h-3.5 w-3.5" />
              </label>
              <span>Sötét mód</span>

              
            </button>
          </li>
          <li>
            <a class="flex items-center gap-2 text-error">
              <ArrowRightOnRectangleIcon class="h-4 w-4" />
              Kijelentkezés
            </a>
          </li>
        </ul>
      </details>
    </div>
  </header>
</template>
