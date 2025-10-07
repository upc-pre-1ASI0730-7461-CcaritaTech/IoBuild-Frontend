export class Project {
    constructor({
                    id = null,
                    name = "",
                    builderId = null,
                    progressPercent = 0,
                    status = "planned",
                    lastUpdatedAt = "",
                    location = "",
                    description = "",
                    budget = null
                }) {
        this.id = id;
        this.name = name;
        this.builderId = builderId;
        this.progressPercent = progressPercent;
        this.status = status;
        this.lastUpdatedAt = lastUpdatedAt;
        this.location = location;
        this.description = description;
        this.budget = budget;
    }
}
