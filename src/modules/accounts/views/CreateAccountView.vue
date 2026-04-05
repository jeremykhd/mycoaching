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
  <div class="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
    <!-- Ambient glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

    <!-- Content -->
    <div class="max-w-md w-full mx-4 relative z-10 animate-fade-in">
      <!-- Card -->
      <div class="card">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-5">
            <img src="@/assets/logo.svg" alt="Logo" class="h-16 w-16 animate-pulse" />
          </div>
          <h2 class="text-3xl font-extrabold text-text-primary">
            Créer un compte
          </h2>
          <p class="mt-2 text-sm text-text-muted">
            Remplissez le formulaire ci-dessous pour créer votre compte
          </p>
        </div>

        <!-- Formulaire -->
        <AccountFormComponent
          @submit="handleSubmit"
          @cancel="handleCancel"
        />

        <!-- Footer -->
        <div class="mt-6 pt-5 border-t border-white/[0.08]">
          <p class="text-center text-sm text-text-muted">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
