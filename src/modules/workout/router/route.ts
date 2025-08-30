import type { RouteRecordRaw } from 'vue-router'
import WorkoutView from '../views/WorkoutView.vue'
import ExercisesView from '../views/ExercisesView.vue'

export const workoutRoute: RouteRecordRaw = {
    path: '/workout',
    name: 'workout',
    meta: { requiredAuth: true },
    component: WorkoutView,
    children: []
}
export const ExercisesRoute: RouteRecordRaw = {
    path: '/exercises',
    name: 'exercises',
    meta: { requiredAuth: true },
    component: ExercisesView,
    children: []
}
