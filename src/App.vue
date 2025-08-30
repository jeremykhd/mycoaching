<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthProvider from './modules/auth/components/AuthProvider.vue';
import AppLayout from './shared/components/AppLayout.vue';
</script>

<template>
  <AuthProvider v-slot="{ user, account }">
    <AppLayout :user="user" :account="account" >
      <RouterView :user="user" :account="account"  />
    </AppLayout>
  </AuthProvider>
</template>

<style>
.glass-effect {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>