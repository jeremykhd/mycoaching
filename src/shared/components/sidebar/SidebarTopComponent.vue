<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { 
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/vue/24/outline';
import { computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';

const props = defineProps<{
    isSidebarOpen: boolean;
    isMobileMenuOpen: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:isSidebarOpen', value: boolean): void
  (e: 'update:isMobileMenuOpen', value: boolean): void
}>()

// Gestion du scroll du body
watch(() => props.isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

// Nettoyage lors de la destruction du composant
onUnmounted(() => {
  document.body.classList.remove('overflow-hidden');
});

const authStore = useAuthStore();

const isAdmin = computed(() => authStore.isAdmin());

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Séances d\'entraînements', to: '/workout'},
  { name: 'Mes exercices', to: '/exercises' },
  { name: 'Comptes utilisateurs', to: '/accounts', adminOnly: true },
  { name: 'Mon profil', to: '/profil' },
  { name: 'Paramètres', to: '/settings', adminOnly: true },
  { name: 'Se deconnecter', to: '/logout' },
]

const filteredNavigation = computed(() => {
  return navigation.filter(item => !item.adminOnly || isAdmin.value);
});
</script>

<template>
  <div class="sticky top-0 z-40 bg-white py-10 pt-12 h-16">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Left side -->
      <div class="flex justify-end md:items-center space-x-4 pr-6 flex-1 min-w-0">
        <button
          @click="emit('update:isSidebarOpen', !isSidebarOpen)"
          class="hidden lg:block p-2 rounded-2xl text-night-800 focus:outline-none transition-all duration-200 flex-shrink-0"
        >
          <ArrowLeftStartOnRectangleIcon v-if="isSidebarOpen" class="h-6 w-6"/>
          <ArrowRightStartOnRectangleIcon v-else class="h-6 w-6"/>
        </button>
        <!-- Navigation Desktop -->
        <div class="hidden md:block flex-1 min-w-0">
          <nav class="flex items-center space-x-4">
            <RouterLink
              v-for="item in filteredNavigation"
              :key="item.name"
              :to="item.to"
              class="group flex items-center px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 truncate"
              :class="[
                $route.path === item.to
                  ? 'text-night-900 border-b border-night-900'
                  : 'text-gray-300  hover:text-orange-400'
              ]"
            >
              {{ item.name }}
            </RouterLink>
          </nav>
        </div>
        <!-- Menu Mobile Button -->
        <button
          @click="emit('update:isMobileMenuOpen', !isMobileMenuOpen)"
          class="md:hidden p-2 rounded-2xl text-night-800 focus:outline-none transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <!-- Right side - Fixed position -->
      <div class="flex-shrink-0 ml-6">
        <button
          @click="authStore.signOut()"
          class="hidden lg:flex items-center px-4 py-2 text-sm font-medium rounded-2xl transition-all duration-200 hover:scale-105 text-red-900/30 hover:text-red-400 whitespace-nowrap min-w-[140px] justify-center"
        >
          <ArrowRightStartOnRectangleIcon class="h-5 w-5 mr-2 flex-shrink-0" />
          <span class="flex-shrink-0">Se déconnecter</span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-white z-50 md:hidden"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-night-900">Menu</h2>
          <button
            @click="emit('update:isMobileMenuOpen', false)"
            class="p-2 rounded-2xl text-night-800 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 p-4">
          <div class="space-y-2">
            <RouterLink
              v-for="item in filteredNavigation"
              :key="item.name"
              :to="item.to"
              @click="emit('update:isMobileMenuOpen', false)"
              class="block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200"
              :class="[
                $route.path === item.to
                  ? 'bg-night-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>