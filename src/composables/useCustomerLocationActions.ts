import { ref, watch } from 'vue'
import type { Customer, CustomerLocation, CustomerUpsertPayload } from '@/types/customer'

type UpdateCustomer = (id: string, payload: Omit<CustomerUpsertPayload, 'id'>) => void

export const useCustomerLocationActions = (updateCustomer: UpdateCustomer) => {
  const isLocationModalOpen = ref(false)
  const locationCustomer = ref<Customer | null>(null)

  watch(isLocationModalOpen, (open) => {
    if (!open) {
      locationCustomer.value = null
    }
  })

  const openLocationModal = (customer: Customer) => {
    locationCustomer.value = customer
    isLocationModalOpen.value = true
  }

  const saveCustomerLocation = (location: CustomerLocation | undefined) => {
    const customer = locationCustomer.value
    if (!customer) return

    updateCustomer(customer.id, {
      name: customer.name,
      email: customer.email,
      status: customer.status,
      tags: customer.tags,
      location,
    })

    isLocationModalOpen.value = false
    locationCustomer.value = null
  }

  return {
    isLocationModalOpen,
    locationCustomer,
    openLocationModal,
    saveCustomerLocation,
  }
}
