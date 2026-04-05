<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';
import { ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { ArrowPathIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');

const handleSendOTP = async () => {
  try {
    await authStore.sendOTP(email.value);
  } catch (e) {
    // L'erreur est déjà gérée dans le store
  } finally {
    router.push({ name: 'verify-otp' });
  }
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
            MyCoaching
          </h2>
          <p class="mt-2 text-sm text-text-muted">
            Connectez-vous ou inscrivez-vous avec votre email
          </p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="authStore.error" class="mb-6">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <ExclamationCircleIcon class="h-5 w-5 text-red-400 flex-shrink-0" />
            <p class="text-sm text-red-400">{{ authStore.error }}</p>
          </div>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSendOTP">
          <div class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div class="relative">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  :disabled="authStore.loading"
                  class="input-field pl-4 pr-10"
                  placeholder="votre@email.com"
                  autocomplete="email"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span class="text-text-muted text-lg">@</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="authStore.loading"
              class="btn-primary press w-full flex justify-center items-center gap-2 py-3"
            >
              <ArrowPathIcon
                v-if="authStore.loading"
                class="animate-spin h-5 w-5"
              />
              <ArrowRightIcon
                v-else
                class="h-5 w-5"
              />
              {{ authStore.loading ? 'Envoi en cours...' : 'Envoyer le code' }}
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-6 pt-5 border-t border-white/[0.08]">
          <p class="text-center text-sm text-text-muted">
            Un code de vérification sera envoyé à votre adresse email
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
