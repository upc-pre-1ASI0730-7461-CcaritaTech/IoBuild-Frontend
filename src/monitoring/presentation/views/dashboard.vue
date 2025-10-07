<script setup lang="js">
import { onMounted, computed } from 'vue';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import DashboardBuilder from '../components/dashboard-builder.vue';
import DashboardOwner from '../components/dashboard-owner.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const monitoringStore = useMonitoringStore();

const userRole = computed(() => monitoringStore.userRole);

const retryInitialize = async () => {
  await monitoringStore.initialize();
};

onMounted(async () => {
  await monitoringStore.initialize();
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Loading state -->
    <div v-if="monitoringStore.initLoading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t('dashboard.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="monitoringStore.errors.length > 0" class="error-container">
      <h3>{{ t('dashboard.error_header') }}</h3>
      <ul>
        <li v-for="(error, index) in monitoringStore.errors" :key="index">
          {{ error.message || error }}
        </li>
      </ul>
      <button @click="retryInitialize" class="retry-button">
        {{ t('dashboard.retry') }}
      </button>
    </div>

    <!-- Dashboard content based on user role -->
    <div v-else class="dashboard-content">
      <header class="dashboard-header">
        <h1>{{ t('dashboard.title') }}</h1>
        <p class="role-indicator">
          Rol: 
          <span :class="`role-badge role-${userRole}`">
            {{ userRole === 'builder' ? t('dashboard.role.builder') : t('dashboard.role.owner') }}
          </span>
        </p>
      </header>

      <!-- Builder Dashboard -->
      <dashboard-builder v-if="userRole === 'builder'" />

      <!-- Owner Dashboard -->
      <dashboard-owner v-else />
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 40px;
  color: #f44336;
}

.retry-button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 16px;
}

.retry-button:hover {
  background-color: #1976D2;
}

.dashboard-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.role-indicator {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
}

.role-builder {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-owner {
  background-color: #e8f5e8;
  color: #388e3c;
}

.dashboard-content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>