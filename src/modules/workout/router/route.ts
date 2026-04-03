import type { RouteRecordRaw } from 'vue-router'
import WorkoutView from '../views/WorkoutView.vue'
import ExercisesView from '../views/ExercisesView.vue'
import ExerciseDetailView from '../views/ExerciseDetailView.vue'
import WorkoutSessionDetailView from '../views/WorkoutSessionDetailView.vue'
import WorkoutSessionEditView from '../views/WorkoutSessionEditView.vue'

export const workoutRoute: RouteRecordRaw = {
    path: '/workout',
    name: 'workout',
    meta: { requiresAuth: true },
    component: WorkoutView,
    children: []
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

export const exerciseDetailRoute: RouteRecordRaw = {
    path: '/exercises/:id',
    name: 'exercise-detail',
    meta: { requiresAuth: true },
    component: ExerciseDetailView,
}
