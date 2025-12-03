import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ProjectApi } from "../infrastructure/project-api.js";
import { ProjectAssembler } from "../infrastructure/project.assembler.js";

const projectApi = new ProjectApi();

/**
 * Pinia store for managing project state and operations.
 * Handles all project-related state management including CRUD operations.
 */
export const useProjectStore = defineStore("projects", () => {
    const projects = ref([]);
    const errors = ref([]);
    const projectsLoaded = ref(false);
    const builderId = 1;
    const projectsCount = computed(() => (projectsLoaded ? projects.value.length : 0));

    /**
     * Fetches all projects belonging to the current builder from the API.
     * @async
     * @returns {Promise}
     */
    function fetchProjects() {
        return projectApi
            .getProjectsByBuilderId(builderId)
            .then((response) => {
                projects.value = ProjectAssembler.toEntitiesFromResponse(response);
                projectsLoaded.value = true;
            })
            .catch((error) => {
                errors.value.push(error);
            });
    }

    /**
     * Returns a project by its ID.
     * @param {string|number} id - Project identifier.
     * @returns {Project|undefined} The project or undefined if not found.
     */
    function getProjectById(id) {
        const idInt = parseInt(id);
        return projects.value.find((p) => p.id === idInt);
    }

    /**
     * Creates a new project.
     * @async
     * @param {Project} project - Project to create.
     */
    function addProject(project) {
        projectApi
            .createProject(project)
            .then((response) => {
                const resource = response.data;
                const newProject = ProjectAssembler.toEntityFromResource(resource);
                projects.value.push(newProject);
            })
            .catch((error) => errors.value.push(error));
    }

    /**
     * Updates an existing project.
     * @async
     * @param {Project} project - Project with updated values.
     */
    function updateProject(project) {
        projectApi
            .updateProject(project)
            .then((response) => {
                const resource = response.data;
                const updated = ProjectAssembler.toEntityFromResource(resource);
                const index = projects.value.findIndex((p) => p.id === updated.id);
                if (index !== -1) projects.value[index] = updated;
            })
            .catch((error) => errors.value.push(error));
    }

    /**
     * Deletes a project.
     * @async
     * @param {Project} project - Project to delete.
     */
    function deleteProject(project) {
        return projectApi
            .deleteProject(project.id)
            .then(() => {
                const index = projects.value.findIndex((p) => p.id === project.id);
                if (index !== -1) projects.value.splice(index, 1);
                return fetchProjects();
            })
            .catch((error) => errors.value.push(error));
    }

    return {
        projects,
        errors,
        projectsLoaded,
        projectsCount,
        fetchProjects,
        getProjectById,
        addProject,
        updateProject,
        deleteProject,
    };
});

export default useProjectStore;
