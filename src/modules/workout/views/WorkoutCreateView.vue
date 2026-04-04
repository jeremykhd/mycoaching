<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useWorkoutService } from '../services/useWorkoutService'
import { useExerciseService } from '../services/useExerciseService'
import { useExerciseApiService } from '../services/useExerciseApiService'
import type { WgerSearchResult } from '../services/useExerciseApiService'
import type { ExerciseType } from '../models/Exercise'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'

interface PendingExercise {
  tempId: number
  name: string
  category: string
  imageUrl: string | null
  muscleGroup: string | null
  secondaryMuscles: string | null
  equipment: string | null
  bodyWeight: boolean
  isCustom: boolean
  sets: number
  reps: number
  weight: number
  rest: number
}

let nextTempId = 1

const router = useRouter()
const authStore = useAuthStore()
const { createWorkout, addExerciseToWorkout } = useWorkoutService()
const { getExerciseTypes, createExerciseType, createExercise } = useExerciseService()
const {
  searchExercises,
  getExerciseInfo,
  getTranslatedName,
  getMainImage,
  getPrimaryMuscle,
  getSecondaryMuscles,
  getEquipment,
} = useExerciseApiService()

// Form state
const title = ref('')
const subtitle = ref('')
const selectedTypeId = ref<number | null>(null)
const selectedExercises = ref<PendingExercise[]>([])
const saving = ref(false)

// Types
const exerciseTypes = ref<ExerciseType[]>([])
const showNewTypeInput = ref(false)
const newTypeName = ref('')
const creatingType = ref(false)

// Exercise picker
const showPicker = ref(false)
const pickerMode = ref<'search' | 'custom'>('search')
const searchQuery = ref('')
const searchResults = ref<WgerSearchResult[]>([])
const searching = ref(false)
const importing = ref<number | null>(null)

// Custom exercise form
const customForm = ref({
  title: '',
  muscleGroup: '',
  equipment: '',
  bodyWeight: false,
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  const { data } = await getExerciseTypes()
  if (data) exerciseTypes.value = data as ExerciseType[]
})

watch(searchQuery, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!val.trim()) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    searching.value = true
    const results = await searchExercises(val)
    const selectedNames = new Set(selectedExercises.value.map(se => se.name.toLowerCase()))
    searchResults.value = results.filter(r => !selectedNames.has(r.name.toLowerCase()))
    searching.value = false
  }, 400)
})

const canSave = computed(() => {
  return title.value.trim() && selectedTypeId.value && selectedExercises.value.length > 0 && !saving.value
})

function openPicker() {
  pickerMode.value = 'search'
  searchQuery.value = ''
  searchResults.value = []
  customForm.value = { title: '', muscleGroup: '', equipment: '', bodyWeight: false }
  showPicker.value = true
}

async function addNewType() {
  const name = newTypeName.value.trim()
  if (!name || creatingType.value) return
  creatingType.value = true
  const { data, error } = await createExerciseType(name)
  if (!error && data) {
    const newType = data as ExerciseType
    exerciseTypes.value.push(newType)
    selectedTypeId.value = newType.id
    newTypeName.value = ''
    showNewTypeInput.value = false
  }
  creatingType.value = false
}

async function importExercise(result: WgerSearchResult) {
  if (importing.value !== null) return
  importing.value = result.base_id

  const info = await getExerciseInfo(result.base_id)
  if (!info) {
    importing.value = null
    return
  }

  selectedExercises.value.push({
    tempId: nextTempId++,
    name: getTranslatedName(info),
    category: result.category,
    imageUrl: getMainImage(info),
    muscleGroup: getPrimaryMuscle(info),
    secondaryMuscles: getSecondaryMuscles(info),
    equipment: getEquipment(info),
    bodyWeight: !info.equipment.length || info.equipment.some(e => e.name === 'none (bodyweight exercise)'),
    isCustom: false,
    sets: 3,
    reps: 10,
    weight: 0,
    rest: 60,
  })

  importing.value = null
  showPicker.value = false
}

function addCustomExercise() {
  const name = customForm.value.title.trim()
  if (!name) return

  selectedExercises.value.push({
    tempId: nextTempId++,
    name,
    category: customForm.value.muscleGroup || 'Custom',
    imageUrl: null,
    muscleGroup: customForm.value.muscleGroup || null,
    secondaryMuscles: null,
    equipment: customForm.value.equipment || null,
    bodyWeight: customForm.value.bodyWeight,
    isCustom: true,
    sets: 3,
    reps: 10,
    weight: 0,
    rest: 60,
  })

  showPicker.value = false
}

function removeExercise(index: number) {
  selectedExercises.value.splice(index, 1)
}

function moveExercise(index: number, direction: -1 | 1) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= selectedExercises.value.length) return
  const temp = selectedExercises.value[index]
  selectedExercises.value[index] = selectedExercises.value[newIndex]
  selectedExercises.value[newIndex] = temp
}

async function saveWorkout() {
  if (!canSave.value || !authStore.account?.id) return
  saving.value = true

  const { data: workout, error: workoutError } = await createWorkout({
    title: title.value.trim(),
    subtitle: subtitle.value.trim() || null,
    account_id: authStore.account.id,
    type_id: selectedTypeId.value,
  })

  if (workoutError || !workout) {
    saving.value = false
    return
  }

  for (let i = 0; i < selectedExercises.value.length; i++) {
    const pe = selectedExercises.value[i]

    const { data: catalogExercise, error: exError } = await createExercise({
      title: pe.name,
      subtitle: pe.category,
      muscle_group: pe.muscleGroup,
      secondary_muscles: pe.secondaryMuscles,
      equipment: pe.equipment,
      image_url: pe.imageUrl,
      body_weight: pe.bodyWeight,
      is_custom: pe.isCustom,
      account_id: authStore.account.id,
      type_id: selectedTypeId.value,
    })

    if (exError || !catalogExercise) continue

    await addExerciseToWorkout({
      workout_id: workout.id,
      exercise_id: catalogExercise.id,
      set: pe.sets,
      repetitions: pe.reps,
      weight: pe.weight,
      rest: pe.rest,
      order: i + 1,
    })
  }

  saving.value = false
  router.push('/workout/sessions')
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between animate-fade-in">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
          <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
        </button>
        <h1 class="text-lg font-bold text-text-primary">Nouvelle Séance</h1>
      </div>
      <button
        @click="saveWorkout"
        :disabled="!canSave"
        class="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 press"
        :class="canSave
          ? 'bg-accent-500 text-white hover:bg-accent-600'
          : 'bg-white/[0.06] text-text-muted cursor-not-allowed'"
      >
        <CheckIcon class="h-4 w-4" />
        <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
      </button>
    </div>

    <!-- Title & Subtitle -->
    <div class="card space-y-3 animate-fade-in-up stagger-1">
      <div>
        <label class="text-xs font-medium text-text-muted mb-1 block">Titre *</label>
        <input v-model="title" type="text" placeholder="Ex: Push Day, Leg Day..." class="input-field text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-text-muted mb-1 block">Description</label>
        <input v-model="subtitle" type="text" placeholder="Ex: Pectoraux, épaules et triceps" class="input-field text-sm" />
      </div>
    </div>

    <!-- Type de séance -->
    <div class="card space-y-3 animate-fade-in-up stagger-2">
      <label class="text-xs font-medium text-text-muted block">Type de séance *</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in exerciseTypes"
          :key="type.id"
          @click="selectedTypeId = type.id"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 press-sm"
          :class="selectedTypeId === type.id
            ? 'bg-accent-500 text-white'
            : 'bg-white/[0.06] text-text-muted hover:text-text-secondary'"
        >
          {{ type.name }}
        </button>
        <button
          v-if="!showNewTypeInput"
          @click="showNewTypeInput = true"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium border border-dashed border-white/[0.15] text-text-muted hover:text-accent-400 hover:border-accent-400/30 transition-all duration-200 press-sm"
        >
          <PlusIcon class="h-3.5 w-3.5 inline mr-1" />
          Ajouter
        </button>
      </div>
      <div v-if="showNewTypeInput" class="flex items-center space-x-2">
        <input v-model="newTypeName" type="text" placeholder="Nom du type..." class="input-field text-sm flex-1" @keyup.enter="addNewType" autofocus />
        <button @click="addNewType" :disabled="!newTypeName.trim() || creatingType" class="p-2 rounded-lg transition-colors press" :class="newTypeName.trim() && !creatingType ? 'bg-accent-500 text-white hover:bg-accent-600' : 'bg-white/[0.06] text-text-muted cursor-not-allowed'">
          <CheckIcon class="h-4 w-4" />
        </button>
        <button @click="showNewTypeInput = false; newTypeName = ''" class="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <XMarkIcon class="h-4 w-4 text-text-muted" />
        </button>
      </div>
    </div>

    <!-- Selected Exercises -->
    <div class="animate-fade-in-up stagger-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">Exercices ({{ selectedExercises.length }})</h2>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-2">
        <div v-for="(item, index) in selectedExercises" :key="item.tempId" class="card space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 min-w-0">
              <div v-if="item.imageUrl" class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                <span class="text-accent-400 text-sm font-bold">{{ index + 1 }}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <p class="text-sm font-medium text-text-primary truncate">{{ item.name }}</p>
                  <span v-if="item.isCustom" class="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/[0.06] text-text-muted flex-shrink-0">Custom</span>
                </div>
                <p v-if="item.muscleGroup" class="text-xs text-accent-400">{{ item.muscleGroup }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <button @click="moveExercise(index, -1)" :disabled="index === 0" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors" :class="index === 0 ? 'opacity-30' : ''">
                <ChevronUpIcon class="h-4 w-4 text-text-muted" />
              </button>
              <button @click="moveExercise(index, 1)" :disabled="index === selectedExercises.length - 1" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors" :class="index === selectedExercises.length - 1 ? 'opacity-30' : ''">
                <ChevronDownIcon class="h-4 w-4 text-text-muted" />
              </button>
              <button @click="removeExercise(index)" class="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                <TrashIcon class="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div>
              <label class="text-[10px] text-text-muted block mb-1 text-center">Séries</label>
              <input v-model.number="item.sets" type="number" min="1" class="input-field text-center text-sm !py-1.5" />
            </div>
            <div>
              <label class="text-[10px] text-text-muted block mb-1 text-center">Reps</label>
              <input v-model.number="item.reps" type="number" min="1" class="input-field text-center text-sm !py-1.5" />
            </div>
            <div>
              <label class="text-[10px] text-text-muted block mb-1 text-center">Poids (kg)</label>
              <input v-model.number="item.weight" type="number" min="0" step="0.5" class="input-field text-center text-sm !py-1.5" />
            </div>
            <div>
              <label class="text-[10px] text-text-muted block mb-1 text-center">Repos (s)</label>
              <input v-model.number="item.rest" type="number" min="0" step="5" class="input-field text-center text-sm !py-1.5" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <button @click="openPicker" class="mt-3 w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-dashed border-white/[0.12] text-accent-400 hover:bg-white/5 transition-all duration-200 press">
        <PlusIcon class="h-4 w-4" />
        <span class="text-sm font-medium">Ajouter un exercice</span>
      </button>
    </div>

    <!-- Exercise Picker Modal -->
    <Teleport to="body">
      <Transition name="page">
        <div v-if="showPicker" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPicker = false" />

          <div class="relative mt-auto max-h-[85vh] flex flex-col bg-bg-primary rounded-t-2xl overflow-hidden animate-slide-up">
            <!-- Header with tabs -->
            <div class="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <div class="flex items-center space-x-3">
                <button
                  @click="pickerMode = 'search'"
                  class="text-sm font-medium transition-colors"
                  :class="pickerMode === 'search' ? 'text-accent-400' : 'text-text-muted'"
                >
                  Rechercher
                </button>
                <span class="text-white/10">|</span>
                <button
                  @click="pickerMode = 'custom'"
                  class="text-sm font-medium transition-colors"
                  :class="pickerMode === 'custom' ? 'text-accent-400' : 'text-text-muted'"
                >
                  Créer custom
                </button>
              </div>
              <button @click="showPicker = false" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <XMarkIcon class="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <!-- Search mode -->
            <template v-if="pickerMode === 'search'">
              <div class="px-4 py-3">
                <div class="relative">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input v-model="searchQuery" type="text" placeholder="Ex: bench press, squat, curl..." class="input-field !pl-10 text-sm" autofocus />
                </div>
                <p class="text-[10px] text-text-muted mt-1.5 px-1">Recherche dans la base wger (en anglais)</p>
              </div>

              <div class="overflow-y-auto flex-1 px-4 pb-safe min-h-[200px]">
                <div v-if="searching" class="flex justify-center py-8">
                  <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div v-else-if="importing !== null" class="flex flex-col items-center justify-center py-8">
                  <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p class="text-sm text-text-secondary">Chargement des détails...</p>
                </div>
                <div v-else-if="searchResults.length" class="space-y-1 pb-4">
                  <button
                    v-for="result in searchResults"
                    :key="result.base_id"
                    @click="importExercise(result)"
                    class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left press-sm"
                  >
                    <div v-if="result.image" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                      <img :src="result.image" :alt="result.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                      <span class="text-accent-400 text-sm font-bold">{{ result.name[0] }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text-primary truncate">{{ result.name }}</p>
                      <p class="text-xs text-accent-400">{{ result.category }}</p>
                    </div>
                  </button>
                </div>
                <div v-else-if="searchQuery.trim() && !searching" class="flex flex-col items-center py-8 text-center">
                  <MagnifyingGlassIcon class="h-8 w-8 text-text-muted mb-2" />
                  <p class="text-sm text-text-secondary">Aucun résultat</p>
                  <p class="text-xs text-text-muted mt-1">Essayez un autre terme ou <button @click="pickerMode = 'custom'" class="text-accent-400">créez un exercice custom</button></p>
                </div>
                <div v-else class="flex flex-col items-center py-8 text-center">
                  <MagnifyingGlassIcon class="h-8 w-8 text-text-muted mb-2" />
                  <p class="text-sm text-text-secondary">Tapez pour rechercher</p>
                  <p class="text-xs text-text-muted mt-1">Ex: bench press, squat, deadlift...</p>
                </div>
              </div>
            </template>

            <!-- Custom creation mode -->
            <template v-else>
              <div class="overflow-y-auto flex-1 px-4 py-4 pb-safe space-y-3">
                <div class="flex items-center space-x-2 mb-2">
                  <WrenchScrewdriverIcon class="h-4 w-4 text-accent-400" />
                  <p class="text-xs text-text-muted">Créez un exercice personnalisé</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-text-muted mb-1 block">Nom de l'exercice *</label>
                  <input v-model="customForm.title" type="text" placeholder="Ex: Hip Thrust, Face Pull..." class="input-field text-sm" autofocus />
                </div>
                <div>
                  <label class="text-xs font-medium text-text-muted mb-1 block">Groupe musculaire</label>
                  <input v-model="customForm.muscleGroup" type="text" placeholder="Ex: Glutes, Shoulders..." class="input-field text-sm" />
                </div>
                <div>
                  <label class="text-xs font-medium text-text-muted mb-1 block">Équipement</label>
                  <input v-model="customForm.equipment" type="text" placeholder="Ex: Barbell, Cable..." class="input-field text-sm" />
                </div>
                <label class="flex items-center space-x-3 py-2">
                  <input v-model="customForm.bodyWeight" type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-500 focus:ring-accent-500/30" />
                  <span class="text-sm text-text-secondary">Poids du corps uniquement</span>
                </label>
                <button
                  @click="addCustomExercise"
                  :disabled="!customForm.title.trim()"
                  class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 press"
                  :class="customForm.title.trim()
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'bg-white/[0.06] text-text-muted cursor-not-allowed'"
                >
                  <PlusIcon class="h-4 w-4" />
                  <span>Ajouter l'exercice</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
