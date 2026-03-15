<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { CustomerStatus } from '@/types/customer'

const props = defineProps<{
  open: boolean
  customerName: string
  customerEmail: string
  customerStatus: CustomerStatus | ''
  customerCreatedAt: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

// Bezárja a natív <dialog> elemet.
const close = () => {
  dialogRef.value?.close()
}

// Imperatív módon megjeleníti vagy elrejti a natív <dialog> elemet az open prop alapján.
// Megvárja a következő DOM-ticket, hogy az elem biztosan csatolva legyen.
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

// confirm eseményt küld a szülőnek és zárja a dialógust.
const confirmDelete = () => {
  emit('confirm')
  close()
}

// A státuszkulcsot magyar feliratra fordítja.
const statusLabel = (status: CustomerStatus | '') => {
  if (status === 'active') return 'Aktiv'
  if (status === 'inactive') return 'Inaktiv'
  if (status === 'lead') return 'Lead'
  return '-'
}

// ISO dátumot magyar formátumra alakítja.
const formatDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('hu-HU')
}

watch(
  () => props.open,
  async (open) => {
    await syncDialogState(open)
  },
  { immediate: true, flush: 'post' },
)

onMounted(async () => {
  await syncDialogState(props.open)
})
</script>

<template>
  <dialog ref="dialogRef" class="modal" @close="emit('update:open', false)">
    <div class="modal-box w-11/12 max-w-md">
      <h3 class="text-lg font-semibold">Ügyfél törlése</h3>
      <p class="mt-2 text-sm text-base-content/70">Biztosan törölni szeretnéd a következő ügyfelet?</p>

      <div class="mt-4 rounded-box border border-base-300 bg-base-100 p-4">
        <div class="grid grid-cols-[7.5rem_1fr] items-start gap-x-3 gap-y-2 text-sm">
          <p class="text-base-content/60">Név:</p>
          <p class="font-medium break-words">{{ customerName || '-' }}</p>

          <p class="text-base-content/60">Email:</p>
          <p class="break-words">{{ customerEmail || '-' }}</p>

          <p class="text-base-content/60">Státusz:</p>
          <p>{{ statusLabel(customerStatus) }}</p>

          <p class="text-base-content/60">Létrehozva:</p>
          <p>{{ formatDate(customerCreatedAt) }}</p>
        </div>
      </div>

      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="close">Mégse</button>
        <button type="button" class="btn btn-primary" @click="confirmDelete">Igen</button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button aria-label="Bezárás">Bezárás</button>
    </form>
  </dialog>
</template>
