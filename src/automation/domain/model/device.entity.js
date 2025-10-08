export class Device {
  constructor(id, name, type, location, projectId, status = 'Online') {
    this.id = id;
    this.name = name;
    this.type = type; // canonical code (e.g., temperature, energy)
    this.location = location;
    this.projectId = projectId;
    this.status = status;
  }

  isOnline() {
    return this.status === 'Online';
  }

  toggleStatus() {
    this.status = this.status === 'Online' ? 'Offline' : 'Online';
  }
}
