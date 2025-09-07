<template>
    <div class="flex items-start justify-between gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div class="min-w-0">
            <slot />
        </div>
        <button
            type="button"
            class="shrink-0 rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
            @click="$emit('close')"
        >
            ✕
        </button>
    </div>
</template>

<script lang="ts" setup>
defineEmits<{ (e: 'close'): void }>();
</script>


