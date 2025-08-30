import { type RouteRecordRaw } from 'vue-router'
import AccountsView from '../views/AccountsView.vue'

export const accountsRoute: RouteRecordRaw = {
  path: '/accounts',
  name: 'Accounts',
  meta: { requiresAuth: true },
  component: AccountsView,
  children: []
}
