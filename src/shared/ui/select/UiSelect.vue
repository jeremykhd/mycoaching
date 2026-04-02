<script lang="ts" setup>
import { computed } from 'vue';

interface SelectOption {
    value: string | number;
    label: string;
}

const props = defineProps<{
    label: string;
    modelValue: string | number | undefined;
    options: SelectOption[];
    isEditing?: boolean;
    placeholder?: string;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
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
        <label class="block text-sm font-medium text-text-secondary">{{ label }}</label>
        <template v-if="isEditing">
            <select
                :value="modelValue"
                @input="handleInput"
                class="mt-1 input-field appearance-none cursor-pointer"
            >
                <option v-if="placeholder" value="" disabled class="bg-bg-muted">{{ placeholder }}</option>
                <option
                    v-for="option in options"
                    :key="option.value"
                    :value="option.value"
                    class="bg-bg-muted"
                >
                    {{ option.label }}
                </option>
            </select>
        </template>
        <template v-else>
            <p class="mt-1 text-lg text-text-primary">{{ displayValue }}</p>
        </template>
    </div>
</template>
