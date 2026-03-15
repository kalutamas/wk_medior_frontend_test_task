import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { Customer } from '@/types/customer'

export type SortField = 'name' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export const useCustomersTableState = (customers: Ref<Customer[]>) => {
  const rowsPerPageOptions = [10, 25, 50]
  const rowsPerPage = ref(10)
  const currentPage = ref(1)
  const sortField = ref<SortField>('createdAt')
  const sortDirection = ref<SortDirection>('desc')

  const totalPages = computed(() => Math.max(1, Math.ceil(customers.value.length / rowsPerPage.value)))
  const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

  const sortedCustomers = computed(() => {
    return [...customers.value].sort((left, right) => {
      if (sortField.value === 'name') {
        const comparison = left.name.localeCompare(right.name, 'hu', { sensitivity: 'base' })
        return sortDirection.value === 'asc' ? comparison : -comparison
      }

      const leftTime = new Date(left.createdAt).getTime()
      const rightTime = new Date(right.createdAt).getTime()
      const comparison = leftTime - rightTime
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  })

  const pagedCustomers = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value
    return sortedCustomers.value.slice(start, start + rowsPerPage.value)
  })

  // Rendezési mező és irány váltása.
  const toggleSort = (field: SortField) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = field === 'name' ? 'asc' : 'desc'
    }

    currentPage.value = 1
  }

  // Rendezési irányt jelző nyíl az adott oszlophoz.
  const getSortIndicator = (field: SortField) => {
    if (sortField.value !== field) return '↕'
    return sortDirection.value === 'asc' ? '↑' : '↓'
  }

  // Előző oldalra lép, ha nem az elsőn van.
  const goToPreviousPage = () => {
    if (currentPage.value <= 1) return
    currentPage.value -= 1
  }

  // Következő oldalra lép, ha nem az utolsón van.
  const goToNextPage = () => {
    if (currentPage.value >= totalPages.value) return
    currentPage.value += 1
  }

  return {
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
  }
}
