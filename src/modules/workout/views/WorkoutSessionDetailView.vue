<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutService } from '../services/useWorkoutService'
import type { Workout } from '../models/Workout'
import {
    ArrowLeftIcon,
    CalendarIcon,
    TrashIcon,
    CubeIcon,
    ArrowPathRoundedSquareIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'
import { FireIcon, BoltIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()
const { getWorkoutById, deleteWorkout } = useWorkoutService()

const workout = ref<Workout | null>(null)
const loading = ref(true)
const deleting = ref(false)

onMounted(async () => {
    const id = Number(route.params.id)
    if (!id) return

    const { data, error } = await getWorkoutById(id)
    if (!error && data) workout.value = data as Workout
    loading.value = false
})

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const typeName = computed(() => {
    if (!workout.value?.type) return null
    return typeof workout.value.type === 'object' ? workout.value.type.name : null
})

// Flatten exercises from pivot
const exercises = computed(() => {
    if (!workout.value?.exercises) return []
    return [...workout.value.exercises]
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        .map((we) => ({
            ...we,
            ex: we.exercise
        }))
})

// Group exercises: standalone + blocks
type DetailItem =
    | { kind: 'exercise'; we: (typeof exercises.value)[0]; index: number }
    | {
          kind: 'block'
          block: { id: number; type: string; title: string | null }
          exercises: { we: (typeof exercises.value)[0]; index: number }[]
      }

const detailItems = computed<DetailItem[]>(() => {
    const items: DetailItem[] = []
    const blocks = workout.value?.blocks || []
    const usedBlockIds = new Set<number>()

    for (let i = 0; i < exercises.value.length; i++) {
        const we = exercises.value[i]
        if (we.block_id) {
            if (!usedBlockIds.has(we.block_id)) {
                usedBlockIds.add(we.block_id)
                const block = blocks.find((b: any) => b.id === we.block_id)
                const blockExercises = exercises.value
                    .map((e, idx) => ({ we: e, index: idx }))
                    .filter((e) => e.we.block_id === we.block_id)
                items.push({
                    kind: 'block',
                    block: block || { id: we.block_id, type: 'superset', title: null },
                    exercises: blockExercises
                })
            }
        } else {
            items.push({ kind: 'exercise', we, index: i })
        }
    }
    return items
})

const totalSets = computed(() => {
    return exercises.value.reduce((sum, we) => sum + (we.set || 0), 0)
})

const totalVolume = computed(() => {
    return exercises.value.reduce((total, we) => {
        return total + (we.set || 0) * (we.repetitions || 0) * (we.weight || 0)
    }, 0)
})

const estimatedDuration = computed(() => {
    return exercises.value.reduce((total, we) => {
        const setTime = (we.set || 0) * 45
        const restTime = (we.set || 0) * (we.rest || 0)
        return total + setTime + restTime
    }, 0)
})

function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60)
    if (mins < 60) return `${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
}

const muscleGroups = computed(() => {
    const groups = new Set<string>()
    exercises.value.forEach((we) => {
        if (we.ex?.muscle_group) groups.add(we.ex.muscle_group)
    })
    return Array.from(groups)
})

async function handleDelete() {
    if (!workout.value || deleting.value) return
    deleting.value = true
    const { error } = await deleteWorkout(workout.value.id)
    if (!error) {
        router.push('/workout/sessions')
    }
    deleting.value = false
}
</script>

<template>
    <div class="mx-auto max-w-lg space-y-4">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
            <div
                class="h-6 w-6 animate-spin rounded-full border-2 border-accent-500 border-t-transparent"
            />
        </div>

        <!-- Not found -->
        <div
            v-else-if="!workout"
            class="card flex animate-fade-in flex-col items-center py-8 text-center"
        >
            <p class="text-sm text-text-secondary">Séance introuvable</p>
            <button @click="router.back()" class="press mt-3 text-sm text-accent-400">
                Retour
            </button>
        </div>

        <template v-else>
            <!-- Header -->
            <div class="flex animate-fade-in items-center justify-between">
                <div class="flex items-center space-x-3">
                    <button
                        @click="router.back()"
                        class="press rounded-lg p-1.5 transition-colors hover:bg-white/5"
                    >
                        <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
                    </button>
                    <div>
                        <h1 class="text-lg font-bold text-text-primary">{{ workout.title }}</h1>
                        <p v-if="workout.subtitle" class="text-xs text-text-muted">
                            {{ workout.subtitle }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Hero card -->
            <div class="card stagger-1 animate-fade-in-up">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span
                            v-if="typeName"
                            class="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-400"
                        >
                            {{ typeName }}
                        </span>
                    </div>
                    <div class="flex items-center space-x-1.5 text-text-muted">
                        <CalendarIcon class="h-3.5 w-3.5" />
                        <span class="text-[11px] capitalize">{{
                            formatDate(workout.created_at)
                        }}</span>
                    </div>
                </div>

                <div v-if="muscleGroups.length" class="mb-4 flex flex-wrap gap-1.5">
                    <span
                        v-for="group in muscleGroups"
                        :key="group"
                        class="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-text-secondary"
                    >
                        {{ group }}
                    </span>
                </div>

                <div class="grid grid-cols-4 gap-1">
                    <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
                        <p class="text-lg font-bold text-accent-400">{{ exercises.length }}</p>
                        <p class="mt-0.5 text-[10px] text-text-muted">Exercices</p>
                    </div>
                    <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
                        <p class="text-lg font-bold text-text-primary">{{ totalSets }}</p>
                        <p class="mt-0.5 text-[10px] text-text-muted">Séries</p>
                    </div>
                    <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
                        <p class="text-lg font-bold text-text-primary">
                            {{ totalVolume > 0 ? (totalVolume / 1000).toFixed(1) : '0' }}
                        </p>
                        <p class="mt-0.5 text-[10px] text-text-muted">t. volume</p>
                    </div>
                    <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
                        <p class="text-lg font-bold text-text-primary">
                            ~{{ formatDuration(estimatedDuration) }}
                        </p>
                        <p class="mt-0.5 text-[10px] text-text-muted">Durée est.</p>
                    </div>
                </div>
            </div>

            <!-- Exercises list -->
            <div class="stagger-2 animate-fade-in-up">
                <h2 class="mb-3 text-sm font-semibold text-text-primary">
                    Exercices ({{ exercises.length }})
                </h2>

                <div v-if="exercises.length" class="space-y-2">
                    <template
                        v-for="item in detailItems"
                        :key="
                            item.kind === 'exercise' ? `ex-${item.we.id}` : `block-${item.block.id}`
                        "
                    >
                        <!-- Standalone exercise -->
                        <div v-if="item.kind === 'exercise'" class="card animate-fade-in-up">
                            <div class="flex items-start space-x-3">
                                <div
                                    v-if="item.we.ex?.image_url"
                                    class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/5"
                                >
                                    <img
                                        :src="item.we.ex.image_url"
                                        :alt="item.we.ex.title"
                                        class="h-full w-full object-cover"
                                    />
                                </div>
                                <div
                                    v-else
                                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500/15"
                                >
                                    <span class="text-lg font-bold text-accent-400">{{
                                        item.index + 1
                                    }}</span>
                                </div>

                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-semibold text-text-primary">
                                        {{ item.we.ex?.title || 'Exercice' }}
                                    </p>
                                    <div class="mt-1 flex flex-wrap items-center gap-1.5">
                                        <span
                                            v-if="item.we.ex?.muscle_group"
                                            class="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-medium text-accent-400"
                                            >{{ item.we.ex.muscle_group }}</span
                                        >
                                        <span
                                            v-if="item.we.ex?.equipment"
                                            class="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-text-muted"
                                            >{{ item.we.ex.equipment }}</span
                                        >
                                        <span
                                            v-if="item.we.ex?.body_weight"
                                            class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
                                            >Poids du corps</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div
                                class="mt-3 grid grid-cols-4 gap-2 border-t border-white/[0.06] pt-3"
                            >
                                <div class="flex flex-col items-center">
                                    <div class="mb-0.5 flex items-center space-x-1">
                                        <ArrowPathRoundedSquareIcon
                                            class="h-3 w-3 text-accent-400"
                                        /><span class="text-[10px] text-text-muted">Séries</span>
                                    </div>
                                    <span class="text-sm font-bold text-text-primary">{{
                                        item.we.set || '—'
                                    }}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="mb-0.5 flex items-center space-x-1">
                                        <BoltIcon class="h-3 w-3 text-accent-400" /><span
                                            class="text-[10px] text-text-muted"
                                            >Reps</span
                                        >
                                    </div>
                                    <span class="text-sm font-bold text-text-primary">{{
                                        item.we.repetitions || '—'
                                    }}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="mb-0.5 flex items-center space-x-1">
                                        <CubeIcon class="h-3 w-3 text-accent-400" /><span
                                            class="text-[10px] text-text-muted"
                                            >Poids</span
                                        >
                                    </div>
                                    <span class="text-sm font-bold text-text-primary">{{
                                        item.we.weight ? `${item.we.weight} kg` : '—'
                                    }}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="mb-0.5 flex items-center space-x-1">
                                        <ClockIcon class="h-3 w-3 text-accent-400" /><span
                                            class="text-[10px] text-text-muted"
                                            >Repos</span
                                        >
                                    </div>
                                    <span class="text-sm font-bold text-text-primary">{{
                                        item.we.rest ? `${item.we.rest}s` : '—'
                                    }}</span>
                                </div>
                            </div>

                            <p
                                v-if="item.we.ex?.secondary_muscles"
                                class="mt-2 border-t border-white/[0.04] pt-2 text-[10px] text-text-muted"
                            >
                                Muscles secondaires : {{ item.we.ex.secondary_muscles }}
                            </p>
                        </div>

                        <!-- Block (Superset / Triset) -->
                        <div
                            v-else
                            class="animate-fade-in-up overflow-hidden rounded-2xl border border-accent-500/20 bg-accent-500/[0.03]"
                        >
                            <div
                                class="border-b border-accent-500/10 bg-accent-500/[0.06] px-4 py-2"
                            >
                                <div class="flex items-center space-x-2">
                                    <span
                                        class="text-xs font-semibold capitalize text-accent-400"
                                        >{{
                                            item.block.type === 'giant_set'
                                                ? 'Giant Set'
                                                : item.block.type
                                        }}</span
                                    >
                                    <span
                                        v-if="item.block.title"
                                        class="text-[10px] text-text-muted"
                                        >— {{ item.block.title }}</span
                                    >
                                    <span class="text-[10px] text-text-muted"
                                        >({{ item.exercises.length }} exercices)</span
                                    >
                                </div>
                            </div>
                            <div class="space-y-2 p-3">
                                <div
                                    v-for="bex in item.exercises"
                                    :key="bex.we.id"
                                    class="card !bg-white/[0.03]"
                                >
                                    <div class="flex items-start space-x-3">
                                        <div
                                            v-if="bex.we.ex?.image_url"
                                            class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white/5"
                                        >
                                            <img
                                                :src="bex.we.ex.image_url"
                                                :alt="bex.we.ex.title"
                                                class="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div
                                            v-else
                                            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/15"
                                        >
                                            <span class="text-sm font-bold text-accent-400">{{
                                                bex.we.ex?.title?.[0] || '?'
                                            }}</span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p
                                                class="truncate text-sm font-semibold text-text-primary"
                                            >
                                                {{ bex.we.ex?.title || 'Exercice' }}
                                            </p>
                                            <div class="mt-1 flex flex-wrap items-center gap-1.5">
                                                <span
                                                    v-if="bex.we.ex?.muscle_group"
                                                    class="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-medium text-accent-400"
                                                    >{{ bex.we.ex.muscle_group }}</span
                                                >
                                                <span
                                                    v-if="bex.we.ex?.equipment"
                                                    class="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-text-muted"
                                                    >{{ bex.we.ex.equipment }}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="mt-2 grid grid-cols-4 gap-2 border-t border-white/[0.06] pt-2"
                                    >
                                        <div class="flex flex-col items-center">
                                            <span class="text-[10px] text-text-muted">Séries</span>
                                            <span class="text-sm font-bold text-text-primary">{{
                                                bex.we.set || '—'
                                            }}</span>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <span class="text-[10px] text-text-muted">Reps</span>
                                            <span class="text-sm font-bold text-text-primary">{{
                                                bex.we.repetitions || '—'
                                            }}</span>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <span class="text-[10px] text-text-muted">Poids</span>
                                            <span class="text-sm font-bold text-text-primary">{{
                                                bex.we.weight ? `${bex.we.weight} kg` : '—'
                                            }}</span>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <span class="text-[10px] text-text-muted">Repos</span>
                                            <span class="text-sm font-bold text-text-primary">{{
                                                bex.we.rest ? `${bex.we.rest}s` : '—'
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <div v-else class="card py-6 text-center">
                    <p class="text-sm text-text-muted">Aucun exercice dans cette séance</p>
                </div>
            </div>

            <!-- Delete -->
            <div class="stagger-5 animate-fade-in-up pb-4 pt-2">
                <button
                    @click="handleDelete"
                    :disabled="deleting"
                    class="press flex w-full items-center justify-center space-x-2 rounded-xl border border-red-500/30 py-3 text-red-400 transition-all duration-200 hover:bg-red-500/10"
                >
                    <TrashIcon class="h-5 w-5" />
                    <span class="font-medium">{{
                        deleting ? 'Suppression...' : 'Supprimer la séance'
                    }}</span>
                </button>
            </div>
        </template>
    </div>
</template>
