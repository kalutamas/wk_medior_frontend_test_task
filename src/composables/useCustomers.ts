import { ref } from 'vue'
import type { Customer, CustomerStatus } from '@/types/customer'

const STORAGE_KEY = 'senior-fe-test.customers.v1'

const defaultCustomers: Customer[] = [
  {
    id: 'cst-001',
    name: 'Kovács Ádám',
    email: 'adam@example.com',
    status: 'active',
    tags: ['premium', 'b2b'],
    createdAt: '2026-03-10T09:30:00.000Z',
  },
  {
    id: 'cst-002',
    name: 'Nagy Éva',
    email: 'eva@example.com',
    status: 'inactive',
    tags: ['trial'],
    createdAt: '2026-03-08T11:00:00.000Z',
  },
  {
    id: 'cst-003',
    name: 'Szabó Péter',
    email: 'peter@example.com',
    status: 'lead',
    tags: ['inbound'],
    createdAt: '2026-03-06T14:10:00.000Z',
  },
]

const customers = ref<Customer[]>([])
let initialized = false

const normalizeStatus = (value: unknown): CustomerStatus => {
  if (value === 'active' || value === 'inactive' || value === 'lead') {
    return value
  }

  return 'lead'
}

const isCustomer = (value: unknown): value is Customer => {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<Customer>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    Array.isArray(candidate.tags) &&
    typeof candidate.createdAt === 'string'
  )
}

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers.value))
}

const loadFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    customers.value = [...defaultCustomers]
    saveToStorage()
    return
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      customers.value = [...defaultCustomers]
      saveToStorage()
      return
    }

    customers.value = parsed.filter(isCustomer).map((customer) => ({
      ...customer,
      status: normalizeStatus(customer.status),
      tags: customer.tags.filter((tag) => typeof tag === 'string'),
    }))
  } catch {
    customers.value = [...defaultCustomers]
    saveToStorage()
  }
}

const ensureInitialized = () => {
  if (initialized || typeof window === 'undefined') return

  loadFromStorage()
  initialized = true
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `customer-${Date.now()}-${Math.round(Math.random() * 10000)}`
}

export const useCustomers = () => {
  ensureInitialized()

  const createCustomer = (payload: Omit<Customer, 'id' | 'createdAt'>) => {
    customers.value.unshift({
      ...payload,
      id: generateId(),
      createdAt: new Date().toISOString(),
    })
    saveToStorage()
  }

  const updateCustomer = (id: string, payload: Omit<Customer, 'id' | 'createdAt'>) => {
    const index = customers.value.findIndex((customer) => customer.id === id)
    if (index === -1) return

    const current = customers.value[index]
    if (!current) return

    customers.value[index] = {
      ...current,
      ...payload,
      id: current.id,
      createdAt: current.createdAt,
    }
    saveToStorage()
  }

  const removeCustomer = (id: string) => {
    customers.value = customers.value.filter((customer) => customer.id !== id)
    saveToStorage()
  }

  return {
    customers,
    createCustomer,
    updateCustomer,
    removeCustomer,
  }
}
