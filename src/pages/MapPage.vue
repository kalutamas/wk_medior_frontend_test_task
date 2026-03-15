<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { icon } from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useCustomers } from '@/composables/useCustomers'
import type { Customer, CustomerLocation } from '@/types/customer'
import 'leaflet/dist/leaflet.css'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

const { customers } = useCustomers()

// Csak akkor ad vissza true-t, ha az ügyfélnek véges, érvényes lat/lng koordinátái vannak.
const hasValidLocation = (
  customer: Customer,
): customer is Customer & { location: CustomerLocation } => {
  const location = customer.location

  return Boolean(
    location &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lng),
  )
}

const customersWithLocation = computed(() =>
  customers.value
    .filter(hasValidLocation)
    .map((customer) => {
      const location = customer.location

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        lat: location.lat,
        lng: location.lng,
      }
    }),
)

const mapCenter: [number, number] = [35, 20]
const mapZoom = 3
const singleMarkerZoom = 12
const mapRef = ref<LeafletMap | null>(null)

const markerOptions = icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Beállítja a térkép nézetét úgy, hogy az összes marker látható legyen.
// Egyetlen markernél setView-t, több markernél fitBounds-t használ.
const fitMapToMarkers = async () => {
  if (!mapRef.value || customersWithLocation.value.length === 0) {
    return
  }

  await nextTick()

  mapRef.value.invalidateSize(false)

  if (customersWithLocation.value.length === 1) {
    const customer = customersWithLocation.value[0]

    if (!customer) {
      return
    }

    mapRef.value.setView([customer.lat, customer.lng], singleMarkerZoom, {
      animate: false,
    })
    return
  }

  mapRef.value.fitBounds(
    customersWithLocation.value.map((customer) => [customer.lat, customer.lng]),
    {
      animate: false,
      paddingTopLeft: [56, 56],
      paddingBottomRight: [56, 56],
      maxZoom: mapZoom,
    },
  )
}

// @ready eseményből megkapja a térkép példányt és elvégzi a kezdeti illesztést.
const handleMapReady = async (map: LeafletMap) => {
  mapRef.value = map
  await fitMapToMarkers()
}

watch(customersWithLocation, async () => {
  await fitMapToMarkers()
})
</script>

<template>
  <section class="space-y-4">
    <header>
      <h2 class="text-2xl font-bold">Térkép</h2>
      <p class="text-sm text-base-content/70">Lokációval rendelkező ügyfelek térképes megjelenítése.</p>
    </header>

    <article class="card border border-base-300">
      <div class="card-body gap-4">
        <p v-if="customersWithLocation.length === 0" role="alert" class="alert alert-info">
          <InformationCircleIcon class="h-5 w-5" />
          Jelenleg nincs mentett lokációval rendelkező ügyfél.
        </p>
        <div class="h-[420px] overflow-hidden rounded-box border border-base-300 z-2">
          <LMap
            :zoom="mapZoom"
            :center="mapCenter"
            :use-global-leaflet="false"
            :options="{ zoomControl: true }"
            @ready="handleMapReady"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
              attribution="&copy; OpenStreetMap contributors"
            />

            <LMarker
              v-for="customer in customersWithLocation"
              :key="customer.id"
              :lat-lng="[customer.lat, customer.lng]"
              :icon="markerOptions"
            >
              <LPopup>
                <div class="flex flex-col gap-1">
                  <p class="font-semibold">{{ customer.name }}</p>
                  <p class="text-xs">{{ customer.email }}</p>
                </div>
              </LPopup>
            </LMarker>
          </LMap>
        </div>
      </div>
    </article>
  </section>
</template>
<style scoped>
:deep(.leaflet-popup-content p) {
  margin: 0;
}
</style>