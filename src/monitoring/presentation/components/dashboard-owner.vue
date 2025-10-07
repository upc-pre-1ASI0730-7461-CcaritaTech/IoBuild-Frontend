<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import StatsCard from './stats-card.vue';
import HistoricalChart from './historical-chart.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const monitoringStore = useMonitoringStore();

const temperatureData = ref([]);
const energyConsumptionData = ref([]);

// Computed stats for owner
const stats = computed(() => [
  {
    title: t('dashboard.owner.stats.active_devices.title'),
    value: monitoringStore.onlineDevicesCount,
    icon: '📱',
    color: '#4CAF50',
    subtitle: t('dashboard.owner.stats.active_devices.subtitle', { count: monitoringStore.offlineDevicesCount })
  },
  {
    title: t('dashboard.owner.stats.avg_temperature.title'),
    value: getAverageTemperature(),
    icon: '🌡️',
    color: '#FF9800',
    subtitle: t('dashboard.owner.stats.avg_temperature.subtitle'),
    unit: '°C'
  },
  {
    title: t('dashboard.owner.stats.energy_consumption.title'),
    value: getTodayEnergyConsumption(),
    icon: '⚡',
    color: '#2196F3',
    subtitle: t('dashboard.owner.stats.energy_consumption.subtitle'),
    unit: 'kWh'
  }
]);

// Helper functions
function getAverageTemperature() {
  const tempDevices = monitoringStore.devices.filter(d => d.type === 'temperature');
  if (tempDevices.length === 0) return '22.5';
  const avg = tempDevices.reduce((sum, d) => sum + d.value, 0) / tempDevices.length;
  return avg.toFixed(1);
}

function getTodayEnergyConsumption() {
  // Mock calculation - in real app would come from API
  return Math.floor(Math.random() * 50 + 20);
}

// Transform raw analytics items into labels/data format
const transformTimeSeries = (items, timeFormat = 'hour') => {
  const labels = items.map(it => {
    const d = new Date(it.timestamp);
    if (timeFormat === 'hour') return d.getHours() + ':00';
    if (timeFormat === 'day') return d.toLocaleDateString();
    return d.toISOString();
  });
  const data = items.map(it => it.value);
  return { labels, data };
};

onMounted(async () => {
  try {
    const respTemp = await monitoringStore.fetchAnalytics({ deviceId: 301, type: 'temperature' });
    temperatureData.value = transformTimeSeries(respTemp || [], 'hour');
  } catch (e) {
    temperatureData.value = { labels: [], data: [] };
  }

  try {
    const respEnergy = await monitoringStore.fetchAnalytics({ deviceId: 302, type: 'energy', lastDays: 7 });
    // If API returns daily totals, use day format
    energyConsumptionData.value = transformTimeSeries(respEnergy || [], 'day');
  } catch (e) {
    energyConsumptionData.value = { labels: [], data: [] };
  }
});
</script>

<template>
  <div class="dashboard-owner">
    <!-- Stats Cards Row -->
    <div class="stats-grid">
      <stats-card
        v-for="(stat, index) in stats"
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
        :subtitle="stat.subtitle"
        :unit="stat.unit"
      />
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- Temperature History Chart -->
        <div class="chart-container">
          <h3>{{ t('dashboard.sections.charts.temperature_24h') }}</h3>
          <historical-chart
            v-if="temperatureData.labels"
            :labels="temperatureData.labels"
            :data="temperatureData.data"
            :color="'#FF9800'"
            :label="t('chart_labels.temperature_c')"
            chart-type="line"
          />
        </div>

        <!-- Energy Consumption Chart -->
        <div class="chart-container">
          <h3>{{ t('dashboard.sections.charts.energy_weekly') }}</h3>
          <historical-chart
            v-if="energyConsumptionData.labels"
            :labels="energyConsumptionData.labels"
            :data="energyConsumptionData.data"
            :color="'#2196F3'"
            :label="t('chart_labels.consumption_kwh')"
            chart-type="bar"
          />
        </div>
      </div>

      <!-- Devices Control Panel -->
      <div class="devices-control">
        <h3>Control de Dispositivos</h3>
        <div class="devices-grid">
          <div
            v-for="device in monitoringStore.devices"
            :key="device.id"
            class="device-card"
            :class="{ 'device-offline': device.isOffline() }"
            @click="monitoringStore.setCurrentDevice(device)"
          >
            <div class="device-header">
              <div class="device-info">
                <h4>{{ device.name }}</h4>
                <p class="device-location">{{ device.location }}</p>
              </div>
              <div 
                class="device-status-indicator"
                :style="{ backgroundColor: device.getStatusColor() }"
                :title="device.status"
              ></div>
            </div>
            
            <div class="device-value">
              <span class="value-number">{{ device.value }}</span>
              <span class="value-unit">{{ device.unit }}</span>
            </div>
            
            <div class="device-type">
              <span class="type-icon">{{ getDeviceTypeIcon(device.type) }}</span>
              <span class="type-name">{{ formatDeviceType(device.type) }}</span>
            </div>
            
            <div class="device-last-update">
              Actualizado: {{ formatLastUpdate(device.lastUpdate) }}
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="monitoringStore.devices.length === 0" class="empty-devices">
            <p>No hay dispositivos disponibles</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>{{ t('dashboard.quick_actions.title') }}</h3>
        <div class="actions-grid">
          <button class="action-button energy-saving">
            <span class="action-icon">🌱</span>
            <span class="action-text">{{ t('dashboard.quick_actions.energy_saving') }}</span>
          </button>
          
          <button class="action-button security">
            <span class="action-icon">🔒</span>
            <span class="action-text">{{ t('dashboard.quick_actions.security') }}</span>
          </button>
          
          <button class="action-button climate">
            <span class="action-icon">❄️</span>
            <span class="action-text">{{ t('dashboard.quick_actions.climate') }}</span>
          </button>
          
          <button class="action-button lighting">
            <span class="action-icon">💡</span>
            <span class="action-text">{{ t('dashboard.quick_actions.lighting') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
export default {
  methods: {
    getDeviceTypeIcon(type) {
      const icons = {
        'temperature': '🌡️',
        'humidity': '💧',
        'energy': '⚡',
        'water': '🚰',
        'security': '🔒',
        'lighting': '💡',
        'hvac': '❄️',
        'door': '🚪'
      };
      return icons[type] || '📱';
    },
    
    formatDeviceType(type) {
      const translations = {
        'temperature': 'Temperatura',
        'humidity': 'Humedad',
        'energy': 'Energía',
        'water': 'Agua',
        'security': 'Seguridad',
        'lighting': 'Iluminación',
        'hvac': 'Climatización',
        'door': 'Control de Acceso'
      };
      return translations[type] || type.charAt(0).toUpperCase() + type.slice(1);
    },

    formatLastUpdate(date) {
      if (!date) return 'Nunca';
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Ahora mismo';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours}h`;
      
      return date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.dashboard-owner {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.charts-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.devices-control {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.devices-control h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.device-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.device-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: #4CAF50;
}

.device-card.device-offline {
  opacity: 0.7;
  border-color: #f44336;
}

.device-card.device-offline:hover {
  border-color: #f44336;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.device-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.device-location {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.device-status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
}

.device-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.value-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-right: 4px;
}

.value-unit {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.device-type {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.type-icon {
  margin-right: 8px;
  font-size: 16px;
}

.type-name {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.device-last-update {
  font-size: 12px;
  color: #999;
}

.empty-devices {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #999;
}

.quick-actions {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.quick-actions h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-button.energy-saving:hover {
  border-color: #4CAF50;
  background: #f1f8e9;
}

.action-button.security:hover {
  border-color: #f44336;
  background: #ffebee;
}

.action-button.climate:hover {
  border-color: #2196F3;
  background: #e3f2fd;
}

.action-button.lighting:hover {
  border-color: #FF9800;
  background: #fff3e0;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.action-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .devices-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>