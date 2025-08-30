<script lang="ts" setup>
defineProps<{
    transparent?: boolean;
}>();
</script>

<template>
<div class="card" :class="[
  transparent ? 'bg-white text-gray-900' : 'bg-blue-950 text-white'
]">
    <slot></slot>
</div>
</template>