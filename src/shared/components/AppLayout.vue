<script lang="ts" setup>
import { ref, watch } from 'vue';
import SidebarLeftComponent from './sidebar/SidebarLeftComponent.vue';
import SidebarTopComponent from './sidebar/SidebarTopComponent.vue';
import type { User } from '@supabase/supabase-js';
import type { Account } from '@/modules/accounts/models/Account';

defineProps<{
  user: User,
  account: Account
}>()

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const isSidebarMobileOpen = ref(false)


</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Sidebar -->
    <SidebarLeftComponent
    :account="account"
    :is-sidebar-open="isSidebarOpen" 
    @update:isSidebarOpen="(event) => isSidebarMobileOpen = event"

    />
    
    <!-- Main Content -->
    <div
      :class="[
        'transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'lg:ml-72' : 'ml-0',
        isMobileMenuOpen ? 'h-screen overflow-hidden' : '',
      ]"
    >
      <!-- Top Navigation -->
      <SidebarTopComponent 
      :is-sidebar-open="isSidebarOpen" 
      :is-mobile-menu-open="isMobileMenuOpen"
      @update:isSidebarOpen="(event) => isSidebarOpen = event"
      @update:isMobileMenuOpen="(event) => isMobileMenuOpen = event"
      />

      <!-- Page Content -->
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
            <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>
<style>
.glass-effect {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
