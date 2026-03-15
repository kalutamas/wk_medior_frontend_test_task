<script setup lang="ts">
import { computed } from 'vue'
import { useCustomers } from '@/composables/useCustomers'

const { customers } = useCustomers()

const totalCustomers = computed(() => customers.value.length)
const activeCustomers = computed(() => customers.value.filter((customer) => customer.status === 'active').length)
const inactiveCustomers = computed(() => customers.value.filter((customer) => customer.status === 'inactive').length)
const leadCustomers = computed(() => customers.value.filter((customer) => customer.status === 'lead').length)
</script>

<template>
  <section class="grid gap-4 md:grid-cols-4">
    <article class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <p class="text-sm text-base-content/60 text-center">Összes ügyfél</p>
        <p class="text-2xl font-bold text-center">{{ totalCustomers }}</p>
      </div>
    </article>

    <article class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <p class="text-sm text-base-content/60 text-center">Aktív ügyfelek</p>
        <p class="text-2xl font-bold text-success text-center">{{ activeCustomers }}</p>
      </div>
    </article>

    <article class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <p class="text-sm text-base-content/60 text-center">Inaktív ügyfelek</p>
        <p class="text-2xl font-bold text-gray-500 text-center">{{ inactiveCustomers }}</p>
      </div>
    </article>

    <article class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <p class="text-sm text-base-content/60 text-center">Leadek</p>
        <p class="text-2xl font-bold text-warning text-center">{{ leadCustomers }}</p>
      </div>
    </article>
  </section>
</template>
