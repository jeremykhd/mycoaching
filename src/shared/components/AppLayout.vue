<script lang="ts" setup>
import { ref, watch } from 'vue';
import SidebarLeftComponent from './sidebar/SidebarLeftComponent.vue';
import SidebarTopComponent from './sidebar/SidebarTopComponent.vue';
import type { User } from '@supabase/supabase-js';
import type { Account } from '@/modules/accounts/models/Account';
import { useDeviceIsMobile } from '../composables/useDeviceIsMobile';
import MenuBottomComponent from './menu/MenuBottomComponent.vue';

defineProps<{
  user: User,
  account: Account
}>()

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const { isMobile } = useDeviceIsMobile()

</script>

<template>
  <div class="h-screen overflow-y-scroll bg-white">
    <!-- Sidebar -->
    <SidebarLeftComponent
    :account="account"
    :is-sidebar-open="isSidebarOpen"
    />
    
    <!-- Main Content -->
    <div
      :class="[
        'relative transition-all duration-300 ease-in-out h-screen overflow-hidden',
        isSidebarOpen ? 'lg:ml-72' : 'ml-0',
        isMobileMenuOpen ? 'h-screen overflow-hidden' : '',
      ]"
    >
      <!-- Top Navigation -->
      <SidebarTopComponent 
      v-if="!isMobile"
      :is-sidebar-open="isSidebarOpen" 
      :is-mobile-menu-open="isMobileMenuOpen"
      @update:isSidebarOpen="(event) => isSidebarOpen = event"
      @update:isMobileMenuOpen="(event) => isMobileMenuOpen = event"
      />


      <!-- Page Content -->
      <main class="py-10 pb-32 relative h-full overflow-y-scroll">
        <div class="px-4 sm:px-6 lg:px-8">
            <slot></slot>
        </div>
      </main>

      <MenuBottomComponent v-if="isMobile"/>
    </div>
  </div>
</template>
<style>
.glass-effect {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
