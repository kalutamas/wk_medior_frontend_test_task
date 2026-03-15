<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const isDrawerOpen = ref(false)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}
</script>

<template>
  <div class="min-h-screen">
    <AppTopbar @toggle-drawer="toggleDrawer" />

    <div class="relative flex min-h-[calc(100vh-65px)]">
      <aside class="hidden shrink-0 lg:block">
        <AppSidebar @navigate="closeDrawer" @close-drawer="closeDrawer" />
      </aside>

      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>

      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-40 bg-black/35 lg:hidden"
        @click="closeDrawer"
      />

      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-out lg:hidden"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <AppSidebar @navigate="closeDrawer" @close-drawer="closeDrawer" />
      </aside>
    </div>
  </div>
</template>
