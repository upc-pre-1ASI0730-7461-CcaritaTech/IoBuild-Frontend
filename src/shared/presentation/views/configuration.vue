<script setup>
import { ref } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import Button from 'primevue/button';

// Datos para cada sección
const notificationItems = ref([
  { label: 'Expiration Alerts', enabled: true },
  { label: 'System Updates', enabled: true },
  { label: 'Customer Notifications', enabled: true },
  { label: 'Push Notifications', enabled: true }
]);

const securityItems = ref([
  { label: 'Change Password' },
  { label: '2FA Authentication' },
  { label: 'Sessions Management' },
  { label: 'Add Alternate mail address' }
]);

const supportItems = ref([
  { label: 'FAQs' },
  { label: 'Contact Support' },
  { label: 'Tutorials and Guides' }
]);
</script>

<template>
  <div class="configuration-container">
    <h1 class="title">Configuration</h1>

    <!-- Notifications and Security Sections -->
    <div class="flex-container">
      <!-- Notifications Section -->
      <div class="section-card">
        <h2 class="section-title">Notifications</h2>
        <div class="items-list">
          <div v-for="item in notificationItems" :key="item.label" class="item-row">
            <span>{{ item.label }}</span>
            <ToggleSwitch v-model="item.enabled" />
          </div>
        </div>
      </div>

      <!-- Security and Privacy Section -->
      <div class="section-card">
        <h2 class="section-title">Security and Privacy</h2>
        <div class="items-list">
          <div v-for="item in securityItems" :key="item.label" class="item-row">
            <span>{{ item.label }}</span>
            <Button icon="pi pi-cog" text class="icon-button" />
          </div>
        </div>
      </div>
    </div>

    <!-- Support and Help Section -->
    <div class="section-card">
      <h2 class="section-title">Support and Help</h2>
      <div class="items-list">
        <div v-for="item in supportItems" :key="item.label" class="item-row">
          <span>{{ item.label }}</span>
          <Button icon="pi pi-chevron-right" text class="icon-button" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.configuration-container {
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

/* Flex container for the two main sections */
.flex-container {
  display: flex;
  gap: 20px;
  margin-bottom: 55px;
}

.section-card {
  flex: 1;
  min-width: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  background-color: #f0fdf4;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.item-row:hover {
  background-color: #ecfdf5;
  border-color: #9ca3af;
}

.item-row span {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 12px;
}

.icon-button {
  color: #4b5563;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #e5e7eb;
}

/* Estilos personalizados para el ToggleSwitch */
.p-toggleswitch {
  width: 40px;
  height: 20px;
  display: flex;
  align-items: center;
}

.p-toggleswitch .p-toggleswitch-slider {
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background: #cbd5e1;
  transition: background-color 0.2s;
}

.p-toggleswitch .p-toggleswitch-slider:before {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  margin-left: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: #10b981;
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider:before {
  transform: translateX(20px);
}

/* Responsive: en móviles, apilar las secciones */
@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
    gap: 16px;
  }

  .configuration-container {
    padding: 16px;
  }
}
</style>