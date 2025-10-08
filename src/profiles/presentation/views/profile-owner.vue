<template>
  <div class="profile-container">
    <h1 class="profile-title">{{ $t('profile.title') }}</h1>
    <div class="profile-header">
      <div class="profile-card">
        <img v-if="profile.photoUrl" :src="profile.photoUrl" alt="Profile Photo" class="profile-photo" />
        <div v-else class="profile-photo placeholder">
          <span>{{ profile.name ? profile.name.charAt(0) : '?' }}</span>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">{{ profile.name }}</h2>
          <p class="profile-role">{{ $t('profile.ownerRole') }}</p>
        </div>
        <div class="edit-buttons">
          <pv-button v-if="!isEditing" :label="$t('profile.edit')" class="edit-button" @click="toggleEdit" />
          <div v-else class="edit-actions">
            <pv-button :label="$t('profile.save')" class="edit-button" @click="toggleEdit" />
            <pv-button :label="$t('profile.cancel')" class="cancel-button" @click="cancelEdit" />
          </div>
        </div>
      </div>
    </div>

    <div class="main-content-grid">
      <div class="account-card">
        <h3 class="card-title">{{ $t('profile.accountInformation') }}</h3>
        <div class="info-group">
          <label>{{ $t('profile.fullName') }}</label>
          <input type="text" v-model="profile.name" :readonly="!isEditing" class="info-input" />
        </div>
        <div class="info-group">
          <label>{{ $t('profile.email') }}</label>
          <input type="text" v-model="profile.email" readonly class="info-input" />
        </div>
        <div class="info-group">
          <label>{{ $t('profile.phoneNumber') }}</label>
          <input type="text" v-model="profile.phoneNumber" :readonly="!isEditing" class="info-input" />
        </div>
        <div class="info-group">
          <label>{{ $t('profile.address') }}</label>
          <input type="text" v-model="profile.address" :readonly="!isEditing" class="info-input" />
        </div>
        <h3 class="card-title">{{ $t('profile.appLanguage') }}</h3>
        <select v-model="$i18n.locale" class="language-select">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="scenes-card">
        <h3 class="card-title">{{ $t('profile.scenes') }}</h3>
        <div v-if="isLoadingScenes" class="loading-text">{{ $t('profile.loadingScenes') }}</div>
        <div v-else-if="scenes.length === 0" class="no-scenes">{{ $t('profile.noScenes') }}</div>
        <div v-else class="scenes-list">
          <div v-for="scene in scenes" :key="scene.id" class="scene-item">
            <span class="scene-label">{{ sceneLabel(scene) }}</span>
            <div class="toggle-container" :class="{ active: scene.active }" @click="toggleScene(scene)">
              <div class="toggle-ball"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '../../application/profile.store.js'
import { ProfileApi } from '../../infrastructure/profile-api.js'
import PvButton from 'primevue/button'

const { t, te } = useI18n()
const store = useProfileStore()
const api = new ProfileApi()
const profile = computed(() => store.profile)
const isEditing = ref(false)
const scenes = ref([])
const isLoadingScenes = ref(true)

onMounted(async () => {
  const currentUserId = parseInt(import.meta.env.VITE_CURRENT_USER_ID)
  if (currentUserId) await store.fetchProfile(currentUserId)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/scenes?unitId=201`)
  const data = await res.json()
  scenes.value = data.map(s => ({ ...s, active: false }))
  isLoadingScenes.value = false
})

function toggleEdit() {
  if (isEditing.value) saveProfile()
  isEditing.value = !isEditing.value
}

async function saveProfile() {
  try {
    await api.updateProfile(profile.value.id, {
      name: profile.value.name,
      address: profile.value.address,
      phoneNumber: profile.value.phoneNumber,
      photoUrl: profile.value.photoUrl
    })
    console.log('')
  } catch (error) {
    console.error('', error)
  }
}

function cancelEdit() {
  isEditing.value = false
  store.fetchProfile(profile.value.id)
}

function toggleScene(scene) {
  scene.active = !scene.active
}

function sceneLabel(scene) {
  const keyById = `profile.sceneNames.${scene.id}`
  const keyByName = `profile.sceneNames.${scene.name}`
  if (te(keyById)) return t(keyById)
  if (te(keyByName)) return t(keyByName)
  return scene.name
}
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
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
  color: #000;
}
.profile-role {
  font-size: 0.95rem;
  color: #475569;
}
.edit-buttons,
.edit-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.edit-button {
  background-color: #10b981;
  color: white;
  border: none;
  font-weight: bold;
}
.cancel-button {
  background-color: #ef4444;
  color: white;
  border: none;
  font-weight: bold;
}
.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
.account-card,
.scenes-card {
  background: white;
  border-radius: 10px;
  border: 1px solid black;
  padding: 25px;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
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
.language-select {
  margin-top: 10px;
  padding: 8px 10px;
  border: 1px solid black;
  border-radius: 6px;
  width: 100%;
}
.loading-text,
.no-scenes {
  text-align: center;
  font-style: italic;
  color: #6b7280;
}
.scenes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.scene-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.scene-label {
  font-weight: 500;
  color: #111827;
}
.toggle-container {
  width: 45px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}
.toggle-container.active {
  background-color: #10b981;
}
.toggle-ball {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}
.toggle-container.active .toggle-ball {
  transform: translateX(21px);
}
</style>
