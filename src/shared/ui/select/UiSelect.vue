<script lang="ts" setup>
import { computed } from 'vue';

interface SelectOption {
    value: string;
    label: string;
}

const props = defineProps<{
    label: string;
    modelValue: string | undefined;
    options: SelectOption[];
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
    const selectedOption = props.options.find(opt => opt.value === props.modelValue);
    return selectedOption ? selectedOption.label : props.modelValue;
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
}
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-night-700">{{ label }}</label>
        <template v-if="isEditing">
            <select
                :value="modelValue"
                @input="handleInput"
                class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300 appearance-none cursor-pointer"
            >
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <option 
                    v-for="option in options" 
                    :key="option.value" 
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </template>
        <template v-else>
            <p class="mt-1 text-lg text-night-900">{{ displayValue }}</p>
        </template>
    </div>
</template>