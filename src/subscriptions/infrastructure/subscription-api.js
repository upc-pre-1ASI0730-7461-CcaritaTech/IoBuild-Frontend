import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const subscriptionsEndpointPath = import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH;

export class SubscriptionApi extends BaseApi {
    #subscriptionsEndpoint;

    constructor() {
        super();
        this.#subscriptionsEndpoint = new BaseEndpoint(this, subscriptionsEndpointPath);
    }

    async getSubscriptionByBuilderId(builderId) {
        const response = await this.#subscriptionsEndpoint.getAll();
        const allSubscriptions = response.data;
        const filtered = allSubscriptions.find(s => s.builderId === builderId);
        return { data: filtered };
    }

    getSubscriptionById(id) {
        return this.#subscriptionsEndpoint.getById(id);
    }

    createSubscription(resource) {
        return this.#subscriptionsEndpoint.create(resource);
    }

    updateSubscription(resource) {
        return this.#subscriptionsEndpoint.update(resource.id, resource);
    }

    renewSubscription(subscriptionId) {
        // Simulate renew operation - in real app this would call a specific endpoint
        return this.updateSubscription({
            id: subscriptionId,
            status: 'active',
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        });
    }

    cancelSubscription(subscriptionId) {
        // Simulate cancel operation - in real app this would call a specific endpoint
        return this.updateSubscription({
            id: subscriptionId,
            status: 'cancelled'
        });
    }
}
