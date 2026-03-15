<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { Customer, CustomerStatus, CustomerUpsertPayload } from '@/types/customer'

const props = defineProps<{
  open: boolean
  customer: Customer | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: CustomerUpsertPayload]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const form = ref({
  name: '',
  email: '',
  status: 'active' as CustomerStatus,
  tagsInput: '',
})
const formErrors = ref({
  name: '',
  email: '',
})

// Az űrlap mezőit és hibáit alapértelmezettre állítja.
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    status: 'active',
    tagsInput: '',
  }
  formErrors.value = {
    name: '',
    email: '',
  }
}

// Szerkesztendő ügyfél adataival tölti fel az űrlapot.
const fillFormFromCustomer = (customer: Customer) => {
  form.value = {
    name: customer.name,
    email: customer.email,
    status: customer.status,
    tagsInput: customer.tags.join(', '),
  }
  formErrors.value = {
    name: '',
    email: '',
  }
}

// Vesszős címke stringet egyedi, tisztított tömbbé alakít.
const parseTags = (rawTags: string) => {
  return Array.from(
    new Set(
      rawTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )
}

// Kötelező mezőket ellenőrzi és beállítja a hibaüzeneteket.
const validateForm = () => {
  const nextErrors = {
    name: '',
    email: '',
  }

  const trimmedName = form.value.name.trim()
  const trimmedEmail = form.value.email.trim()

  if (!trimmedName) {
    nextErrors.name = 'A név megadása kötelező.'
  } else if (trimmedName.length < 3) {
    nextErrors.name = 'A név legalább 3 karakter legyen.'
  }

  if (!trimmedEmail) {
    nextErrors.email = 'Az email cím megadása kötelező.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = 'Adj meg érvényes email címet.'
  }

  formErrors.value = nextErrors
  return !nextErrors.name && !nextErrors.email
}

// Bezárja a natív <dialog> elemet.
const close = () => {
  dialogRef.value?.close()
}

// Imperatív módon megjeleníti vagy elrejti a natív <dialog> elemet az open prop alapján.
// Megvárja a következő DOM-ticketet, hogy az elem biztosan csatolva legyen.
const syncDialogState = async (open: boolean) => {
  await nextTick()

  const dialog = dialogRef.value
  if (!dialog) return

  if (open) {
    if (!dialog.open) {
      dialog.showModal()
    }
    return
  }

  if (dialog.open) {
    dialog.close()
  }
}

// Validál, siker esetén save eseményt küld és zárja a dialógust.
const submitForm = () => {
  if (!validateForm()) return

  emit('save', {
    id: props.customer?.id,
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    status: form.value.status,
    tags: parseTags(form.value.tagsInput),
  })

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

    if (customer) {
      fillFormFromCustomer(customer)
      return
    }

    resetForm()
  },
  { immediate: true },
)

onMounted(async () => {
  await syncDialogState(props.open)
})
</script>

<template>
  <dialog ref="dialogRef" class="modal" @close="emit('update:open', false)">
    <div class="modal-box w-11/12 max-w-lg">
      <h3 class="text-lg font-semibold">{{ customer ? 'Ügyfél szerkesztése' : 'Új ügyfél létrehozása' }}</h3>
      <h4 class="text-sm text-gray-600">{{ customer ? 'Az adatok szerkesztésével módosíthatja az ügyfél adatait.' : 'Az adatok megadásával létrehozhat egy új ügyfelet.' }}</h4>

      <form class="mt-4 space-y-3" @submit.prevent="submitForm">
        <div>
          <label class="label text-sm text-gray-600" for="customer-name">
            <span class="label-text">Név</span>
          </label>
          <input id="customer-name" v-model="form.name" type="text" class="input input-bordered w-full" placeholder="Pl. Kovacs Adam">
          <p v-if="formErrors.name" class="mt-1 text-xs text-error">{{ formErrors.name }}</p>
        </div>

        <div>
          <label class="label text-sm text-gray-600" for="customer-email">
            <span class="label-text">Email cím</span>
          </label>
          <input id="customer-email" v-model="form.email" type="email" class="input input-bordered w-full" placeholder="pelda@email.hu">
          <p v-if="formErrors.email" class="mt-1 text-xs text-error">{{ formErrors.email }}</p>
        </div>

        <div>
          <label class="label text-sm text-gray-600" for="customer-status">
            <span class="label-text">Státusz</span>
          </label>
          <select id="customer-status" v-model="form.status" class="select select-bordered w-full">
            <option value="active">Aktív</option>
            <option value="inactive">Inaktív</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label class="label text-sm text-gray-600" for="customer-tags">
            <span class="label-text">Címkék</span>
          </label>
          <input id="customer-tags" v-model="form.tagsInput" type="text" class="input input-bordered w-full" placeholder="premium, b2b">
          <p class="mt-1 text-xs text-base-content/60">Vesszővel elválasztva add meg a címkéket.</p>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost" @click="close">Mégse</button>
          <button type="submit" class="btn btn-primary">{{ customer ? 'Mentés' : 'Létrehozás' }}</button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button aria-label="Bezárás">Bezárás</button>
    </form>
  </dialog>
</template>
