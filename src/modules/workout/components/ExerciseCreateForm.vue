<script lang="ts" setup>
import { ref } from 'vue';
import UiInputText from '@/shared/ui/inputs/UiInputText.vue';
import UiInputNumber from '@/shared/ui/inputs/UiInputNumber.vue';
import UiSelect from '@/shared/ui/select/UiSelect.vue';
import { ExerciseMuscleGroup } from '../models/Exercise';
import type { Exercise } from '../models/Exercise';

const $props = withDefaults(defineProps<{
    exerciseTypes: ExerciseType[]
}>(), {
    exerciseTypes: () => []
});
const $emit = defineEmits<{
    (e: 'submit', value: form.value): void
}>()

const form = ref<Exercise>({
    title: '',
    subtitle: '',
    type: $props.exerciseTypes[0],
    body_weight: 0,
    weight: 0,
    repetitions: 0,
    set: 0,
    rest: 0,
});

const exerciseTypes = $props.exerciseTypes.map(type => ({
    value: type.id,
    label: type.name
}));

function onSubmit() {
    if (!form.value.title || !form.value.type) return;
    $emit('submit', form.value);
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <UiInputText label="Titre" v-model="form.title" :isEditing="true" placeholder="Ex: Squat" />
        <UiInputText label="Sous-titre" v-model="form.subtitle" :isEditing="true" placeholder="Ex: Barre libre" />
        <UiSelect label="Groupe musculaire" v-model="form.type" :options="exerciseTypes" :isEditing="true" placeholder="Sélectionner" />
        <div class="grid grid-cols-2 gap-4">
            <UiInputNumber label="Poids du corps" v-model="form.body_weight" :isEditing="true" step="1" min="0" />
            <UiInputNumber label="Poids (kg)" v-model="form.weight" :isEditing="true" step="0.5" min="0" />
        </div>
        <div class="grid grid-cols-3 gap-4">
            <UiInputNumber label="Répétitions" v-model="form.repetitions" :isEditing="true" step="1" min="0" />
            <UiInputNumber label="Séries" v-model="form.set" :isEditing="true" step="1" min="0" />
            <UiInputNumber label="Repos (sec)" v-model="form.rest" :isEditing="true" step="5" min="0" />
        </div>
        <div class="flex justify-end gap-3 pt-2">
            <button type="submit" class="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">
                Créer
            </button>
        </div>
    </form>
</template>


