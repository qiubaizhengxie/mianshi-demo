import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Huanxin',
      component: () => import('@/components/Huanxin.vue')
    }
  ],
})

export default router
