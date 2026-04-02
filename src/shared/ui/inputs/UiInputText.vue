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

const displayValue = computed(() => {
    if (props.modelValue === undefined || props.modelValue === null) {
        return 'Non renseigné';
    }
    return props.modelValue;
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-text-secondary">{{ label }}</label>
        <template v-if="isEditing">
            <input
                type="text"
                :value="modelValue"
                @input="handleInput"
                :placeholder="placeholder"
                class="mt-1 input-field"
                />
        </template>
        <template v-else>
            <p class="mt-1 text-lg text-text-primary">{{ displayValue }}</p>
        </template>
    </div>
</template>
