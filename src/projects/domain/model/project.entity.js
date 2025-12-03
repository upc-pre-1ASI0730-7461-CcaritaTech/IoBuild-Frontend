/**
 * Domain entity representing a real estate project.
 */
export class Project {
    /**
     * Creates a new Project instance.
     * @param {Object} params - Project configuration params.
     * @param {number|null} params.id - Unique identifier.
     * @param {string} params.name - Project name.
     * @param {string} params.description - Project description.
     * @param {string} params.location - Project location.
     * @param {number} params.totalUnits - Total units.
     * @param {number} params.occupiedUnits - Occupied units.
     * @param {string} params.status - Project status.
     * @param {number} params.builderId - Builder ID.
     * @param {string|null} params.createdDate - Creation date.
     * @param {string} params.imageUrl - Project image URL.
     */
    constructor({
                    id = null,
                    name = "",
                    description = "",
                    location = "",
                    totalUnits = 0,
                    occupiedUnits = 0,
                    status = "active",
                    builderId = 1,
                    createdDate = null,
                    imageUrl = "",
                }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.totalUnits = totalUnits;
        this.occupiedUnits = occupiedUnits;
        this.status = status;
        this.builderId = builderId;
        this.createdDate = createdDate;
        this.imageUrl = imageUrl;
    }
}
