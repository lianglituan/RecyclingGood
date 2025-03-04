import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/phone-purchase',
      name: 'PhonePurchase',
      component: () => import('../views/PhonePurchase.vue'),
      meta: { title: '手机收购管理' }
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('../views/Inventory.vue'),
      meta: { title: '库存管理' }
    },
    {
      path: '/sales',
      name: 'Sales',
      component: () => import('../views/Sales.vue'),
      meta: { title: '销售管理' }
    },
    {
      path: '/finance',
      name: 'Finance',
      component: () => import('../views/Finance.vue'),
      meta: { title: '资金流水' }
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue'),
      meta: { title: '用户管理' }
    },
    {
      path: '/',
      redirect: '/phone-purchase'
    }
  ]
})

export default router