<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { Customer, CustomerLocation } from '@/types/customer'

const props = defineProps<{
  open: boolean
  customer: Customer | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [location: CustomerLocation | undefined]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const form = ref({
  lat: '',
  lng: '',
  address: '',
})
const formErrors = ref({
  lat: '',
  lng: '',
  address: '',
})

const resetErrors = () => {
  formErrors.value = {
    lat: '',
    lng: '',
    address: '',
  }
}

const fillFromCustomer = (customer: Customer | null) => {
  if (!customer?.location) {
    form.value = {
      lat: '',
      lng: '',
      address: '',
    }
    resetErrors()
    return
  }

  form.value = {
    lat: String(customer.location.lat),
    lng: String(customer.location.lng),
    address: customer.location.address ?? '',
  }
  resetErrors()
}

const close = () => {
  dialogRef.value?.close()
}

const syncDialogState = async (open: boolean) => {
  await nextTick()

  const dialog = dialogRef.value
  if (!dialog) return

  if (open) {
    if (!dialog.open) dialog.showModal()
    return
  }

  if (dialog.open) dialog.close()
}

const validate = () => {
  const nextErrors = {
    lat: '',
    lng: '',
    address: '',
  }

  const latRaw = String(form.value.lat ?? '').trim().replace(/,/g, '.')
  const lngRaw = String(form.value.lng ?? '').trim().replace(/,/g, '.')
  const addressRaw = form.value.address.trim()

  form.value.lat = latRaw
  form.value.lng = lngRaw

  const hasLat = latRaw.length > 0
  const hasLng = lngRaw.length > 0
  const hasAddress = addressRaw.length > 0

  if (hasLat !== hasLng) {
    if (!hasLat) nextErrors.lat = 'A szélességi koordináta kötelező, ha a hosszúság meg van adva.'
    if (!hasLng) nextErrors.lng = 'A hosszúsági koordináta kötelező, ha a szélesség meg van adva.'
  }

  const latParsed = hasLat ? Number(latRaw) : null
  const lngParsed = hasLng ? Number(lngRaw) : null

  if (hasLat && (latParsed === null || Number.isNaN(latParsed) || latParsed < -90 || latParsed > 90)) {
    nextErrors.lat = 'A szélesség értéke -90 és 90 között legyen.'
  }

  if (hasLng && (lngParsed === null || Number.isNaN(lngParsed) || lngParsed < -180 || lngParsed > 180)) {
    nextErrors.lng = 'A hosszúság értéke -180 és 180 között legyen.'
  }

  if (hasAddress && (!hasLat || !hasLng)) {
    nextErrors.address = 'Cím csak koordinátákkal együtt adható meg.'
  }

  formErrors.value = nextErrors

  const hasAnyError = Boolean(nextErrors.lat || nextErrors.lng || nextErrors.address)
  return {
    isValid: !hasAnyError,
    location:
      hasLat && hasLng && !hasAnyError
        ? {
            lat: latParsed as number,
            lng: lngParsed as number,
            ...(addressRaw ? { address: addressRaw } : {}),
          }
        : undefined,
  }
}

const submit = () => {
  const result = validate()
  if (!result.isValid) return

  emit('save', result.location)
  close()
}

watch(
  () => props.open,
  async (open) => {
    await syncDialogState(open)
  },
  { immediate: true, flush: 'post' },
)

watch(
  () => [props.open, props.customer] as const,
  ([open, customer]) => {
    if (!open) return
    fillFromCustomer(customer)
  },
  { immediate: true },
)

</script>

<template>
  <dialog ref="dialogRef" class="modal" @close="emit('update:open', false)">
    <div class="modal-box w-11/12 max-w-lg">
      <h3 class="text-lg font-semibold">Lokáció beállítása</h3>
      <p class="mt-2 text-sm text-base-content/70">
        Add meg az ügyfél koordinátáit. Üres mentéssel a korábbi lokáció törlődik.
      </p>

      <form class="mt-4 space-y-3" @submit.prevent="submit">
        <div>
          <label class="label" for="location-lat">
            <span class="label-text">Szélesség (lat)</span>
          </label>
          <input id="location-lat" v-model="form.lat" type="number" step="any" min="-90" max="90" class="input input-bordered w-full" placeholder="pl. 47.4979">
          <p v-if="formErrors.lat" class="mt-1 text-xs text-error">{{ formErrors.lat }}</p>
        </div>

        <div>
          <label class="label" for="location-lng">
            <span class="label-text">Hosszúság (lng)</span>
          </label>
          <input id="location-lng" v-model="form.lng" type="number" step="any" min="-180" max="180" class="input input-bordered w-full" placeholder="pl. 19.0402">
          <p v-if="formErrors.lng" class="mt-1 text-xs text-error">{{ formErrors.lng }}</p>
        </div>

        <div>
          <label class="label" for="location-address">
            <span class="label-text">Cím (opcionális)</span>
          </label>
          <input id="location-address" v-model="form.address" type="text" class="input input-bordered w-full" placeholder="pl. Budapest, Vaci utca 1.">
          <p v-if="formErrors.address" class="mt-1 text-xs text-error">{{ formErrors.address }}</p>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost" @click="close">Mégse</button>
          <button type="submit" class="btn btn-primary">Mentés</button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button aria-label="Bezárás">Bezárás</button>
    </form>
  </dialog>
</template>
