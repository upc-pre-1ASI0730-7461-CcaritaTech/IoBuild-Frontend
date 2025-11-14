<template>
  <div class="flex align-items-center justify-content-center min-h-screen">
    <pv-card class="login-card">
      <template #title>
        <div class="text-center">
          <h2>{{ $t('iam.login.title') }}</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="block mb-2">{{ $t('iam.login.email') }}</label>
            <pv-input-text
              id="email"
              v-model="loginForm.email"
              type="email"
              :placeholder="$t('iam.login.emailPlaceholder')"
              class="w-full"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="block mb-2">{{ $t('iam.login.password') }}</label>
            <pv-password
              id="password"
              v-model="loginForm.password"
              :placeholder="$t('iam.login.passwordPlaceholder')"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              required
            />
          </div>

          <!-- Error Message -->
          <pv-message v-if="errorMessage" severity="error" :closable="false" class="mb-3">
            {{ errorMessage }}
          </pv-message>

          <!-- Submit Button -->
          <pv-button
            type="submit"
            :label="$t('iam.login.submitButton')"
            icon="pi pi-sign-in"
            :loading="isLoading"
            class="w-full"
          />

          <!-- Register Links -->
          <pv-divider />
          <p class="text-center mb-3">{{ $t('iam.login.noAccount') }}</p>
          <div class="flex gap-2">
            <pv-button
              :label="$t('iam.login.registerBuilder')"
              icon="pi pi-user-plus"
              severity="secondary"
              outlined
              @click="goToRegisterBuilder"
              class="flex-1"
            />
            <pv-button
              :label="$t('iam.login.registerOwner')"
              icon="pi pi-user-plus"
              severity="secondary"
              outlined
              @click="goToRegisterOwner"
              class="flex-1"
            />
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIamStore } from '../../application/iam.store.js';

const router = useRouter();
const iamStore = useIamStore();

const loginForm = ref({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await iamStore.signIn(loginForm.value.email, loginForm.value.password);
    // Redirect to home or dashboard after successful login
    router.push({ name: 'home' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Invalid email or password';
  } finally {
    isLoading.value = false;
  }
}

function goToRegisterBuilder() {
  router.push({ name: 'register-builder' });
}

function goToRegisterOwner() {
  router.push({ name: 'register-owner' });
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 450px;
}
</style>