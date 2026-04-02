<template>
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/[0.07] border-t border-white/[0.1]" style="backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);">
        <div class="mx-auto flex h-20 max-w-md items-center justify-around px-4 pb-safe">
            <RouterLink
                v-for="item in filteredNavigation"
                :key="item.name"
                :to="item.to"
                class="relative flex flex-1 flex-col items-center justify-center gap-1.5 py-2 transition-all duration-300 press-sm"
                :class="[
                    $route.path === item.to
                        ? 'text-accent-400'
                        : 'text-text-muted hover:text-text-secondary'
                ]"
            >
                <span
                    v-if="$route.path === item.to"
                    class="absolute -top-0.5 w-5 h-0.5 rounded-full bg-accent-400 transition-all duration-300"
                />
                <component
                    :is="item.icon"
                    class="h-6 w-6 transition-transform duration-300"
                    :class="$route.path === item.to ? 'scale-110' : ''"
                />
                <span class="text-[11px] font-medium">{{ item.name }}</span>
            </RouterLink>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin());

const navigation = [
  { name: 'Accueil', to: '/dashboard', adminOnly: false, icon: HomeIcon },
  { name: 'Programmes', to: '/workout', adminOnly: false, icon: CalendarDaysIcon },
  { name: 'Progrès', to: '/progress', adminOnly: false, icon: ChartBarIcon },
  { name: 'Profil', to: '/profil', adminOnly: false, icon: UserIcon },
]

const filteredNavigation = computed(() => {
  return navigation.filter(item => !item.adminOnly || isAdmin.value);
});
</script>
