<template>
    <UiModal
        :model-value="modelValue"
        :size="size"
        :close-on-esc="closeOnEsc"
        :close-on-backdrop="closeOnBackdrop"
        @update:modelValue="$emit('update:modelValue', $event)"
        @close="$emit('close')"
    >
        <slot name="modal-header"></slot>
        <slot name="modal-body">
            <UiModalBody>
                <slot />
            </UiModalBody>
        </slot>
        <slot name="modal-footer"></slot>
    </UiModal>
</template>

<script lang="ts" setup>
import UiModal from '@/shared/ui/modal/UiModal.vue';
import UiModalBody from '@/shared/ui/modal/UiModalBody.vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

withDefaults(defineProps<{
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

function close() {
    emit('update:modelValue', false);
    emit('close');
}
</script>