<script lang="ts" setup>
defineProps<{
    transparent?: boolean;
}>();
</script>

<template>
<div class="card" :class="[
  transparent ? 'bg-transparent border-none backdrop-blur-none' : ''
]">
    <slot></slot>
</div>
</template>
