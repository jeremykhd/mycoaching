import type { RouteRecordRaw } from 'vue-router'
import WorkoutView from '../views/WorkoutView.vue'
import WorkoutListView from '../views/WorkoutListView.vue'
import WorkoutCreateView from '../views/WorkoutCreateView.vue'
import ExercisesView from '../views/ExercisesView.vue'
import ExerciseDetailView from '../views/ExerciseDetailView.vue'
import WorkoutSessionDetailView from '../views/WorkoutSessionDetailView.vue'
import WorkoutSessionEditView from '../views/WorkoutSessionEditView.vue'
import ProgramCreateView from '../views/ProgramCreateView.vue'
import ProgramDetailView from '../views/ProgramDetailView.vue'
import ProgramEditView from '../views/ProgramEditView.vue'
import LiveSessionView from '../views/LiveSessionView.vue'

export const workoutRoute: RouteRecordRaw = {
    path: '/workout',
    name: 'workout',
    meta: { requiresAuth: true },
    component: WorkoutView,
    children: []
}

export const workoutListRoute: RouteRecordRaw = {
    path: '/workout/sessions',
    name: 'workout-list',
    meta: { requiresAuth: true },
    component: WorkoutListView,
}

export const workoutCreateRoute: RouteRecordRaw = {
    path: '/workout/create',
    name: 'workout-create',
    meta: { requiresAuth: true },
    component: WorkoutCreateView,
}

export const programCreateRoute: RouteRecordRaw = {
    path: '/workout/program/create',
    name: 'program-create',
    meta: { requiresAuth: true },
    component: ProgramCreateView,
}

export const programDetailRoute: RouteRecordRaw = {
    path: '/workout/program/:id',
    name: 'program-detail',
    meta: { requiresAuth: true },
    component: ProgramDetailView,
}

export const programEditRoute: RouteRecordRaw = {
    path: '/workout/program/:id/edit',
    name: 'program-edit',
    meta: { requiresAuth: true },
    component: ProgramEditView,
}

export const workoutSessionDetailRoute: RouteRecordRaw = {
    path: '/workout/session/:id',
    name: 'workout-session-detail',
    meta: { requiresAuth: true },
    component: WorkoutSessionDetailView,
}

export const workoutSessionEditRoute: RouteRecordRaw = {
    path: '/workout/session/:id/edit',
    name: 'workout-session-edit',
    meta: { requiresAuth: true },
    component: WorkoutSessionEditView,
}

export const ExercisesRoute: RouteRecordRaw = {
    path: '/exercises',
    name: 'exercises',
    meta: { requiresAuth: true },
    component: ExercisesView,
    children: []
}

export const liveSessionRoute: RouteRecordRaw = {
    path: '/workout/live/:workoutId',
    name: 'live-session',
    meta: { requiresAuth: true },
    component: LiveSessionView,
}

export const resumeSessionRoute: RouteRecordRaw = {
    path: '/workout/live/session/:sessionId',
    name: 'resume-session',
    meta: { requiresAuth: true },
    component: LiveSessionView,
}

export const exerciseDetailRoute: RouteRecordRaw = {
    path: '/exercises/:id',
    name: 'exercise-detail',
    meta: { requiresAuth: true },
    component: ExerciseDetailView,
}
