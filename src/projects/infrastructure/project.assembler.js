import { Project } from "../domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntityFromResource(resource) {
        return new Project({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        const resources = response.data || [];
        return resources.map((r) => this.toEntityFromResource(r));
    }
}
