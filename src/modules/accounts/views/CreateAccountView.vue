<script lang="ts" setup>
import { useRouter } from 'vue-router';
import AccountFormComponent from '../components/AccountFormComponent.vue';
import type { Account } from '../models/Account';
import { useAccountStore } from '../store/useAccountStore';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';

const router = useRouter();
const accountStore = useAccountStore();
const authStore = useAuthStore();

const handleSubmit = async (account: Partial<Account>) => {
  if (!authStore.user) return

  await accountStore.createAccount(account, authStore.user.email ?? '', authStore.user.id)
  await authStore.fetchAccount()
  router.push({ name: 'dashboard' });
};

const handleCancel = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img
        src="@/assets/garrett-butler-UrJ-fn2iRUM-unsplash.jpg"
        alt="Background"
        class="w-full h-full object-cover object-bottom"
      />
      <div class="absolute inset-0 bg-night-900/80"></div>
    </div>

    <!-- Content -->
    <div class="max-w-md w-full mx-4 relative z-10">
      <!-- Card -->
      <div class="bg-night-800 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 text-center">
          <div class="flex justify-center mb-6">
            <img src="@/assets/logo.svg" alt="Logo" class="h-16 w-16 animate-pulse" />
          </div>
          <h2 class="text-3xl font-extrabold bg-gradient-to-r from-night-500 to-night-700 bg-clip-text text-transparent">
            Créer un compte
          </h2>
          <p class="mt-2 text-sm text-white">
            Remplissez le formulaire ci-dessous pour créer votre compte
          </p>
        </div>

        <!-- Formulaire -->
        <div class="px-8 pb-8">
          <AccountFormComponent
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>

        <!-- Footer -->
        <div class="px-8 py-4 bg-white/20 border-t border-white/20">
          <p class="text-center text-sm text-white">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  </div>
</template>