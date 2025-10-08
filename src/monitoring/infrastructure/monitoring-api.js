import { BaseApi } from '../../shared/infrastructure/base-api.js';

export class MonitoringApi extends BaseApi {
    constructor() {
        super();
    }

    // Device endpoints
    getDevices() {
        return this.http.get('/devices');
    }

    getDeviceById(id) {
        return this.http.get(`/devices/${id}`);
    }

    getDevicesByProject(projectId) {
        return this.http.get(`/projects/${projectId}/devices`);
    }

    getDevicesByOwner(ownerId) {
        return this.http.get(`/owners/${ownerId}/devices`);
    }

    // Project endpoints
    getProjects() {
        return this.http.get('/projects');
    }

    getProjectById(id) {
        return this.http.get(`/projects/${id}`);
    }

    getProjectsByBuilder(builderId) {
        return this.http.get(`/builders/${builderId}/projects`);
    }

    // Analytics endpoints
    // Accepts either (deviceId, timeRange) or (filtersObject)
    getAnalytics(deviceIdOrFilters, timeRange = '24h') {
        if (deviceIdOrFilters && typeof deviceIdOrFilters === 'object') {
            // generic analytics query: /analytics?deviceId=...&type=...
            return this.http.get('/analytics', {
                params: deviceIdOrFilters
            });
        }

        // device-specific analytics
        return this.http.get(`/devices/${deviceIdOrFilters}/analytics`, {
            params: { timeRange }
        });
    }

    getAggregatedAnalytics(projectId, type, timeRange = '24h') {
        return this.http.get(`/projects/${projectId}/analytics/aggregated`, {
            params: { type, timeRange }
        });
    }

    getOwnerAnalytics(ownerId, timeRange = '24h') {
        return this.http.get(`/owners/${ownerId}/analytics`, {
            params: { timeRange }
        });
    }

    // Real-time monitoring
    getDeviceStatus(deviceId) {
        return this.http.get(`/devices/${deviceId}/status`);
    }

    // Device configuration (moved to separate collection)
    getDeviceConfiguration(deviceId) {
        return this.http.get('/device_configurations', { params: { deviceId } });
    }

    getProjectStatistics(projectId) {
        return this.http.get(`/projects/${projectId}/statistics`);
    }

    getOwnerStatistics(ownerId) {
        return this.http.get(`/owners/${ownerId}/statistics`);
    }
}