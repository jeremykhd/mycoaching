<script lang="ts" setup>
import UiInputBase from './UiInputBase.vue';

defineProps<{
    label: string;
    modelValue: string | undefined;
    isEditing?: boolean;
    placeholder?: string;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <UiInputBase
        :label="label"
        :model-value="modelValue"
        :is-editing="isEditing"
        :placeholder="placeholder"
        type="text"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>