import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const subscriptionsEndpointPath = import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH;

/**
 * Subscription API client.
 * Exposes methods to manage subscriptions and payments.
 */
export class SubscriptionApi extends BaseApi {
    #subscriptionsEndpoint;

    constructor() {
        super();
        this.#subscriptionsEndpoint = new BaseEndpoint(this, subscriptionsEndpointPath);
    }

    /**
     * Fetches the subscription for a builder by their ID.
     * @param {string|number} builderId
     * @returns {Promise<{data: Object|null}>}
     */
    async getSubscriptionByBuilderId(builderId) {
        const response = await this.#subscriptionsEndpoint.getAll();
        const allSubscriptions = response.data;
        const filtered = allSubscriptions.find(s => s.builderId === builderId);
        return { data: filtered };
    }

    /**
     * Gets a subscription by its ID.
     * @param {string|number} id
     * @returns {Promise}
     */
    getSubscriptionById(id) {
        return this.#subscriptionsEndpoint.getById(id);
    }

    /**
     * Creates a subscription resource.
     * @param {Object} resource
     * @returns {Promise}
     */
    createSubscription(resource) {
        return this.#subscriptionsEndpoint.create(resource);
    }

    /**
     * Updates a subscription resource.
     * @param {Object} resource
     * @returns {Promise}
     */
    updateSubscription(resource) {
        return this.#subscriptionsEndpoint.update(resource.id, resource);
    }

    /**
     * Renews a subscription (sets status active and extends endDate ~1 year).
     * @param {string|number} subscriptionId
     * @returns {Promise}
     */
    renewSubscription(subscriptionId) {

        return this.updateSubscription({
            id: subscriptionId,
            status: 'active',
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        });
    }

    /**
     * Cancels a subscription (sets status cancelled).
     * @param {string|number} subscriptionId
     * @returns {Promise}
     */
    cancelSubscription(subscriptionId) {

        return this.updateSubscription({
            id: subscriptionId,
            status: 'cancelled'
        });
    }

    /**
     * Retrieves previous invoices for a subscription.
     * @param {string|number} subscriptionId
     * @returns {Promise}
     */
    async getPreviousInvoicesBySubscriptionId(subscriptionId) {

        return this.http.get(`${subscriptionsEndpointPath}/${subscriptionId}/invoices`);
    }

    /**
     * Creates a checkout session for payments (backend expects success/cancel URLs).
     * @param {string|number} builderId
     * @param {string|number} planId
     * @returns {Promise}
     */
    createCheckoutSession(builderId, planId) {
        // Backend expects success and cancel URLs; Stripe will append session_id.
        const baseUrl = window.location.origin;
        const successUrl = `${baseUrl}/subscriptions/my-subscription?success=true`;
        const cancelUrl = `${baseUrl}/subscriptions/my-subscription?canceled=true`;

        return this.http.post(`${subscriptionsEndpointPath}/payments/create-session`, {
            builderId,
            planId,
            successUrl,
            cancelUrl
        });
    }

    /**
     * Confirms a payment using session id.
     * @param {string|number} builderId
     * @param {string} sessionId
     * @returns {Promise}
     */
    confirmPayment(builderId, sessionId) {
        return this.http.post(`${subscriptionsEndpointPath}/payments/confirm`, {
            builderId,
            sessionId
        });
    }
}
