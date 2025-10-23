<template>
  <div class="flex align-items-center justify-content-center min-h-screen py-4">
    <pv-card class="register-card">
      <template #title>
        <div class="text-center">
          <h2>{{ $t('iam.registerOwner.title') }}</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister">
          <!-- User Information Section -->
          <pv-fieldset :legend="$t('iam.registerOwner.userInfoSection')" class="mb-3">
            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="block mb-2">{{ $t('iam.registerOwner.email') }} *</label>
              <pv-input-text
                id="email"
                v-model="registerForm.email"
                type="email"
                :placeholder="$t('iam.registerOwner.emailPlaceholder')"
                class="w-full"
                required
              />
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label for="password" class="block mb-2">{{ $t('iam.registerOwner.password') }} *</label>
              <pv-password
                id="password"
                v-model="registerForm.password"
                :placeholder="$t('iam.registerOwner.passwordPlaceholder')"
                toggleMask
                class="w-full"
                inputClass="w-full"
                required
              />
            </div>

            <!-- Confirm Password -->
            <div class="mb-3">
              <label for="confirmPassword" class="block mb-2">{{ $t('iam.registerOwner.confirmPassword') }} *</label>
              <pv-password
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                :placeholder="$t('iam.registerOwner.confirmPasswordPlaceholder')"
                :feedback="false"
                toggleMask
                class="w-full"
                inputClass="w-full"
                required
              />
            </div>
          </pv-fieldset>

          <!-- Profile Information Section -->
          <pv-fieldset :legend="$t('iam.registerOwner.profileInfoSection')" class="mb-3">
            <!-- Photo URL -->
            <div class="mb-3">
              <label for="photoUrl" class="block mb-2">{{ $t('iam.registerOwner.photoUrl') }}</label>
              <pv-input-text
                id="photoUrl"
                v-model="registerForm.photoUrl"
                type="url"
                :placeholder="$t('iam.registerOwner.photoUrlPlaceholder')"
                class="w-full"
              />
            </div>

            <!-- Name -->
            <div class="mb-3">
              <label for="name" class="block mb-2">{{ $t('iam.registerOwner.name') }} *</label>
              <pv-input-text
                id="name"
                v-model="registerForm.name"
                :placeholder="$t('iam.registerOwner.namePlaceholder')"
                class="w-full"
                required
              />
            </div>

            <!-- Username -->
            <div class="mb-3">
              <label for="username" class="block mb-2">{{ $t('iam.registerOwner.username') }} *</label>
              <pv-input-text
                id="username"
                v-model="registerForm.username"
                :placeholder="$t('iam.registerOwner.usernamePlaceholder')"
                class="w-full"
                required
              />
            </div>

            <!-- Address -->
            <div class="mb-3">
              <label for="address" class="block mb-2">{{ $t('iam.registerOwner.address') }} *</label>
              <pv-input-text
                id="address"
                v-model="registerForm.address"
                :placeholder="$t('iam.registerOwner.addressPlaceholder')"
                class="w-full"
                required
              />
            </div>

            <!-- Age -->
            <div class="mb-3">
              <label for="age" class="block mb-2">{{ $t('iam.registerOwner.age') }} *</label>
              <pv-input-number
                id="age"
                v-model="registerForm.age"
                :min="18"
                :max="100"
                :placeholder="$t('iam.registerOwner.agePlaceholder')"
                class="w-full"
                required
              />
            </div>

            <!-- Phone Number -->
            <div class="mb-3">
              <label for="phoneNumber" class="block mb-2">{{ $t('iam.registerOwner.phoneNumber') }} *</label>
              <pv-input-text
                id="phoneNumber"
                v-model="registerForm.phoneNumber"
                :placeholder="$t('iam.registerOwner.phoneNumberPlaceholder')"
                class="w-full"
                required
              />
            </div>
          </pv-fieldset>

          <!-- Error/Success Messages -->
          <pv-message v-if="errorMessage" severity="error" :closable="false" class="mb-3">
            {{ errorMessage }}
          </pv-message>

          <pv-message v-if="successMessage" severity="success" :closable="false" class="mb-3">
            {{ successMessage }}
          </pv-message>

          <!-- Buttons -->
          <div class="flex gap-2">
            <pv-button
              type="button"
              :label="$t('iam.registerOwner.cancelButton')"
              severity="secondary"
              outlined
              @click="goToLogin"
              class="flex-1"
            />
            <pv-button
              type="submit"
              :label="$t('iam.registerOwner.submitButton')"
              icon="pi pi-check"
              :loading="isLoading"
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
import { useProfileStore } from '../../../profiles/application/profile.store.js';

const router = useRouter();
const iamStore = useIamStore();
const profileStore = useProfileStore();

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  photoUrl: '',
  name: '',
  username: '',
  address: '',
  age: null,
  phoneNumber: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleRegister() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  // Validate passwords match
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    isLoading.value = false;
    return;
  }

  try {
    // 1. Create user with role "Owner"
    await iamStore.signUp({
      email: registerForm.value.email,
      password: registerForm.value.password,
      role: 'Owner'
    });

    // 2. Sign in to get the user ID
    const authenticatedUser = await iamStore.signIn(registerForm.value.email, registerForm.value.password);

    // 3. Create profile with user ID
    await profileStore.createProfile({
      userId: authenticatedUser.id,
      photoUrl: registerForm.value.photoUrl,
      name: registerForm.value.name,
      username: registerForm.value.username,
      address: registerForm.value.address,
      age: registerForm.value.age,
      phoneNumber: registerForm.value.phoneNumber
    });

    successMessage.value = 'Registration successful! Redirecting...';
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
      router.push({ name: 'home' });
    }, 2000);

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push({ name: 'login' });
}
</script>

<style scoped>
.register-card {
  max-width: 600px;
  margin: 2rem auto;
}
</style>
