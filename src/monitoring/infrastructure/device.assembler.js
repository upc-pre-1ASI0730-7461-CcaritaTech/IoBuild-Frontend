import { Device } from '../domain/model/device.entity.js';

export class DeviceAssembler {
    static toEntityFromResponse(response) {
        return Device.fromApiResponse(response.data);
    }

    static toEntitiesFromResponse(response) {
        // response.data is array of devices
        return response.data.map(device => Device.fromApiResponse(device));
    }

    static fromDeviceAndConfig(deviceObj, configObj) {
        // configObj may be undefined or an array (from /device_configurations?deviceId=xx)
        const cfg = Array.isArray(configObj) ? (configObj[0] || null) : configObj;
        return Device.fromApiResponse(deviceObj, cfg);
    }

    static toResourceFromEntity(device) {
        return {
            id: device.id,
            name: device.name,
            type: device.type,
            status: device.status,
            location: device.location,
            value: device.value,
            unit: device.unit,
            lastUpdate: device.lastUpdate ? device.lastUpdate.toISOString() : null,
            projectId: device.projectId
        };
    }
}