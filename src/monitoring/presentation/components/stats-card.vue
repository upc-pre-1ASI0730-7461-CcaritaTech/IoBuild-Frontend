<script setup lang="js">
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  color: {
    type: String,
    default: '#2196F3'
  },
  subtitle: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  }
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});
</script>

<template>
  <div class="stats-card" :style="{ '--accent-color': color }">
    <div class="card-header">
      <div class="icon-container">
        <span class="icon">{{ icon }}</span>
      </div>
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
    
    <div class="value-container">
      <span class="value">{{ formattedValue }}</span>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
    
    <div class="accent-line"></div>
  </div>
</template>

<style scoped>
.stats-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-color);
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.icon-container {
  background: linear-gradient(135deg, var(--accent-color), var(--accent-color)88);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 24px;
  filter: brightness(1.2);
}

.title-container {
  flex: 1;
}

.title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.3;
}

.value-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-right: 6px;
}

.unit {
  font-size: 16px;
  font-weight: 500;
  color: var(--accent-color);
}

.accent-line {
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  border-radius: 1px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .stats-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .icon-container {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .value {
    font-size: 28px;
  }
}

/* Animation for value changes */
.value {
  animation: countUp 0.8s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .stats-card {
    background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .title {
    color: #f0f0f0;
  }
  
  .subtitle {
    color: #b0b0b0;
  }
  
  .value {
    color: #ffffff;
  }
}</style>