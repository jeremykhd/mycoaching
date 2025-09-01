<template>
    <div class="sticky bottom-0 z-40 bg-white pb-8 pt-1 h-30 border-t border-night-200 glass-effect">
        <div class="flex items-center justify-between h-full px-6">
            <div class="flex-1 min-w-0">
                <nav class="flex items-center justify-center space-x-6">
                    <RouterLink
                        v-for="item in filteredNavigation"
                        :key="item.name"
                        :to="item.to"
                        class="group flex flex-col items-center px-2 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 truncate"
                        :class="[
                            $route.path === item.to
                            ? 'text-night-900'
                            : 'text-gray-300  hover:text-orange-400'
                        ]"
                        >
                        <component :is="item.icon" class="h-6 w-6 mb-1"/>
                        <span>{{ item.name }}</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { HomeIcon, ClockIcon, Squares2X2Icon, UserIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin());

const navigation = [
  { name: 'Dashboard', to: '/dashboard', adminOnly: false, icon: HomeIcon },
  { name: 'Séances', to: '/workout', adminOnly: false, icon: ClockIcon },
  { name: 'Exercices', to: '/exercises', adminOnly: false, icon: Squares2X2Icon },
//   { name: 'Comptes', to: '/accounts', adminOnly: true },
  { name: 'Profil', to: '/profil', adminOnly: false, icon: UserIcon },
//   { name: 'Paramètres', to: '/settings', adminOnly: true },
]

const filteredNavigation = computed(() => {
  return navigation.filter(item => !item.adminOnly || isAdmin.value);
});
</script>