export class Analytics {
    constructor(id = 0, deviceId = 0, timestamp = null, value = 0, type = '', metadata = {}) {
        this.id = id;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.value = value;
        this.type = type;
        this.metadata = metadata;
    }

    static fromApiResponse(data) {
        return new Analytics(
            data.id,
            data.deviceId,
            new Date(data.timestamp),
            data.value,
            data.type,
            data.metadata || {}
        );
    }

    getFormattedTimestamp() {
        return this.timestamp ? this.timestamp.toLocaleString() : '';
    }

    getFormattedValue() {
        switch(this.type) {
            case 'temperature':
                return `${this.value}°C`;
            case 'humidity':
                return `${this.value}%`;
            case 'energy':
                return `${this.value} kWh`;
            case 'water':
                return `${this.value} L`;
            default:
                return this.value.toString();
        }
    }
}