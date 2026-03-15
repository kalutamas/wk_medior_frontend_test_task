<script setup lang="ts">
import {
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const rows = [
  {
    id: '1',
    name: 'Kovács Ádám',
    email: 'adam@example.com',
    status: 'Active',
    tags: ['premium', 'b2b'],
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    name: 'Nagy Éva',
    email: 'eva@example.com',
    status: 'Inactive',
    tags: ['trial'],
    createdAt: '2026-03-08',
  },
  {
    id: '3',
    name: 'Szabó Péter',
    email: 'peter@example.com',
    status: 'Lead',
    tags: ['inbound'],
    createdAt: '2026-03-06',
  },
]

const statusClass = (status: string) => {
  if (status === 'Active') return 'badge badge-soft badge-outline badge-success'
  if (status === 'Inactive') return 'badge badge-soft badge-outline badge-ghost'
  if  (status === 'Lead') return 'badge badge-soft badge-outline badge-warning'
  return 'badge badge-soft badge-outline badge-info'
}
</script>

<template>
  <section class="card border border-base-300">
    <div class="card-body gap-4 p-4 md:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-semibold">Ügyfelek</h2>
        <div class="flex items-center gap-2 whitespace-nowrap">
          <button class="btn btn-primary btn-sm gap-1">
            <PlusIcon class="h-4 w-4" />
            Új ügyfél
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table customers-table">
          <thead>
            <tr>
              <th>Név</th>
              <th>Email</th>
              <th>Státusz</th>
              <th>Címkék</th>
              <th>Létrehozva</th>
              <th class="actions-column">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td class="font-medium" data-label="Név">{{ row.name }}</td>
              <td data-label="Email">{{ row.email }}</td>
              <td data-label="Státusz"><span :class="statusClass(row.status)">{{ row.status }}</span></td>
              <td data-label="Címkék">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in row.tags" :key="tag" class="badge badge-outline badge-secondary badge-sm">{{ tag }}</span>
                </div>
              </td>
              <td data-label="Létrehozva">{{ row.createdAt }}</td>
              <td class="cell-actions actions-column" data-label="Műveletek">
                <div class="flex gap-2">
                  <button class="btn btn-soft btn-primary btn-sm gap-1">
                    <PencilSquareIcon class="h-4 w-4" />
                    Szerkesztés
                  </button>
                  <button class="btn btn-soft btn-secondary btn-sm gap-1">
                    <MapPinIcon class="h-4 w-4" />
                    Lokáció
                  </button>
                  <button class="btn btn-soft btn-error btn-sm gap-1">
                    <TrashIcon class="h-4 w-4" />
                    Törlés
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex w-full flex-wrap items-center justify-between gap-3">
        <select class="select select-bordered select-xs w-24 max-w-xs">
          <option>10 / oldal</option>
          <option>25 / oldal</option>
          <option>50 / oldal</option>
        </select>

        <div class="join border border-base-200 rounded-box">
          <button class="join-item btn btn-ghost btn-xs" aria-label="Előző oldal"><ChevronLeftIcon class="h-4 w-4" /></button>
          <button class="join-item btn btn-ghost btn-xs btn-active">1</button>
          <button class="join-item btn btn-ghost btn-xs">2</button>
          <button class="join-item btn btn-ghost btn-xs">3</button>
          <button class="join-item btn btn-ghost btn-xs" aria-label="Következő oldal"><ChevronRightIcon class="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.customers-table .actions-column {
  width: 1%;
  white-space: nowrap;
  padding-right: 0;
}

@media (max-width: 767px) {
  .customers-table thead {
    display: none;
  }

  .customers-table,
  .customers-table tbody,
  .customers-table tr,
  .customers-table td {
    display: block;
    width: 100%;
  }

  .customers-table tr {
    margin-bottom: 0.75rem;
    border: 1px solid hsl(var(--bc) / 0.15);
    border-radius: 0.75rem;
    padding: 0.75rem;
    background: hsl(var(--b1));
  }

  .customers-table td {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.35rem 0;
    border: 0;
  }

  .customers-table td::before {
    content: attr(data-label);
    font-size: 0.75rem;
    font-weight: 600;
    color: hsl(var(--bc) / 0.65);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    flex: 0 0 auto;
    margin-top: 0.15rem;
  }

  .customers-table td.cell-actions {
    display: block;
    padding-top: 0.6rem;
    white-space: normal;
  }

  .customers-table td.cell-actions::before {
    display: block;
    margin-bottom: 0.35rem;
  }
}
</style>
