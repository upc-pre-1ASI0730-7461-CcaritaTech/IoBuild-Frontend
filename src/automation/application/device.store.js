import { defineStore } from 'pinia';
import { DeviceApi } from '../infrastructure/device-api.js';

export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [],
    loading: false,
    error: null,
    selectedDevice: null
  }),

  getters: {
    onlineDevices: (state) => state.devices.filter(device => device.isOnline()),
    offlineDevices: (state) => state.devices.filter(device => !device.isOnline()),
    devicesByType: (state) => {
      const grouped = {};
      state.devices.forEach(device => {
        if (!grouped[device.type]) {
          grouped[device.type] = [];
        }
        grouped[device.type].push(device);
      });
      return grouped;
    },
    totalDevices: (state) => state.devices.length
  },

  actions: {
    async fetchDevices() {
      this.loading = true;
      this.error = null;
      try {
        const deviceApi = new DeviceApi();
        const list = await deviceApi.getAllDevices();
        const reverseCategoryMap = {
          'Sensor de Temperatura': 'temperature',
          'Medidor Energético': 'energy',
          'Sensor de Humedad': 'humidity',
          'Control de Acceso': 'door',
          'Sensor de Agua': 'water',
          'Sistema de Seguridad': 'security',
          'Control de Iluminación': 'lighting'
        };
        this.devices = list.map(d => {
          if (!d.type && d.category) {
            d.type = reverseCategoryMap[d.category] || d.category;
          }
          return d;
        });
        console.log('[DeviceStore] fetched devices:', this.devices.map(d => ({ id: d.id, type: d.type, category: d.category, keys: Object.keys(d) })));
      } catch (error) {
        this.error = error.message;
        console.error('Error in fetchDevices:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDeviceById(id) {
      this.loading = true;
      this.error = null;
      try {
        const deviceApi = new DeviceApi();
        this.selectedDevice = await deviceApi.getDeviceById(id);
        return this.selectedDevice;
      } catch (error) {
        this.error = error.message;
        console.error('Error in fetchDeviceById:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateDevice(device) {
      this.loading = true;
      this.error = null;
      try {
        const deviceApi = new DeviceApi();
        const updatedDevice = await deviceApi.updateDevice(device);
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices[index] = updatedDevice;
        }
        return updatedDevice;
      } catch (error) {
        this.error = error.message;
        console.error('Error in updateDevice:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createDevice(deviceData) {
      this.loading = true;
      this.error = null;
      try {
        const deviceApi = new DeviceApi();
        const newDevice = await deviceApi.createDevice(deviceData);
        this.devices.push(newDevice);
        return newDevice;
      } catch (error) {
        this.error = error.message;
        console.error('Error in createDevice:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteDevice(id) {
      this.loading = true;
      this.error = null;
      try {
        const deviceApi = new DeviceApi();
        await deviceApi.deleteDevice(id);
        this.devices = this.devices.filter(device => device.id !== id);
        return true;
      } catch (error) {
        this.error = error.message;
        console.error('Error in deleteDevice:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    setSelectedDevice(device) {
      this.selectedDevice = device;
    },

    clearError() {
      this.error = null;
    }
  }
});
