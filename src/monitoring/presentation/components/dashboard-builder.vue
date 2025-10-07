<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import StatsCard from './stats-card.vue';
import HistoricalChart from './historical-chart.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const monitoringStore = useMonitoringStore();

// Chart.js configuration
const chartScript = document.createElement('script');
chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
document.head.appendChild(chartScript);

const energyData = ref([]);
const occupancyData = ref([]);

// Computed stats for builder
const stats = computed(() => [
  {
    title: t('dashboard.stats.active_projects.title'),
    value: monitoringStore.activeProjectsCount,
    icon: '🏗️',
    color: '#2196F3',
    subtitle: t('dashboard.stats.active_projects.subtitle', { count: monitoringStore.projectsCount })
  },
  {
    title: t('dashboard.stats.connected_devices.title'),
    value: monitoringStore.onlineDevicesCount,
    icon: '📡',
    color: '#4CAF50',
    subtitle: t('dashboard.stats.connected_devices.subtitle', { count: monitoringStore.devicesCount })
  },
  {
    title: t('dashboard.stats.occupied_units.title'),
    value: monitoringStore.occupiedUnits,
    icon: '🏠',
    color: '#FF9800',
    subtitle: t('dashboard.stats.occupied_units.subtitle', { percentage: Math.round(monitoringStore.occupancyRate) })
  }
]);

// Fetch real analytics data from the store and transform into labels/data
const transformTimeSeries = (items, timeFormat = 'hour') => {
  // items: [{ timestamp, value }, ...]
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
  // Try to fetch hourly energy for a representative device (302)
  try {
    const respEnergy = await monitoringStore.fetchAnalytics({ deviceId: 302, type: 'energy' });
    energyData.value = transformTimeSeries(respEnergy || [], 'hour');
  } catch (e) {
    energyData.value = { labels: [], data: [] };
  }

  // Fetch monthly/daily occupancy aggregates (type: 'occupancy_daily') if available
  try {
    const respOccupancy = await monitoringStore.fetchAnalytics({ type: 'occupancy_daily' });
    if (respOccupancy && respOccupancy.length) {
      occupancyData.value = transformTimeSeries(respOccupancy, 'day');
    } else {
      // fallback: use projects occupancy computed from store
      occupancyData.value = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        data: [monitoringStore.occupancyRate, monitoringStore.occupancyRate, monitoringStore.occupancyRate, monitoringStore.occupancyRate, monitoringStore.occupancyRate, monitoringStore.occupancyRate]
      };
    }
  } catch (e) {
    occupancyData.value = { labels: [], data: [] };
  }
});
</script>

<template>
  <div class="dashboard-builder">
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
      />
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- Energy Consumption Chart -->
        <div class="chart-container">
          <h3>{{ t('dashboard.sections.charts.energy_hourly') }}</h3>
          <historical-chart
            v-if="energyData.labels"
            :labels="energyData.labels"
            :data="energyData.data"
            :color="'#FF6384'"
            :label="t('chart_labels.consumption_kwh')"
            chart-type="line"
          />
        </div>

        <!-- Occupancy Rate Chart -->
        <div class="chart-container">
          <h3>{{ t('dashboard.sections.charts.occupancy_monthly') }}</h3>
          <historical-chart
            v-if="occupancyData.labels"
            :labels="occupancyData.labels"
            :data="occupancyData.data"
            :color="'#36A2EB'"
            :label="t('chart_labels.occupancy_pct')"
            chart-type="bar"
          />
        </div>
      </div>

      <!-- Projects Overview -->
      <div class="projects-overview">
        <h3>{{ t('dashboard.sections.projects_overview') }}</h3>
        <div class="projects-grid">
          <div
            v-for="project in monitoringStore.projects"
            :key="project.id"
            class="project-card"
            @click="monitoringStore.setCurrentProject(project)"
          >
            <div class="project-header">
              <h4>{{ project.name }}</h4>
              <span 
                class="project-status" 
                :style="{ backgroundColor: project.getStatusColor() }"
              >
                {{ project.status }}
              </span>
            </div>
            <div class="project-info">
              <p><strong>Ubicación:</strong> {{ project.location }}</p>
              <p><strong>Unidades:</strong> {{ project.occupiedUnits }} / {{ project.totalUnits }}</p>
              <div class="occupancy-bar">
                <div 
                  class="occupancy-fill" 
                  :style="{ width: project.getOccupancyRate() + '%' }"
                ></div>
              </div>
              <p class="occupancy-text">{{ Math.round(project.getOccupancyRate()) }}% ocupado</p>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="monitoringStore.projects.length === 0" class="empty-projects">
            <p>No hay proyectos disponibles</p>
          </div>
        </div>
      </div>

      <!-- Device Types Distribution -->
      <div class="device-types-section">
        <h3>{{ t('dashboard.sections.device_distribution') }}</h3>
        <div class="device-types-grid">
          <div
            v-for="(count, type) in monitoringStore.devicesByType"
            :key="type"
            class="device-type-card"
          >
            <div class="device-type-icon">
              {{ getDeviceTypeIcon(type) }}
            </div>
            <div class="device-type-info">
              <h4>{{ formatDeviceType(type) }}</h4>
              <p class="device-count">{{ count }} dispositivos</p>
            </div>
          </div>
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
    }
  }
}
</script>

<style scoped>
.dashboard-builder {
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

.projects-overview {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.projects-overview h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.project-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #2196F3;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-header h4 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.project-status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.project-info p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.occupancy-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
}

.occupancy-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.occupancy-text {
  font-size: 12px;
  font-weight: 600;
  color: #4CAF50;
}

.empty-projects {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #999;
}

.device-types-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.device-types-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.device-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.device-type-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.device-type-card:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.device-type-icon {
  font-size: 24px;
  margin-right: 12px;
}

.device-type-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.device-count {
  margin: 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .device-types-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>