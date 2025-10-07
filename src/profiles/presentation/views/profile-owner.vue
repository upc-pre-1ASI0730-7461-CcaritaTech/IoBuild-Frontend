<template>
  <div class="profile-container">
    <h1 class="profile-title">{{ $t('profile.title') }}</h1>

    <div class="profile-header">
      <div class="profile-card">
        <img
          v-if="profile.photoUrl"
          :src="profile.photoUrl"
          alt="Profile Photo"
          class="profile-photo"
        />
        <div v-else class="profile-photo placeholder">
          <span>{{ profile.name ? profile.name.charAt(0) : '?' }}</span>
        </div>

        <div class="profile-info">
          <h2 class="profile-name">{{ profile.name }}</h2>
          <p class="profile-role">{{ $t('profile.ownerRole') }}</p>
        </div>

        <pv-button
          :label="isEditing ? $t('profile.save') : $t('profile.edit')"
          class="edit-button"
          @click="toggleEdit"
        />
      </div>
    </div>

    <div class="main-content-grid">
      <div class="account-card">
        <h3 class="card-title">{{ $t('profile.accountInformation') }}</h3>

        <div class="info-group">
          <label>{{ $t('profile.fullName') }}</label>
          <input
            type="text"
            v-model="profile.name"
            :readonly="!isEditing"
            class="info-input"
          />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.email') }}</label>
          <input
            type="text"
            v-model="profile.email"
            readonly
            class="info-input"
          />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.phoneNumber') }}</label>
          <input
            type="text"
            v-model="profile.phoneNumber"
            :readonly="!isEditing"
            class="info-input"
          />
        </div>

        <div class="info-group">
          <label>{{ $t('profile.address') }}</label>
          <input
            type="text"
            v-model="profile.address"
            :readonly="!isEditing"
            class="info-input"
          />
        </div>

        <div v-if="isEditing" class="info-group">
          <label>Picture Profile:</label>
          <input
            v-model="profile.photoUrl"
            type="text"
            class="info-input"
            placeholder="https://i.postimg.cc/...jpg"
          />
        </div>

        <h3 class="card-title">{{ $t('profile.appLanguage') }}</h3>
        <input
          type="text"
          :value="$t('profile.languageEnglish')"
          readonly
          class="info-input"
        />
      </div>

      <div class="scenes-card">
        <h3 class="card-title">{{ $t('profile.scenes') }}</h3>

        <div v-if="isLoadingScenes" class="loading-text">
          {{ $t('profile.loadingScenes') }}
        </div>

        <div v-else-if="scenes.length === 0" class="no-scenes">
          {{ $t('profile.noScenes') }}
        </div>

        <div v-else class="scenes-list">
          <div v-for="scene in scenes" :key="scene.id" class="scene-item">
            <span class="scene-label">{{ sceneLabel(scene) }}</span>

            <div
              class="toggle-container"
              :class="{ active: scene.active }"
              @click="toggleScene(scene)"
            >
              <div class="toggle-ball"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '../../application/profile.store.js';
import { ProfileApi } from '../../infrastructure/profile-api.js';
import PvButton from 'primevue/button';

const { t, te } = useI18n();
const store = useProfileStore();
const api = new ProfileApi();

const profile = computed(() => store.profile);
const isEditing = ref(false);

const scenes = ref([]);
const isLoadingScenes = ref(true);

onMounted(async () => {
    const currentUserId = parseInt(import.meta.env.VITE_CURRENT_USER_ID);

    if (currentUserId) {
        await store.fetchProfile(currentUserId);
    } else {
        console.error("VITE_CURRENT_USER_ID undefined.");
    }


    try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const unitId = 201;
        const res = await fetch(`${baseUrl}/scenes?unitId=${unitId}`);
        const data = await res.json();
        scenes.value = data.map(scene => ({ ...scene, active: false }));
    } catch (err) {
        console.error('Error fetching scenes:', err);
    } finally {
        isLoadingScenes.value = false;
    }
});

function toggleEdit() {
  if (isEditing.value) {
    saveProfile();
  }
  isEditing.value = !isEditing.value;
}

async function saveProfile() {
  try {
    await api.updateProfile(profile.value.id, {
      fullName: profile.value.name,
      address: profile.value.address,
      phoneNumber: profile.value.phoneNumber,
      photoUrl: profile.value.photoUrl
    });
    alert('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile');
  }
}

function toggleScene(scene) {
  scene.active = !scene.active;
}

function sceneLabel(scene) {
  const keyById = `profile.sceneNames.${scene.id}`;
  const keyByName = `profile.sceneNames.${scene.name}`;
  if (te(keyById)) return t(keyById);
  if (te(keyByName)) return t(keyByName);
  return scene.name;
}
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 2rem;
  background-color: #f8fafc;
}

.profile-title {
  text-align: left;
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.2rem;
}

.profile-header {
  display: flex;
  justify-content: left;
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
}

.profile-photo.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: black;
  background-color: #d1d5db;
}

.profile-info {
  flex-grow: 1;
}

.profile-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
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

.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.account-card {
  background: white;
  border-radius: 10px;
  border: 1px solid black;
  padding: 25px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
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

.scenes-card {
  background-color: #ecfdf5;
  border: 1px solid black;
  border-radius: 10px;
  padding: 25px;
}

.scenes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  border-radius: 8px;
  background-color: white;
  padding: 0.8rem 1rem;
}

.scene-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: black;
}

.toggle-container {
  width: 42px;
  height: 22px;
  border: 1px solid black;
  border-radius: 12px;
  background-color: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.25s ease;
}

.toggle-container.active {
  background-color: black;
  justify-content: flex-end;
}

.toggle-ball {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  margin: 0 2px;
  transition: transform 0.25s ease;
}
</style>