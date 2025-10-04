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
</script>

<template>
    <UiInputBase
        :label="label"
        :model-value="modelValue"
        :is-editing="isEditing"
        :step="step"
        :min="min"
        :max="max"
        type="number"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template> 