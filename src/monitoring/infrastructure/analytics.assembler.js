import { Analytics } from '../domain/model/analytics.entity.js';

export class AnalyticsAssembler {
    static toEntityFromResponse(response) {
        return Analytics.fromApiResponse(response.data);
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(analytics => Analytics.fromApiResponse(analytics));
    }

    static toResourceFromEntity(analytics) {
        return {
            id: analytics.id,
            deviceId: analytics.deviceId,
            timestamp: analytics.timestamp ? analytics.timestamp.toISOString() : null,
            value: analytics.value,
            type: analytics.type,
            metadata: analytics.metadata
        };
    }
}