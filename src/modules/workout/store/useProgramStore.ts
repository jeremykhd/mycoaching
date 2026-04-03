import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Program } from '../models/Program'
import type { Workout } from '../models/Workout'
import type { WorkoutSession } from '../models/WorkoutSession'
import { useProgramService } from '../services/useProgramService'
import { useToast } from 'vue-toastification'

export const useProgramStore = defineStore('program', () => {
  const {
    getActiveProgram,
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getWorkoutSessions,
    getWorkouts,
  } = useProgramService()

  const toast = useToast()

  const activeProgram = ref<Program | null>(null)
  const programs = ref<Program[]>([])
  const workouts = ref<Workout[]>([])
  const sessions = ref<WorkoutSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActiveProgram(accountId: number) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getActiveProgram(accountId)
      if (err && err.code !== 'PGRST116') throw new Error(err.message)
      activeProgram.value = data as Program | null
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchPrograms(accountId: number) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getPrograms(accountId)
      if (err) throw new Error(err.message)
      programs.value = (data as Program[]) || []
    } catch (e: any) {
      error.value = e.message
      toast.error('Erreur lors du chargement des programmes')
    } finally {
      loading.value = false
    }
  }

  async function addProgram(program: Omit<Program, 'id' | 'created_at' | 'program_workouts'>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createProgram(program)
      if (err) throw new Error(err.message)
      if (data) {
        programs.value.unshift(data as Program)
        if ((data as Program).is_active) activeProgram.value = data as Program
        toast.success('Programme créé avec succès')
      }
      return data
    } catch (e: any) {
      error.value = e.message
      toast.error('Erreur lors de la création du programme')
    } finally {
      loading.value = false
    }
  }

  async function editProgram(id: number, updates: Partial<Program>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateProgram(id, updates)
      if (err) throw new Error(err.message)
      if (data) {
        const index = programs.value.findIndex(p => p.id === id)
        if (index !== -1) programs.value[index] = data as Program
        if ((data as Program).is_active) activeProgram.value = data as Program
        toast.success('Programme mis à jour')
      }
      return data
    } catch (e: any) {
      error.value = e.message
      toast.error('Erreur lors de la mise à jour')
    } finally {
      loading.value = false
    }
  }

  async function removeProgram(id: number) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await deleteProgram(id)
      if (err) throw new Error(err.message)
      programs.value = programs.value.filter(p => p.id !== id)
      if (activeProgram.value?.id === id) activeProgram.value = null
      toast.success('Programme supprimé')
    } catch (e: any) {
      error.value = e.message
      toast.error('Erreur lors de la suppression')
    } finally {
      loading.value = false
    }
  }

  async function fetchWorkouts(accountId: number) {
    try {
      const { data, error: err } = await getWorkouts(accountId)
      if (err) throw new Error(err.message)
      workouts.value = (data as Workout[]) || []
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function fetchSessions(accountId: number) {
    try {
      const { data, error: err } = await getWorkoutSessions(accountId)
      if (err) throw new Error(err.message)
      sessions.value = (data as unknown as WorkoutSession[]) || []
    } catch (e: any) {
      error.value = e.message
    }
  }

  return {
    activeProgram,
    programs,
    workouts,
    sessions,
    loading,
    error,
    fetchActiveProgram,
    fetchPrograms,
    addProgram,
    editProgram,
    removeProgram,
    fetchWorkouts,
    fetchSessions,
  }
})
