import { createRouter, createWebHistory } from 'vue-router'

const baseTitle = 'Ügyfél Admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      children: [
        { path: '', redirect: '/ugyfelek' },
        {
          path: 'ugyfelek',
          name: 'customers',
          component: () => import('@/pages/CustomersPage.vue'),
          meta: { title: 'Ügyfelek' },
        },
        {
          path: 'terkep',
          name: 'map',
          component: () => import('@/pages/MapPage.vue'),
          meta: { title: 'Térkép' },
        },
      ],
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = pageTitle ? `${baseTitle} - ${pageTitle}` : baseTitle
})

export default router
