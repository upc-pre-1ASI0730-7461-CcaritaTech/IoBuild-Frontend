export class Project {
    constructor(id = 0, name = '', description = '', location = '', totalUnits = 0, occupiedUnits = 0, status = 'active', builderId = 0, createdDate = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.totalUnits = totalUnits;
        this.occupiedUnits = occupiedUnits;
        this.status = status;
        this.builderId = builderId;
        this.createdDate = createdDate;
    }

    static fromApiResponse(data) {
        return new Project(
            data.id,
            data.name,
            data.description,
            data.location,
            data.totalUnits,
            data.occupiedUnits,
            data.status,
            data.builderId,
            new Date(data.createdDate)
        );
    }

    getOccupancyRate() {
        return this.totalUnits > 0 ? (this.occupiedUnits / this.totalUnits) * 100 : 0;
    }

    getAvailableUnits() {
        return this.totalUnits - this.occupiedUnits;
    }

    getStatusColor() {
        switch(this.status) {
            case 'active': return '#4CAF50';
            case 'construction': return '#FF9800';
            case 'completed': return '#2196F3';
            case 'paused': return '#F44336';
            default: return '#9E9E9E';
        }
    }
}