/**
 * Subscription Entity
 * Represents a subscription with its plan details
 */
export class Subscription {
    constructor({
        id = 0,
        builderId = 0,
        plan = '',
        status = '',
        startDate = null,
        endDate = null,
        price = 0,
        features = []
    }) {
        this.id = id;
        this.builderId = builderId;
        this.plan = plan;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
        this.features = features;
    }

    /**
     * Check if subscription is active
     */
    isActive() {
        return this.status === 'active';
    }

    /**
     * Get formatted price
     */
    getFormattedPrice() {
        return `$${this.price}`;
    }
}
