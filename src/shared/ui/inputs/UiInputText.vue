<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
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
        <label class="block text-sm font-medium text-night-700">{{ label }}</label>
        <template v-if="isEditing">
            <input
                type="text"
                :value="modelValue"
                @input="handleInput"
                :placeholder="placeholder"
                class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 placeholder-night-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300"
                />
        </template>
        <template v-else>
            <p class="mt-1 text-lg text-night-900">{{ displayValue }}</p>
        </template>
    </div>
</template>