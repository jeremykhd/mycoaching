<script lang="ts" setup generic="T = string | number">
import { computed, useSlots } from 'vue';

interface BaseInputProps<T> {
    label: string;
    modelValue: T | undefined;
    isEditing?: boolean;
    placeholder?: string;
    type?: 'text' | 'number' | 'select';
    step?: string;
    min?: string | number;
    max?: string | number;
    options?: Array<{ value: string | number; label: string }>;
}

const props = withDefaults(defineProps<BaseInputProps<T>>(), {
    isEditing: false,
    type: 'text',
    placeholder: undefined,
    step: undefined,
    min: undefined,
    max: undefined,
    options: () => []
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: T): void
}>();

const slots = useSlots();

const displayValue = computed(() => {
    if (props.modelValue === undefined || props.modelValue === null) {
        return 'Non renseigné';
    }
    
    if (props.type === 'select' && props.options) {
        const selectedOption = props.options.find(opt => opt.value === props.modelValue);
        return selectedOption ? selectedOption.label : String(props.modelValue);
    }
    
    return props.modelValue;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    let value: T;
    
    if (props.type === 'number') {
        value = Number(target.value) as T;
    } else {
        value = target.value as T;
    }
    
    emit('update:modelValue', value);
};

// Classes CSS communes
const baseInputClasses = 'mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 placeholder-night-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300';

const selectInputClasses = 'mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300 appearance-none cursor-pointer';
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-night-700">{{ label }}</label>
        
        <template v-if="isEditing">
            <!-- Slot personnalisé pour les cas d'extension avancée -->
            <slot 
                v-if="slots.default" 
                :handleInput="handleInput"
                :baseClasses="baseInputClasses"
                :selectClasses="selectInputClasses"
                :props="props"
            />
            
            <!-- Input text (performance optimisée) -->
            <input
                v-else-if="type === 'text'"
                type="text"
                :value="modelValue"
                @input="handleInput"
                :placeholder="placeholder"
                :class="baseInputClasses"
            />
            
            <!-- Input number (performance optimisée) -->
            <input
                v-else-if="type === 'number'"
                type="number"
                :value="modelValue"
                @input="handleInput"
                :step="step"
                :min="min"
                :max="max"
                :class="baseInputClasses"
            />
            
            <!-- Select (performance optimisée) -->
            <select
                v-else-if="type === 'select'"
                :value="modelValue"
                @input="handleInput"
                :class="selectInputClasses"
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
