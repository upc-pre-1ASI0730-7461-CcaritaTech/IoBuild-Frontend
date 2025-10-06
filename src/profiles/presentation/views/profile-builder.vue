<template>
  <div class="profile-container">
    <h1 class="profile-title">{{ $t('profile.title') }}</h1>
    <div class="profile-header">
      <div class="profile-card">
        <img :src="profile.photoUrl" alt="Profile Photo" class="profile-photo" />
        <div class="profile-info">
          <h2 class="profile-name">{{ profile.name }}</h2>
          <p class="profile-role">{{ $t('profile.builderRole') }}</p>
        </div>
        <pv-button :label="$t('profile.edit')" class="edit-button" />
      </div>
    </div>

    <div class="profile-body">
      <div class="account-card">
        <h3 class="card-title">{{ $t('profile.accountInformation') }}</h3>

        <div class="info-group">
          <label>{{ $t('profile.fullName') }}</label>
          <input type="text" :value="profile.name" readonly class="info-input" />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.email') }}</label>
          <input type="text" :value="profile.email" readonly class="info-input" />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.phoneNumber') }}</label>
          <input type="text" :value="profile.phoneNumber" readonly class="info-input" />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.address') }}</label>
          <input type="text" :value="profile.address" readonly class="info-input" />
        </div>

        <h3 class="card-title">{{ $t('profile.appLanguage') }}</h3>
        <input type="text" :value="$t('profile.languageEnglish')" readonly class="info-input" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProfileStore } from '../../application/profile.store.js';

const store = useProfileStore();
const profile = computed(() => store.profile);
</script>

<style scoped>

.profile-title {
  text-align: left;
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 2rem;
  background-color: #f8fafc;
}


.profile-header {
  display: flex;
  justify-content: center;
  width: 100%;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #ecfdf5;
  border-radius: 10px;
  border: 1px solid black;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 800px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid black;
  object-fit: cover;
  display: block;
  background-color: #ecfdf5;
}

.profile-info {
  flex-grow: 1;
}

.profile-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: #000000;
}

.profile-role {
  font-size: 0.95rem;
  color: #475569;
  margin: 0.25rem 0 0;
}

.edit-button {
  background-color: #10b981;
  color: white;
  border: none;
  font-weight: bold;
}

.profile-body {
  width: 100%;
  display: flex;
  justify-content: center;
}

.account-card {
  background: white;
  border-radius: 10px;
  border: 1px solid black;
  padding: 25px;
  width: 100%;
  max-width: 800px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
}

.info-group {
  margin-bottom: 15px;
}

.info-group label {
  display: block;
  font-size: 0.9rem;
  color: #111827;
  margin-bottom: 5px;
  font-weight: 500;
}

.info-input {
  width: 100%;
  background-color: #ecfdf5;
  border: 1px solid black;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  color: #111827;
}
</style>
