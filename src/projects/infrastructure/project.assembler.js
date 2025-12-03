import { Project } from "../domain/model/project.entity.js";

/**
 * Assembler class for converting project resources to entities.
 */
export class ProjectAssembler {
    /**
     * Converts a project resource to a project entity.
     * @static
     * @param {Object} resource - Project resource.
     * @returns {Project} Assembled Project entity.
     */
    static toEntityFromResource(resource) {
        return new Project({ ...resource });
    }

    /**
     * Converts an API response to an array of Project entities.
     * @static
     * @param {Object} response - API response object.
     * @param {number} [response.status] - HTTP status code.
     * @param {string} [response.statusText] - HTTP status text.
     * @param {Array} response.data - Array of project resources.
     * @returns {Project[]} Array of converted Project entities.
     */
    static toEntitiesFromResponse(response) {
        if (!response || (!response.status && !response.data)) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        const resources = response.data || [];
        return resources.map((r) => this.toEntityFromResource(r));
    }
}
