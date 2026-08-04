<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import type { Account } from '../models/Account'
import type { User } from '@supabase/supabase-js'
import { useAccountStore } from '../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import InformationsComponent from '../components/InformationsComponent.vue'
import HealthComponent from '../components/HealthComponent.vue'
import { ArrowRightStartOnRectangleIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    user: User
    initialAccount: Account
}>()

const accountStore = useAccountStore()
const authStore = useAuthStore()

const account = computed(() => authStore.account)

const initials = computed(() => {
    const f = account.value?.firstname?.[0] || ''
    const l = account.value?.lastname?.[0] || ''
    return (f + l).toUpperCase()
})

const memberSince = computed(() => {
    if (!account.value?.created_at) return ''
    return new Date(account.value.created_at).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
    })
})

onMounted(() => {
    accountStore.account = props.initialAccount
})

const handleLogout = async () => {
    await authStore.signOut()
}
</script>

<template>
    <div class="mx-auto max-w-lg space-y-4">
        <!-- Avatar + Name Header -->
        <div class="flex animate-fade-in flex-col items-center pt-2 text-center">
            <div
                class="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/15 ring-2 ring-accent-500/30"
            >
                <span class="text-2xl font-bold text-accent-400">{{ initials }}</span>
            </div>
            <h1 class="text-lg font-bold text-text-primary">
                {{ account?.firstname }} {{ account?.lastname }}
            </h1>
            <p class="mt-0.5 text-xs text-text-muted">{{ account?.email }}</p>
            <div class="mt-2 flex items-center space-x-2">
                <span class="badge badge-accent">{{ account?.role?.name || 'Membre' }}</span>
                <span v-if="memberSince" class="text-[10px] text-text-muted"
                    >Membre depuis {{ memberSince }}</span
                >
            </div>
        </div>

        <!-- Informations Personnelles -->
        <div class="stagger-1 animate-fade-in-up">
            <InformationsComponent />
        </div>

        <!-- Santé -->
        <div class="stagger-2 animate-fade-in-up">
            <HealthComponent />
        </div>

        <!-- Objectifs -->
        <div class="card stagger-3 animate-fade-in-up">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-text-primary">Objectifs</h2>
            </div>
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-xs text-text-muted">Entraînements / semaine</p>
                    <span class="badge badge-accent">{{
                        account?.objectives?.training_per_week ?? '—'
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Quick Links -->
        <div class="card stagger-4 animate-fade-in-up !p-0">
            <RouterLink
                to="/progress"
                class="press-sm flex items-center justify-between border-b border-white/[0.06] p-4 transition-colors hover:bg-white/5"
            >
                <span class="text-sm text-text-primary">Mes progrès</span>
                <ChevronRightIcon class="h-4 w-4 text-text-muted" />
            </RouterLink>
            <RouterLink
                to="/workout"
                class="press-sm flex items-center justify-between p-4 transition-colors hover:bg-white/5"
            >
                <span class="text-sm text-text-primary">Historique séances</span>
                <ChevronRightIcon class="h-4 w-4 text-text-muted" />
            </RouterLink>
        </div>

        <!-- Logout -->
        <button
            @click="handleLogout"
            class="press stagger-5 flex w-full animate-fade-in-up items-center justify-center space-x-2 rounded-xl py-3 text-red-400/80 transition-all duration-200 hover:bg-red-500/5 hover:text-red-400"
        >
            <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
            <span class="text-sm font-medium">Se déconnecter</span>
        </button>
    </div>
</template>
