import { Subscription } from "../domain/model/subscription.entity.js";

/**
 * Subscription Assembler
 * Handles the conversion between API resources and Subscription entities
 */
export class SubscriptionAssembler {
    /**
     * Convert API resource to Subscription entity
     */
    static toEntityFromResource(resource) {
        return new Subscription({
            id: resource.id,
            builderId: resource.builderId,
            plan: resource.plan,
            status: resource.status,
            startDate: resource.startDate,
            endDate: resource.endDate,
            price: resource.price || 0,
            features: resource.features || []
        });
    }

    /**
     * Convert API response to Subscription entity
     */
    static toEntityFromResponse(response) {
        if (!response.data) return null;
        return this.toEntityFromResource(response.data);
    }

    /**
     * Convert Subscription entity to API resource
     */
    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            builderId: entity.builderId,
            plan: entity.plan,
            status: entity.status,
            startDate: entity.startDate,
            endDate: entity.endDate,
            price: entity.price,
            features: entity.features
        };
    }
}
