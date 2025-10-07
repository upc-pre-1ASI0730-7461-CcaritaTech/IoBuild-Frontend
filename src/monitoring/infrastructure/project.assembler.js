import { Project } from '../domain/model/project.entity.js';

export class ProjectAssembler {
    static toEntityFromResponse(response) {
        return Project.fromApiResponse(response.data);
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(project => Project.fromApiResponse(project));
    }

    static toResourceFromEntity(project) {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            location: project.location,
            totalUnits: project.totalUnits,
            occupiedUnits: project.occupiedUnits,
            status: project.status,
            builderId: project.builderId,
            createdDate: project.createdDate ? project.createdDate.toISOString() : null
        };
    }
}