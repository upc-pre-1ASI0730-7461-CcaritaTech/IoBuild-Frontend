import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const projectsEndpointPath = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;

/**
 * API service for managing projects.
 * @extends BaseApi
 */
export class ProjectApi extends BaseApi {
    #projectsEndpoint;

    /**
     * Creates a new ProjectApi instance.
     * Initializes the projects endpoint with the configured route.
     */
    constructor() {
        super();
        this.#projectsEndpoint = new BaseEndpoint(this, projectsEndpointPath);
    }

    /**
     * Retrieves all projects belonging to a specific builder.
     * @async
     * @param {number} builderId - Builder identifier.
     * @returns {Promise} Promise with list of projects.
     */
    async getProjectsByBuilderId(builderId) {
        const response = await this.#projectsEndpoint.getAll();
        const allProjects = response.data;
        const filtered = allProjects.filter(p => p.builderId === builderId);
        return { data: filtered };
    }

    /**
     * Retrieves a specific project by its ID.
     * @async
     * @param {number} id - Project identifier.
     * @returns {Promise} Promise with project data.
     */
    getProjectById(id) {
        return this.#projectsEndpoint.getById(id);
    }

    /**
     * Creates a new project on the server.
     * @async
     * @param {Project} resource - New project data.
     * @returns {Promise} Promise with created project response.
     */
    createProject(resource) {
        return this.#projectsEndpoint.create(resource);
    }

    /**
     * Updates an existing project.
     * @async
     * @param {Project} resource - Project data to update.
     * @returns {Promise} Promise with updated project.
     */
    updateProject(resource) {
        return this.#projectsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a specific project by its ID.
     * @async
     * @param {number} id - Project identifier to delete.
     * @returns {Promise} Promise with deletion response.
     */
    deleteProject(id) {
        return this.#projectsEndpoint.delete(id);
    }
}
