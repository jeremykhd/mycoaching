<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramStore } from '../store/useProgramStore'
import ProgramCard from '../components/ProgramCard.vue'
import MonthCalendar from '../components/MonthCalendar.vue'
import SessionCard from '../components/SessionCard.vue'
import {
    ArrowTopRightOnSquareIcon,
    PlusIcon,
    CalendarDaysIcon,
    ListBulletIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const programStore = useProgramStore()

const accountId = computed(() => authStore.account?.id)

onMounted(async () => {
    if (!accountId.value) return
    await Promise.all([
        programStore.fetchActiveProgram(accountId.value),
        programStore.fetchWorkouts(accountId.value),
        programStore.fetchSessions(accountId.value)
    ])
})

// Compute planned dates from active program
const plannedDates = computed(() => {
    const program = programStore.activeProgram
    if (!program?.program_workouts?.length) return []

    const start = new Date(program.start_date)
    const dates: string[] = []

    for (const pw of program.program_workouts) {
        // For each week of the program, compute the actual date
        const weekOffset = (pw.week_number - 1) * 7
        // day_of_week: 1=Mon, 7=Sun. JS getDay: 0=Sun, 1=Mon
        const dayOffset = pw.day_of_week - 1 // 0=Mon
        const startDayOfWeek = start.getDay()
        const startMondayOffset = startDayOfWeek === 0 ? -6 : 1 - startDayOfWeek
        const monday = new Date(start)
        monday.setDate(start.getDate() + startMondayOffset)

        const targetDate = new Date(monday)
        targetDate.setDate(monday.getDate() + weekOffset + dayOffset)
        dates.push(targetDate.toISOString().split('T')[0])
    }

    return dates
})

// Compute completed dates from sessions
const completedDates = computed(() => {
    return programStore.sessions.map((s) => {
        return new Date(s.created_at).toISOString().split('T')[0]
    })
})

// Workouts for display (latest 3)
const recentWorkouts = computed(() => {
    return programStore.workouts.slice(0, 3)
})

// Exercise count (unique exercises across workouts)
const exerciseCount = computed(() => {
    const exerciseIds = new Set<number>()
    for (const w of programStore.workouts) {
        if (w.exercises) {
            for (const we of w.exercises) {
                exerciseIds.add(we.exercise_id)
            }
        }
    }
    return exerciseIds.size
})
</script>

<template>
    <div class="mx-auto max-w-lg space-y-4">
        <!-- Header -->
        <div class="flex animate-fade-in items-center justify-between">
            <h1 class="text-lg font-bold text-text-primary">Programmes</h1>
        </div>

        <!-- Active Program -->
        <div class="stagger-1 animate-fade-in-up">
            <ProgramCard v-if="programStore.activeProgram" :program="programStore.activeProgram" />
            <!-- Empty state -->
            <div v-else class="card flex flex-col items-center justify-center py-8 text-center">
                <CalendarDaysIcon class="mb-3 h-10 w-10 text-text-muted" />
                <p class="mb-1 text-sm text-text-secondary">Aucun programme actif</p>
                <p class="mb-4 text-xs text-text-muted">
                    Créez un programme pour planifier vos entraînements
                </p>
                <RouterLink to="/workout/program/create" class="btn-primary press text-sm">
                    <PlusIcon class="mr-1 inline h-4 w-4" />
                    Créer un programme
                </RouterLink>
            </div>
        </div>

        <!-- Calendar -->
        <div class="stagger-2 animate-fade-in-up">
            <MonthCalendar :planned-dates="plannedDates" :completed-dates="completedDates" />
        </div>

        <!-- Séances (Workouts) -->
        <div class="stagger-3 animate-fade-in-up">
            <div class="mb-3 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-text-primary">Séances</h2>
                <RouterLink
                    to="/workout/sessions"
                    class="text-xs text-accent-400 transition-colors hover:text-accent-300"
                >
                    Voir tout
                </RouterLink>
            </div>

            <div v-if="recentWorkouts.length" class="space-y-2">
                <div v-for="workout in recentWorkouts" :key="workout.id" class="card press-sm">
                    <SessionCard
                        :title="workout.title"
                        :subtitle="workout.subtitle || undefined"
                        :badges="
                            workout.exercises?.length
                                ? [
                                      {
                                          label: `${workout.exercises.length} exercices`,
                                          type: 'neutral' as const
                                      }
                                  ]
                                : []
                        "
                        :to="`/workout/session/${workout.id}`"
                    />
                </div>
            </div>

            <!-- Empty + Create -->
            <div v-else class="card flex flex-col items-center justify-center py-6 text-center">
                <p class="mb-1 text-sm text-text-secondary">Aucune séance créée</p>
                <p class="mb-4 text-xs text-text-muted">
                    Créez des séances pour les ajouter à votre programme
                </p>
            </div>

            <RouterLink
                to="/workout/create"
                class="press mt-3 flex w-full items-center justify-center space-x-2 rounded-xl border border-dashed border-white/[0.12] py-3 text-accent-400 transition-all duration-200 hover:bg-white/5"
            >
                <PlusIcon class="h-4 w-4" />
                <span class="text-sm font-medium">Créer une séance</span>
            </RouterLink>
        </div>

        <!-- Exercices -->
        <div class="stagger-4 animate-fade-in-up">
            <div class="mb-3 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-text-primary">Exercices</h2>
                <RouterLink
                    to="/exercises"
                    class="text-accent-400 transition-colors hover:text-accent-300"
                >
                    <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </RouterLink>
            </div>
            <RouterLink to="/exercises" class="card press-sm flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/15"
                    >
                        <ListBulletIcon class="h-4 w-4 text-accent-400" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-text-primary">Ma bibliothèque</p>
                        <p class="text-xs text-text-muted">
                            {{ exerciseCount }} exercice{{ exerciseCount > 1 ? 's' : '' }} utilisé{{
                                exerciseCount > 1 ? 's' : ''
                            }}
                        </p>
                    </div>
                </div>
                <ArrowTopRightOnSquareIcon class="h-4 w-4 text-text-muted" />
            </RouterLink>
        </div>
    </div>
</template>
