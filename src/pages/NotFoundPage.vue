<template>
  <main class="grid min-h-screen place-items-center bg-base-200 px-6">
    <section class="w-full max-w-xl rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-sm">
      <p class="text-sm font-semibold tracking-wide text-primary">404</p>
      <h1 class="mt-2 text-3xl font-bold">Az oldal nem található</h1>
      <p class="mt-3 text-sm text-base-content/70">
        A keresett útvonal nem létezik vagy már nem érhető el.
      </p>

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <RouterLink to="/ugyfelek" class="btn btn-primary">Vissza az ügyfelekhez</RouterLink>
        <RouterLink to="/terkep" class="btn btn-outline">Ugrás a térképre</RouterLink>
      </div>
    </section>
  </main>
</template>
