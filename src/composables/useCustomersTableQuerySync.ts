import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Ref } from 'vue'
import type { SortDirection, SortField } from '@/composables/useCustomersTableState'

type UseCustomersTableQuerySyncParams = {
  rowsPerPageOptions: number[]
  rowsPerPage: Ref<number>
  currentPage: Ref<number>
  sortField: Ref<SortField>
  sortDirection: Ref<SortDirection>
  totalPages: Ref<number>
}

export const useCustomersTableQuerySync = ({
  rowsPerPageOptions,
  rowsPerPage,
  currentPage,
  sortField,
  sortDirection,
  totalPages,
}: UseCustomersTableQuerySyncParams) => {
  const route = useRoute()
  const router = useRouter()
  const isApplyingRouteState = ref(false)

  // perPage query param validálása; érvénytelen → 10.
  const normalizeRowsPerPage = (value: unknown) => {
    const parsed = Number(value)
    return rowsPerPageOptions.includes(parsed) ? parsed : 10
  }

  // page query param validálása; érvénytelen → 1.
  const normalizeCurrentPage = (value: unknown) => {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed < 1) return 1
    return parsed
  }

  // sortBy query param validálása; érvénytelen → 'createdAt'.
  const normalizeSortField = (value: unknown): SortField => {
    return value === 'name' || value === 'createdAt' ? value : 'createdAt'
  }

  // sortDir query param validálása; érvénytelen → 'desc'.
  const normalizeSortDirection = (value: unknown): SortDirection => {
    return value === 'asc' || value === 'desc' ? value : 'desc'
  }

  // URL query paramétereket alkalmazza a táblázat állapotra; isApplyingRouteState jelzővel végtelen ciklust kerül el.
  const syncStateFromRoute = () => {
    isApplyingRouteState.value = true

    rowsPerPage.value = normalizeRowsPerPage(route.query.perPage)
    currentPage.value = normalizeCurrentPage(route.query.page)
    sortField.value = normalizeSortField(route.query.sortBy)
    sortDirection.value = normalizeSortDirection(route.query.sortDir)

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }

    isApplyingRouteState.value = false
  }

  // Táblázat állapotát URL query paraméterbe írja; változatlan vagy folyamatban lévő szinkron esetén kihagyja.
  const syncRouteFromState = async () => {
    if (isApplyingRouteState.value) return

    const nextQuery = {
      ...route.query,
      sortBy: sortField.value,
      sortDir: sortDirection.value,
      perPage: String(rowsPerPage.value),
      page: String(currentPage.value),
    }

    const hasChanged =
      route.query.sortBy !== nextQuery.sortBy ||
      route.query.sortDir !== nextQuery.sortDir ||
      route.query.perPage !== nextQuery.perPage ||
      route.query.page !== nextQuery.page

    if (!hasChanged) return

    await router.replace({ query: nextQuery })
  }

  syncStateFromRoute()

  watch(
    () => route.query,
    () => {
      syncStateFromRoute()
    },
  )

  watch([rowsPerPage, currentPage, sortField, sortDirection], async () => {
    await syncRouteFromState()
  })

  watch(totalPages, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }

    void syncRouteFromState()
  })

  return {
    isApplyingRouteState,
    syncRouteFromState,
  }
}
