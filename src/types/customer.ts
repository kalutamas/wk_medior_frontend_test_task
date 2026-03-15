export type CustomerStatus = 'active' | 'inactive' | 'lead'

export interface CustomerLocation {
  lat: number
  lng: number
  address?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  status: CustomerStatus
  tags: string[]
  createdAt: string
  location?: CustomerLocation
}

export type CustomerUpsertPayload = Omit<Customer, 'id' | 'createdAt'> & {
  id?: string
}
