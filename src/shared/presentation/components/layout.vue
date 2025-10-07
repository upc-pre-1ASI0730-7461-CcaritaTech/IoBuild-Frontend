<script setup lang="js">
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import LanguageSwitcher from "./language-switcher.vue";

const { t } = useI18n();
const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const items = [
  { label: 'option.dashboard', to: '/monitoring/dashboard', use_role: '*', type: '*', icon: 'pi pi-chart-line' },
  { label: 'option.projects-management', to: '/projects/projects-management', use_role: '*', type: '*', icon: 'pi pi-folder' },
  { label: 'option.device-management', to: '/automation/device-management', use_role: '*', type: '*', icon: 'pi pi-microchip' },
  { label: 'option.profile', to: '/profiles/profile', use_role: '*', type: '*', icon: 'pi pi-user' },

  { label: 'option.projects-management', to: '/projects/projects-management', use_role: 'owner', type: 'owner', icon: 'pi pi-folder' },
  { label: 'option.payments', to: '/subscriptions/payments', use_role: 'owner', type: 'owner', icon: 'pi pi-credit-card' },

  { label: 'option.configuration', to: '/configuration', use_role: '*', type: '*', icon: 'pi pi-cog' },
];

const rawRole = import.meta.env.VITE_USER_ROLE || '*';
let userRole = String(rawRole).trim().toLowerCase();

if (userRole === 'owner') {
    userRole = 'builder';
} else if (userRole === 'builder') {
    userRole = 'owner';
}

const filteredItems = items.filter(item => {
  const itemRole = String(item.use_role || '*').trim().toLowerCase();

  if (itemRole === '*') {
    return true;
  }

  return itemRole === userRole;
});
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>

  <div class="app-container">
    <header class="app-header">
      <pv-toolbar class="custom-toolbar">
        <template #start>
          <div class="header-start">
            <pv-button
                class="menu-button"
                icon="pi pi-bars"
                text
                rounded
                @click="toggleDrawer"
            />
            <div class="brand">
              <h2 class="brand-name">IoBuild</h2>
            </div>
          </div>
        </template>
        <template #end>
          <language-switcher/>
        </template>
      </pv-toolbar>
    </header>


    <pv-drawer v-model:visible="drawer" class="custom-drawer">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-brand">
            <div>
              <h3 class="drawer-title">IoBuild</h3>
              <p class="drawer-subtitle">IoT Platform</p>
            </div>
          </div>
        </div>
      </template>

      <div class="drawer-content">
        <nav class="drawer-menu">
          <router-link
              v-for="item in filteredItems"
              :key="item.label"
              :to="item.to"
              class="menu-item"
              @click="drawer = false"
          >
            <i :class="item.icon" class="menu-icon"></i>
            <span class="menu-label">{{ t(item.label) }}</span>
            <i class="pi pi-chevron-right menu-arrow"></i>
          </router-link>
        </nav>
      </div>
    </pv-drawer>


    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e6fffa 100%);
}


.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.custom-toolbar {
  background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%) !important;
  border: none;
  padding: 0.75rem 1.5rem;
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-button {
  color: white !important;
  transition: transform 0.2s ease;
}

.menu-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.08) !important;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}


.brand-name {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}


:deep(.custom-drawer .p-drawer) {
  width: 320px !important;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.06);
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
}


:deep(.custom-drawer .p-drawer .p-drawer-content) {
  padding: 0 !important;
  background: transparent;
}

.drawer-header {
  padding: 1.5rem 1.5rem;
  background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
  color: white;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
}


:deep(.custom-drawer .p-drawer) .drawer-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.drawer-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.drawer-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.drawer-content {
  padding: 1rem 0;
}

.drawer-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #064e3b;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover {
  background: linear-gradient(90deg, rgba(45,212,191,0.08) 0%, transparent 100%);
  color: #065f46;
}

.menu-item:hover::before {
  transform: scaleY(1);
}

.menu-item.router-link-active {
  background: linear-gradient(90deg, rgba(45,212,191,0.12) 0%, transparent 100%);
  color: #065f46;
  font-weight: 600;
}

.menu-item.router-link-active::before {
  transform: scaleY(1);
}

.menu-icon {
  font-size: 1.25rem;
  width: 1.5rem;
  transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
  transform: scale(1.15);
}

.menu-label {
  flex: 1;
  font-size: 0.95rem;
}

.menu-arrow {
  font-size: 0.875rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.menu-item:hover .menu-arrow {
  opacity: 1;
  transform: translateX(0);
}


.main-content {
  padding: 2rem;
  min-height: calc(100vh - 76px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .brand-name {
    font-size: 1.25rem;
  }

  :deep(.custom-drawer .p-drawer) {
    width: 280px !important;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>