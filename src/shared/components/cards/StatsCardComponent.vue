<script lang="ts" setup>
import UiCard from '@/shared/ui/cards/UiCard.vue';
import UiCardContent from '@/shared/ui/cards/UiCardContent.vue';
import UiCardIcon from '@/shared/ui/cards/UiCardIcon.vue';
import UiCardNumber from '@/shared/ui/cards/UiCardNumber.vue';
import UiCardText from '@/shared/ui/cards/UiCardText.vue';
import UiCardTitle from '@/shared/ui/cards/UiCardTitle.vue';
import type { Component } from 'vue';

defineProps<{
    title: string;
    statNumber: string;
    text?: string;
    icon?: Component;
    transparent?: boolean
}>();
</script>

<template>
    <UiCard :transparent="transparent">
        <UiCardContent>
            <div class="flex items-center justify-between">
                <div>
                    <UiCardTitle :class="transparent ? 'text-gray-900' : 'text-white'">
                        {{ title }}
                    </UiCardTitle>
                    <UiCardNumber :class="transparent ? 'text-gray-900' : 'text-white'">
                        {{ statNumber }}
                    </UiCardNumber>
                </div>
                <UiCardIcon v-if="icon">
                    <component :is="icon"></component>
                </UiCardIcon>
            </div>
            <div>
                <UiCardText v-if="text" :class="transparent ? 'text-gray-500' : 'text-green-400/80'">
                    {{ text }}
                </UiCardText>
            </div>
        </UiCardContent>
    </UiCard>
</template>