<script lang="ts" setup>
import UiInputBase from './UiInputBase.vue';

const props = defineProps<{
    label: string;
    modelValue: number | undefined;
    isEditing?: boolean;
    step?: string;
    min?: string | number;
    max?: string | number;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const displayValue = computed(() => {
    if (props.modelValue === undefined || props.modelValue === null) {
        return 'Non renseigné';
    }
    return props.modelValue;
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    emit('update:modelValue', value);
}
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-text-secondary">{{ label }}</label>
        <template v-if="isEditing">
            <input
                type="number"
                :value="modelValue"
                @input="handleInput"
                :step="step"
                :min="min"
                :max="max"
                class="mt-1 input-field"
                />
        </template>
        <template v-else>
            <p class="mt-1 text-lg text-text-primary">{{ displayValue }}</p>
        </template>
    </div>
</template>
