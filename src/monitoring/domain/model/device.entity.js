export class Device {
    constructor(id = 0, name = '', type = '', location = '', projectId = 0, configuration = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.projectId = projectId;

        // optional configuration values
        this.status = configuration && configuration.status ? configuration.status : 'unknown';
        this.value = configuration && typeof configuration.value !== 'undefined' ? configuration.value : null;
        this.unit = configuration && configuration.unit ? configuration.unit : null;
        this.lastUpdate = configuration && configuration.lastUpdate ? new Date(configuration.lastUpdate) : null;
        this.configuration = configuration || null;
    }

    static fromApiResponse(data, configuration = null) {
        return new Device(
            data.id,
            data.name,
            data.type,
            data.location,
            data.projectId,
            configuration
        );
    }

    isOnline() {
        return this.status === 'online';
    }

    isOffline() {
        return this.status === 'offline';
    }

    getStatusColor() {
        switch(this.status) {
            case 'online': return '#4CAF50';
            case 'offline': return '#F44336';
            case 'warning': return '#FF9800';
            default: return '#9E9E9E';
        }
    }
}