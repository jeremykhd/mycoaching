<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';
import { ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { ArrowPathIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();
const otpCode = ref('');

const handleVerifyOTP = async () => {
  try {
    await authStore.verifyOTP(otpCode.value);
    router.push({ name: 'dashboard' });
  } catch (e) {
    // L'erreur est déjà gérée dans le store
  }
};

const handleBackToLogin = () => {
  authStore.clearPendingVerification();
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
            Vérification
          </h2>
          <p class="mt-2 text-sm text-white">
            Entrez le code reçu par email
          </p>
          <p v-if="authStore.pendingVerification" class="mt-1 text-sm text-white/80">
            Code envoyé à {{ authStore.pendingVerificationEmail }}
          </p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="authStore.error" class="mx-8 mb-6">
          <div class="bg-red-50/90 border-l-4 border-red-400 p-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ authStore.error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
        <form class="px-8 pb-8" @submit.prevent="handleVerifyOTP">
          <div class="space-y-6">
            <div>
              <div class="relative">
                <input
                  id="otp"
                  v-model="otpCode"
                  type="text"
                  required
                  class="input-primary w-full text-center text-2xl tracking-widest py-3 bg-white/50 border-white/20 text-night-900 placeholder-night-600"
                  placeholder="••••••"
                  maxlength="6"
                  autocomplete="one-time-code"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="authStore.loading"
                class="relative btn-primary w-full flex justify-center items-center space-x-2 py-3 text-base bg-night-600 hover:bg-night-700 text-white"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowPathIcon
                    v-if="authStore.loading"
                    class="animate-spin h-5 w-5 text-white"
                  />
                  <ArrowRightIcon
                    v-else
                    class="h-5 w-5 text-white"
                  />
                </span>
                {{ authStore.loading ? 'Vérification...' : 'Vérifier le code' }}
              </button>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-8 py-4 bg-white/20 border-t border-white/20">
          <button
            type="button"
            @click="handleBackToLogin"
            class="w-full text-sm text-white hover:text-white/80 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 