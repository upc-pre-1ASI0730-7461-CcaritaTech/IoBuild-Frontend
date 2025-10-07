<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#2196F3'
  },
  label: {
    type: String,
    default: 'Datos'
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar'].includes(value)
  },
  height: {
    type: Number,
    default: 300
  }
});

const canvasRef = ref(null);
const chartInstance = ref(null);
const chartLoaded = ref(false);

// Function to create gradient
const createGradient = (ctx, color) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color + '40');
  gradient.addColorStop(1, color + '10');
  return gradient;
};

// Chart configuration
const getChartConfig = () => {
  const ctx = canvasRef.value.getContext('2d');
  const gradient = createGradient(ctx, props.color);

  return {
    type: props.chartType,
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        borderColor: props.color,
        backgroundColor: props.chartType === 'line' ? gradient : props.color + '80',
        borderWidth: 3,
        fill: props.chartType === 'line',
        tension: props.chartType === 'line' ? 0.4 : 0,
        pointBackgroundColor: props.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: props.chartType === 'line' ? 5 : 0,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: props.color,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            color: '#666',
            font: {
              size: 12
            },
            maxTicksLimit: 8
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          border: {
            display: false
          },
          ticks: {
            color: '#666',
            font: {
              size: 12
            },
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      },
      elements: {
        point: {
          hoverBackgroundColor: props.color,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutCubic'
      }
    }
  };
};

// Initialize chart
const initChart = async () => {
  if (!window.Chart) {
    console.log('Chart.js not loaded yet, waiting...');
    return;
  }

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  await nextTick();
  
  if (!canvasRef.value) return;

  try {
    chartInstance.value = new window.Chart(canvasRef.value, getChartConfig());
    chartLoaded.value = true;
  } catch (error) {
    console.error('Error creating chart:', error);
  }
};

// Update chart data
const updateChart = () => {
  if (!chartInstance.value) return;

  chartInstance.value.data.labels = props.labels;
  chartInstance.value.data.datasets[0].data = props.data;
  chartInstance.value.update('active');
};

// Wait for Chart.js to load
const waitForChartJS = () => {
  if (window.Chart) {
    initChart();
  } else {
    // Check every 100ms if Chart.js is loaded
    const checkInterval = setInterval(() => {
      if (window.Chart) {
        clearInterval(checkInterval);
        initChart();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.Chart) {
        console.error('Chart.js failed to load within timeout period');
      }
    }, 10000);
  }
};

// Watchers
watch([() => props.labels, () => props.data], () => {
  if (chartLoaded.value) {
    updateChart();
  }
}, { deep: true });

// Lifecycle
onMounted(() => {
  waitForChartJS();
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<template>
  <div class="chart-wrapper" :style="{ height: height + 'px' }">
    <div v-if="!chartLoaded" class="chart-loading">
      <div class="loading-spinner"></div>
      <p>{{ t('dashboard.chart_loading') }}</p>
    </div>
    
    <canvas
      ref="canvasRef"
      :style="{ display: chartLoaded ? 'block' : 'none' }"
    ></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

canvas {
  max-width: 100%;
  height: auto !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-wrapper {
    padding: 12px;
  }
}

/* Animation for chart container */
.chart-wrapper {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>