import DeviceManagement from './views/device-management.vue';

export const automationRoutes = [
  {
    path: '',
    redirect: '/automation/device-management'
  },
  {
    path: 'device-management', // Ruta final: /automation/device-management
    name: 'device-management',
    component: DeviceManagement,
    alias: ['/automation/devices', 'devices'], // Compatibilidad con rutas antiguas
    meta: {
      title: 'Device Management',
      requiresAuth: true
    }
  }
];

export default automationRoutes;