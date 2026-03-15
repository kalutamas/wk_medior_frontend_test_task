<script setup lang="ts">
import CustomerStats from '@/components/customers/CustomerStats.vue'
import CustomersTable from '@/components/customers/CustomersTable.vue'
</script>

<template>
  <section class="space-y-4 md:space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold">Ügyfelek</h2>
        <p class="text-sm text-base-content/70">Az ügyfelek nyilvántartása és kezelése.</p>
      </div>
    </header>

    <CustomerStats />
    <CustomersTable />
  </section>
</template>
