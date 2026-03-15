<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import CustomerFormModal from '@/components/customers/CustomerFormModal.vue'
import CustomerDeleteModal from '@/components/customers/CustomerDeleteModal.vue'
import CustomerLocationModal from '@/components/customers/CustomerLocationModal.vue'
import { useCustomerLocationActions } from '@/composables/useCustomerLocationActions'
import { useCustomersTableQuerySync } from '@/composables/useCustomersTableQuerySync'
import { useCustomersTableState } from '@/composables/useCustomersTableState'
import { useCustomers } from '@/composables/useCustomers'
import type { Customer, CustomerStatus, CustomerUpsertPayload } from '@/types/customer'

const { customers, createCustomer, updateCustomer, removeCustomer } = useCustomers()

const {
  rowsPerPageOptions,
  rowsPerPage,
  currentPage,
  sortField,
  sortDirection,
  totalPages,
  pageNumbers,
  pagedCustomers,
  toggleSort,
  getSortIndicator,
  goToPreviousPage,
  goToNextPage,
} = useCustomersTableState(customers)

const isPaginationDisabled = computed(() => totalPages.value <= 1)

const isModalOpen = ref(false)
const editingCustomer = ref<Customer | null>(null)
const isDeleteModalOpen = ref(false)
const deletingCustomer = ref<Customer | null>(null)
const {
  isLocationModalOpen,
  locationCustomer,
  openLocationModal,
  saveCustomerLocation,
} = useCustomerLocationActions(updateCustomer)
const { isApplyingRouteState } = useCustomersTableQuerySync({
  rowsPerPageOptions,
  rowsPerPage,
  currentPage,
  sortField,
  sortDirection,
  totalPages,
})

watch(rowsPerPage, () => {
  if (isApplyingRouteState.value) return
  currentPage.value = 1
})

watch(isModalOpen, (open) => {
  if (!open) {
    editingCustomer.value = null
  }
})

watch(isDeleteModalOpen, (open) => {
  if (!open) {
    deletingCustomer.value = null
  }
})

const statusClass = (status: CustomerStatus) => {
  if (status === 'active') return 'badge badge-soft badge-outline badge-success'
  if (status === 'inactive') return 'badge badge-soft badge-outline badge-ghost'
  if (status === 'lead') return 'badge badge-soft badge-outline badge-warning'
  return 'badge badge-soft badge-outline badge-info'
}

const statusLabel = (status: CustomerStatus) => {
  if (status === 'active') return 'Aktív'
  if (status === 'inactive') return 'Inaktív'
  return 'Lead'
}

const formatDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  return date.toLocaleDateString('hu-HU')
}

const openCreateModal = () => {
  editingCustomer.value = null
  isModalOpen.value = true
}

const openEditModal = (customer: Customer) => {
  editingCustomer.value = customer
  isModalOpen.value = true
}

const saveCustomer = (payload: CustomerUpsertPayload) => {
  if (payload.id) {
    updateCustomer(payload.id, payload)
  } else {
    createCustomer(payload)
    currentPage.value = 1
  }

  isModalOpen.value = false
  editingCustomer.value = null
}

const openDeleteModal = (customer: Customer) => {
  deletingCustomer.value = customer
  isDeleteModalOpen.value = true
}

const confirmDeleteCustomer = () => {
  const customer = deletingCustomer.value
  if (!customer) return

  removeCustomer(customer.id)
  isDeleteModalOpen.value = false
  deletingCustomer.value = null
}

</script>

<template>
  <section class="card border border-base-300">
    <div class="card-body gap-4 p-4 md:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-semibold">Ügyfelek</h2>
        <div class="flex items-center gap-2 whitespace-nowrap">
          <button class="btn btn-primary btn-sm gap-1" @click="openCreateModal">
            <PlusIcon class="h-4 w-4" />
            Új ügyfél
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table customers-table">
          <thead>
            <tr>
              <th>
                <button class="sort-button" @click="toggleSort('name')">
                  Név
                  <span>{{ getSortIndicator('name') }}</span>
                </button>
              </th>
              <th>Email</th>
              <th>Státusz</th>
              <th>Címkék</th>
              <th>
                <button class="sort-button" @click="toggleSort('createdAt')">
                  Létrehozva
                  <span>{{ getSortIndicator('createdAt') }}</span>
                </button>
              </th>
              <th class="actions-column">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pagedCustomers.length === 0" class="empty-row">
              <td colspan="6" class="py-8 text-center text-base-content/70">
                Nincsenek ügyfelek.
              </td>
            </tr>

            <tr v-for="row in pagedCustomers" :key="row.id">
              <td class="font-medium" data-label="Név">{{ row.name }}</td>
              <td data-label="Email">{{ row.email }}</td>
              <td data-label="Státusz"><span :class="statusClass(row.status)">{{ statusLabel(row.status) }}</span></td>
              <td data-label="Címkék">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in row.tags" :key="tag" class="badge badge-outline badge-secondary badge-sm">{{ tag }}</span>
                </div>
              </td>
              <td data-label="Létrehozva">{{ formatDate(row.createdAt) }}</td>
              <td class="cell-actions actions-column" data-label="Műveletek">
                <div class="flex gap-2 cell-actions-content">
                  <button class="btn btn-soft btn-primary btn-sm gap-1" @click="openEditModal(row)">
                    <PencilSquareIcon class="h-4 w-4" />
                    Szerkesztés
                  </button>
                  <button class="btn btn-soft btn-secondary btn-sm gap-1" @click="openLocationModal(row)">
                    <MapPinIcon class="h-4 w-4" />
                    Lokáció beállítása
                  </button>
                  <button class="btn btn-soft btn-error btn-sm gap-1" @click="openDeleteModal(row)">
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
        <select name="userperpage" v-model.number="rowsPerPage" class="select select-bordered select-xs w-24 max-w-xs">
          <option v-for="pageSize in rowsPerPageOptions" :key="pageSize" :value="pageSize">{{ pageSize }} / oldal</option>
        </select>

        <div class="join border border-base-200 rounded-box">
          <button class="join-item btn btn-ghost btn-xs" aria-label="Előző oldal" :disabled="isPaginationDisabled || currentPage === 1" @click="goToPreviousPage"><ChevronLeftIcon class="h-4 w-4" /></button>
          <button
            v-for="pageNumber in pageNumbers"
            :key="pageNumber"
            class="join-item btn btn-ghost btn-xs"
            :class="{ 'btn-active': pageNumber === currentPage }"
            :disabled="isPaginationDisabled"
            @click="currentPage = pageNumber"
          >
            {{ pageNumber }}
          </button>
          <button class="join-item btn btn-ghost btn-xs" aria-label="Következő oldal" :disabled="isPaginationDisabled || currentPage === totalPages" @click="goToNextPage"><ChevronRightIcon class="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  </section>

  <CustomerFormModal
    v-model:open="isModalOpen"
    :customer="editingCustomer"
    @save="saveCustomer"
  />

  <CustomerDeleteModal
    v-model:open="isDeleteModalOpen"
    :customer-name="deletingCustomer?.name ?? ''"
    :customer-email="deletingCustomer?.email ?? ''"
    :customer-status="deletingCustomer?.status ?? ''"
    :customer-created-at="deletingCustomer?.createdAt ?? ''"
    @confirm="confirmDeleteCustomer"
  />

  <CustomerLocationModal
    v-model:open="isLocationModalOpen"
    :customer="locationCustomer"
    @save="saveCustomerLocation"
  />
</template>

<style scoped>
.customers-table .sort-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.customers-table .actions-column {
  width: 1%;
  white-space: nowrap;
  padding-right: 0;
}

@media (max-width: 767px) {
  .customers-table thead {
    display: block;
  }

  .customers-table thead tr {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .customers-table thead{
    border-bottom: 1px solid #d1d1d1;
    & th {
      width: auto;
      display: flex;
      align-items: center;
      border-bottom: 0;
      padding: 0;
    }
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
    padding: 0;
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
    width: 100%;
    & .cell-actions-content {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .customers-table td.cell-actions::before {
    display: block;
    margin-bottom: 0.35rem;
  }
}
</style>
