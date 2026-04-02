<template>
    <teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="onBackgroundClick" />
            <div
                class="relative w-full glass-strong shadow-2xl"
                :class="sizeClass"
                role="dialog"
                aria-modal="true"
            >
                <slot />
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

const props = withDefaults(defineProps<{
    modelValue: boolean;
    size?: ModalSize;
    closeOnEsc?: boolean;
    closeOnBackdrop?: boolean;
}>(), {
    size: 'md',
    closeOnEsc: true,
    closeOnBackdrop: true,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'close'): void;
}>();

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'w-screen h-screen rounded-none md:h-auto md:w-auto md:max-w-sm md:mx-4 md:rounded-2xl';
        case 'md':
            return 'w-screen h-screen rounded-none md:h-auto md:w-auto md:max-w-lg md:mx-4 md:rounded-2xl';
        case 'lg':
            return 'w-screen h-screen rounded-none md:h-auto md:w-auto md:max-w-3xl md:mx-4 md:rounded-2xl';
        case 'fullscreen':
            return 'w-screen h-screen rounded-none';
        default:
            return 'w-screen h-screen rounded-none md:h-auto md:w-auto md:max-w-lg md:mx-4 md:rounded-2xl';
    }
});

function close() {
    emit('update:modelValue', false);
    emit('close');
}

function onBackgroundClick() {
    if (props.closeOnBackdrop) close();
}

function onKeydown(e: KeyboardEvent) {
    if (!props.modelValue) return;
    if (props.closeOnEsc && e.key === 'Escape') {
        close();
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>
