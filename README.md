# Ügyfél Admin

Egy Vue 3 + TypeScript alapú SPA, amely ügyfélnyilvántartást valósít meg: listanézet (CRUD), helymeghatározás és interaktív térkép.

---

## Tartalomjegyzék

- [Funkciók](#funkciók)
- [Technológiai stack](#technológiai-stack)
- [Projekt struktúra](#projekt-struktúra)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Elérhető parancsok](#elérhető-parancsok)
- [Oldalak](#oldalak)
- [Komponensek](#komponensek)
- [Composable-ök](#composable-ök)
- [Adattípusok](#adattípusok)
- [Adattárolás](#adattárolás)
- [Routing](#routing)

---

## Funkciók

- **Ügyfél lista** – lapozható, rendezhető táblázat az összes ügyféllel
- **CRUD műveletek** – ügyfél létrehozása, szerkesztése és törlése modális ablakokon keresztül
- **Helymeghatározás** – minden ügyfélhez GPS koordináta (lat/lng) és opcionális cím rendelhető
- **Interaktív térkép** – az összes lokációval rendelkező ügyfél megjelenik egy Leaflet térképen, betöltéskor automatikusan az összes marker látható a nézetben
- **URL szinkron** – a táblázat aktuális lapozás és rendezési állapota az URL query paraméterekben tárolódik
- **Állapot-megőrzés** – az adatok `localStorage`-ban maradnak oldalbetöltések között is
- **Reszponzív** – mobilon hamburger-menüs oldalsáv, dekstopoon fix navigáció

---

## Technológiai stack

| Csomag | Verzió | Szerep |
|---|---|---|
| [Vue 3](https://vuejs.org/) | ^3.5 | Keretrendszer (`<script setup>` Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9 | Statikus típusrendszer |
| [Vite](https://vitejs.dev/) | ^7.3 | Build eszköz és fejlesztői szerver |
| [Vue Router](https://router.vuejs.org/) | ^5.0 | Kliensoldali routing |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.2 | Utility-first CSS keretrendszer |
| [DaisyUI](https://daisyui.com/) | ^5.5 | Tailwind-alapú UI komponens könyvtár |
| [@vue-leaflet/vue-leaflet](https://vue-leaflet.github.io/vue-leaflet/) | ^0.10 | Vue 3 Leaflet wrapper (térkép komponensek) |
| [Leaflet](https://leafletjs.com/) | ^1.9 | Térkép motor (icon, CSS, alap API) |
| [@heroicons/vue](https://heroicons.com/) | ^2.2 | SVG ikon könyvtár |
| [Sass](https://sass-lang.com/) | ^1.97 | SCSS stílusfájlok fordítása |

---

## Projekt struktúra

```
src/
├── main.ts                        # App belépési pont, Vue app inicializálása
├── App.vue                        # Gyökér komponens (RouterView)
│
├── types/
│   └── customer.ts                # Customer, CustomerLocation, CustomerStatus típusok
│
├── router/
│   └── index.ts                   # Route definíciók, oldalcím szinkron
│
├── layouts/
│   └── DashboardLayout.vue        # Fő elrendezés: topbar + sidebar + RouterView
│
├── pages/
│   ├── CustomersPage.vue          # Ügyfelek oldal (Customers Table)
│   └── MapPage.vue                # Térkép oldal (Leaflet térkép)
│
├── components/
│   ├── layout/
│   │   ├── AppSidebar.vue         # Navigációs oldalsáv (router linkek)
│   │   └── AppTopbar.vue          # Fejléc sáv (cím, hamburger gomb)
│   └── customers/
│       ├── CustomersTable.vue     # Főtáblázat: lapozás, rendezés, műveletek
│       ├── CustomerFormModal.vue  # Létrehozás / szerkesztés modal
│       ├── CustomerDeleteModal.vue # Törlés megerősítő modal
│       ├── CustomerLocationModal.vue # GPS koordináta szerkesztő modal
│       └── CustomerStats.vue      # Összesítő statisztika kártyák
│
├── composables/
│   ├── useCustomers.ts            # Ügyfél CRUD + localStorage kezelés
│   ├── useCustomersTableState.ts  # Táblázat rendezés, lapozás állapot
│   ├── useCustomersTableQuerySync.ts # Táblázat állapot ↔ URL query sync
│   └── useCustomerLocationActions.ts # Helymeghatározás modal logika
│
└── styles/
    ├── main.scss                  # Globális stílusok
    └── tailwind.css               # Tailwind direktívák
```

---

## Telepítés és futtatás

**Eszközök**: Node.js `^20.19.0` vagy `>=22.12.0`, npm

### 1. Függőségek telepítése

```sh
npm install
```

### 2. Fejlesztői szerver indítása

```sh
npm run dev
```

Az alkalmazás alapértelmezetten a `http://localhost:5173` címen érhető el.

---

## Elérhető parancsok

| Parancs | Leírás |
|---|---|
| `npm run dev` | Fejlesztői szerver indítása Vite-tal (HMR) |
| `npm run build` | Produkciós build + TypeScript typeck futtatása |
| `npm run type-check` | TypeScript hibák ellenőrzése `vue-tsc`-vel |

---

## Oldalak

### `/ugyfelek` – Ügyfelek

A fő adminisztrációs oldal. Tartalmazza:
- az ügyféllistát megjelenítő `CustomersTable` komponenst
- összesítő statisztikákat (`CustomerStats`)

**URL query paraméterek** (automatikusan szinkronizálva):

| Paraméter | Leírás | Lehetséges értékek |
|---|---|---|
| `sortBy` | Rendezési mező | `name`, `createdAt` |
| `sortDir` | Rendezés iránya | `asc`, `desc` |
| `perPage` | Sorok száma oldalanként | `10`, `25`, `50` |
| `page` | Aktuális oldal | pozitív egész szám |

### `/terkep` – Térkép

Interaktív Leaflet térkép OpenStreetMap tile réteggel. Az összes GPS koordinátával rendelkező ügyfelet markerrel jelöli. Betöltéskor a nézet automatikusan az összes markert befoglaló területre zoomol. Markerre kattintva popup jelenik meg az ügyfél nevével és email-jével.

---

## Komponensek

### `CustomersTable`

A legösszetettebb komponens. Felelősségei:
- megjeleníti a szortírozott, lapozott ügyféllistát
- kezeli az összes CRUD modal nyitását/zárását
- koordinálja a `useCustomersTableState`, `useCustomersTableQuerySync` és `useCustomerLocationActions` composable-öket

### `CustomerFormModal`

Létrehozás és szerkesztés közös modal formja. Validálja a nevet és az email formátumát. Szerkesztés esetén az aktuális ügyfél adataival előtölti a mezőket.

### `CustomerDeleteModal`

Törlés megerősítő dialog. Visszaadja az eseményt a szülőnek, a tényleges törlést a szülő végzi.

### `CustomerLocationModal`

GPS koordináta és cím szerkesztő. Meglévő lokáció esetén előtölti a mezőket, a koordináta törölhető is (a megnevezett ügyfélhez nincs több lokáció mentve).

### `CustomerStats`

Csak megjelenítési logikával rendelkező komponens: összesíti és megjeleníti az aktív, inaktív és lead státuszú ügyfelek számát.

### `DashboardLayout`

Az összes belső oldal keretét adja. Tartalmaz egy rögzített `AppTopbar`-t és egy reszponzív `AppSidebar`-t. Mobilon az oldalsáv overlay-ként, drawer animációval jelenik meg.

---

## Composable-ök

### `useCustomers`

**Felelősség**: az ügyfél-adat réteg teljes kezelése.

- Szinguleton `ref<Customer[]>` – minden összetevő ugyanazt a reaktív tömböt látja
- Első híváskor betölt a `localStorage`-ból; üres tárhely esetén 3 default ügyféllel indul
- Validálja és normalizálja a tárolt JSON-t (védelem sérült vagy idegen adatszerkezet ellen)
- Kiteszi: `customers`, `createCustomer`, `updateCustomer`, `removeCustomer`

### `useCustomersTableState`

**Felelősség**: a táblázat UI állapotának számítása.

- Rendezés: `sortField` (`name` | `createdAt`) és `sortDirection` (`asc` | `desc`)
- Lapozás: `currentPage`, `rowsPerPage`, `totalPages`, `pageNumbers`
- Computált `sortedCustomers` (magyar lokalizált összehasonlítással) és `pagedCustomers`
- `toggleSort(field)`: mezőváltáskor alapértelmezett irányt állít be

### `useCustomersTableQuerySync`

**Felelősség**: az URL query paraméterek és a táblázat állapotának kétirányú szinkronizálása.

- Route változáskor normalizált értékeket tölt be az állapotba
- Állapot változáskor `router.replace`-szel frissíti az URL-t (push nélkül, hogy a history ne teljen meg)
- `isApplyingRouteState` flag megakadályozza a végtelen hurkot

### `useCustomerLocationActions`

**Felelősség**: a helymeghatározás modal életciklusa.

- `openLocationModal(customer)`: beállítja a szerkesztendő ügyfelet és megnyitja a modalt
- `saveCustomerLocation(location)`: meghívja az `updateCustomer`-t, majd zárja a modalt
- `isLocationModalOpen` bezárásakor automatikusan nullázza a `locationCustomer`-t

---

## Adattípusok

```ts
// Ügyfél státusz
type CustomerStatus = 'active' | 'inactive' | 'lead'

// GPS koordináta + opcionális cím
interface CustomerLocation {
  lat: number
  lng: number
  address?: string
}

// Ügyfél entitás
interface Customer {
  id: string           // UUID (crypto.randomUUID vagy fallback)
  name: string
  email: string
  status: CustomerStatus
  tags: string[]       // vesszővel elválasztott szabad címkék
  createdAt: string    // ISO 8601 timestamp
  location?: CustomerLocation
}
```

---

## Adattárolás

Az alkalmazás kizárólag a böngésző `localStorage`-ját használja, nincs backend vagy API.

- **Kulcs**: `senior-fe-test.customers.v1`
- **Formátum**: `JSON.stringify(Customer[])`
- A betöltés során minden rekord validálva és normalizálva van, hogy sérült adat ne okozzon futásidejű hibát
- Az adatok böngészőbezárás és újratöltés után is megmaradnak

---

## Routing

| Útvonal | Oldal | Leírás |
|---|---|---|
| `/` | – | Átirányít `/ugyfelek`-re |
| `/ugyfelek` | `CustomersPage` | Ügyfél lista és CRUD |
| `/terkep` | `MapPage` | Lokáció térkép |
| `/:pathMatch(.*)` | `NotFoundPage` | 404 oldal |