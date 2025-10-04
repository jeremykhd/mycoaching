<script lang="ts" setup>
import UiInputBase from '../inputs/UiInputBase.vue';

interface SelectOption {
    value: string | number;
    label: string;
}

defineProps<{
    label: string;
    modelValue: string | number | undefined;
    options: SelectOption[];
    isEditing?: boolean;
    placeholder?: string;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
    <UiInputBase
        :label="label"
        :model-value="modelValue"
        :options="options"
        :is-editing="isEditing"
        :placeholder="placeholder"
        type="select"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>