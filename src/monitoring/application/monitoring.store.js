import { MonitoringApi } from "../infrastructure/monitoring-api.js";
import { DeviceAssembler } from "../infrastructure/device.assembler.js";
import { ProjectAssembler } from "../infrastructure/project.assembler.js";
import { AnalyticsAssembler } from "../infrastructure/analytics.assembler.js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const monitoringApi = new MonitoringApi();

export const useMonitoringStore = defineStore('monitoring', () => {
    // State
    const devices = ref([]);
    const projects = ref([]);
    const analytics = ref([]);
    const currentProject = ref(null);
    const currentDevice = ref(null);
    // Global loading used by unrelated endpoints. We separate initialization and analytics loading
    const loading = ref(false);
    const initLoading = ref(false);
    const analyticsLoading = ref(false);
    const errors = ref([]);
    
    // User role from environment
    const userRole = import.meta.env.VITE_USER_ROLE || 'owner';
    const userId = import.meta.env.VITE_USER_ID || '1';

    // Computed properties
    const devicesCount = computed(() => devices.value.length);
    const onlineDevicesCount = computed(() => devices.value.filter(d => d.isOnline()).length);
    const offlineDevicesCount = computed(() => devices.value.filter(d => d.isOffline()).length);
    const projectsCount = computed(() => projects.value.length);
    const activeProjectsCount = computed(() => projects.value.filter(p => p.status === 'active').length);
    const totalUnits = computed(() => projects.value.reduce((sum, p) => sum + p.totalUnits, 0));
    const occupiedUnits = computed(() => projects.value.reduce((sum, p) => sum + p.occupiedUnits, 0));
    const occupancyRate = computed(() => totalUnits.value > 0 ? (occupiedUnits.value / totalUnits.value) * 100 : 0);

    // Device statistics by type
    const devicesByType = computed(() => {
        const types = {};
        devices.value.forEach(device => {
            types[device.type] = (types[device.type] || 0) + 1;
        });
        return types;
    });

    // Actions
    async function fetchDevices() {
        try {
            let response;

            if (userRole === 'builder') {
                response = await monitoringApi.getDevices();
            } else {
                response = await monitoringApi.getDevicesByOwner(userId);
            }

            // Enrich each device with its configuration from device_configurations
            const deviceArray = response && response.data ? response.data : [];
            const configPromises = deviceArray.map(d => monitoringApi.getDeviceConfiguration(d.id));
            const configsResponses = await Promise.all(configPromises);

            const enriched = deviceArray.map((d, idx) => {
                const cfgResp = configsResponses[idx];
                const cfg = cfgResp && cfgResp.data ? cfgResp.data : null;
                return DeviceAssembler.fromDeviceAndConfig(d, cfg);
            });

            devices.value = enriched;
        } catch (error) {
            errors.value.push(error);
            console.error('Error fetching devices:', error);
        }
    }

    async function fetchProjects() {
        if (userRole !== 'builder') return; // Only builders have projects

        try {
            const response = await monitoringApi.getProjectsByBuilder(userId);
            projects.value = ProjectAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
            console.error('Error fetching projects:', error);
        }
    }

    async function fetchAnalytics(filtersOrDeviceId, timeRange = '24h') {
        try {
            analyticsLoading.value = true;
            const response = await monitoringApi.getAnalytics(filtersOrDeviceId, timeRange);
            const items = response && response.data ? response.data : response;
            const entities = Array.isArray(items) ? AnalyticsAssembler.toEntitiesFromResponse({ data: items }) : [];
            analytics.value = entities;
            return items;
        } catch (error) {
            errors.value.push(error);
            console.error('Error fetching analytics:', error);
            return [];
        } finally {
            analyticsLoading.value = false;
        }
    }

    async function fetchOwnerStatistics() {
        try {
            loading.value = true;
            const response = await monitoringApi.getOwnerStatistics(userId);
            return response.data;
        } catch (error) {
            errors.value.push(error);
            console.error('Error fetching owner statistics:', error);
            return {};
        } finally {
            loading.value = false;
        }
    }

    async function fetchProjectStatistics(projectId) {
        try {
            loading.value = true;
            const response = await monitoringApi.getProjectStatistics(projectId);
            return response.data;
        } catch (error) {
            errors.value.push(error);
            console.error('Error fetching project statistics:', error);
            return {};
        } finally {
            loading.value = false;
        }
    }

    function setCurrentProject(project) {
        currentProject.value = project;
    }

    function setCurrentDevice(device) {
        currentDevice.value = device;
    }

    function clearErrors() {
        errors.value = [];
    }

    // Initialize data based on user role
    async function initialize() {
        clearErrors();
        initLoading.value = true;
        try {
            await fetchDevices();
            if (userRole === 'builder') {
                await fetchProjects();
            }
        } finally {
            initLoading.value = false;
        }
    }

    return {
        // State
        devices,
        projects,
        analytics,
        currentProject,
        currentDevice,
    loading,
    initLoading,
    analyticsLoading,
        errors,
        userRole,
        userId,
        
        // Computed
        devicesCount,
        onlineDevicesCount,
        offlineDevicesCount,
        projectsCount,
        activeProjectsCount,
        totalUnits,
        occupiedUnits,
        occupancyRate,
        devicesByType,
        
        // Actions
        fetchDevices,
        fetchProjects,
        fetchAnalytics,
        fetchOwnerStatistics,
        fetchProjectStatistics,
        setCurrentProject,
        setCurrentDevice,
        clearErrors,
        initialize
    };
});