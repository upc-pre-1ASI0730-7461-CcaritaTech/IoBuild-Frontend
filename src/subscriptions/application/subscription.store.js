import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SubscriptionApi } from "../infrastructure/subscription-api.js";
import { SubscriptionAssembler } from "../infrastructure/subscription.assembler.js";
import { PlanApi } from "../infrastructure/plan-api.js";
import { PlanAssembler } from "../infrastructure/plan.assembler.js";
import { IamFacade } from "../infrastructure/iam.facade.js";

const subscriptionApi = new SubscriptionApi();
const planApi = new PlanApi();

/**
 * Pinia store for subscription functionality.
 * Manages current subscription and available plans, including renew/cancel/change operations.
 */
export const useSubscriptionStore = defineStore("subscriptions", () => {
    // State
    const currentSubscription = ref(null);
    const availablePlans = ref([]);
    const errors = ref([]);
    const isLoading = ref(false);

    // Helper
    /**
     * Gets the builder id from the authenticated user via IamFacade.
     * @returns {string|number} Builder user id.
     * @throws Will throw if the facade cannot provide the id.
     */
    const getBuilderId = () => {
        try {
            return IamFacade.getCurrentUserId();
        } catch (error) {
            console.error('[SubscriptionStore] Error getting user ID:', error);
            throw error;
        }
    };

    // Actions
    /**
     * Fetches available plans from the API and maps them to entities.
     * @returns {Promise<void>} Resolves when plans have been fetched.
     */
    function fetchAvailablePlans() {
        isLoading.value = true;
        return planApi
            .getAllPlans()
            .then((response) => {
                if (response.data) {
                    availablePlans.value = PlanAssembler.toEntitiesFromResourceArray(response.data);
                }
                isLoading.value = false;
            })
            .catch((error) => {
                errors.value.push(error);
                isLoading.value = false;
            });
    }

    // Getters / Computed
    /**
     * Computed current plan from the current subscription.
     * @returns {Object|null} The current plan or null.
     */
    const currentPlan = computed(() => {
        if (!currentSubscription.value || !currentSubscription.value.plan) return null;
        return currentSubscription.value.plan;
    });

    /**
     * Computed list of other plans excluding the current plan.
     * @returns {Array<Object>} Array of plan entities.
     */
    const otherPlans = computed(() => {
        if (!currentSubscription.value || !currentSubscription.value.plan) return availablePlans.value;
        return availablePlans.value.filter(plan =>
            plan.id !== currentSubscription.value.plan.id
        );
    });

    /**
     * Fetches the current subscription for the builder from the API.
     * @returns {Promise<void>} Resolves when the subscription has been fetched.
     */
    function fetchCurrentSubscription() {
        isLoading.value = true;
        const builderId = getBuilderId();
        return subscriptionApi
            .getSubscriptionByBuilderId(builderId)
            .then((response) => {
                if (response.data) {
                    currentSubscription.value = SubscriptionAssembler.toEntityFromResponse(response);
                }
                isLoading.value = false;
            })
            .catch((error) => {
                errors.value.push(error);
                isLoading.value = false;
            });
    }

    /**
     * Renews the current subscription.
     * @returns {Promise<void>} Resolves when renewal and refresh complete.
     */
    function renewSubscription() {
        if (!currentSubscription.value) return Promise.reject('No current subscription');

        isLoading.value = true;
        return subscriptionApi
            .renewSubscription(currentSubscription.value.id)
            .then(() => {
                // Refresh current subscription
                return fetchCurrentSubscription();
            })
            .catch((error) => {
                errors.value.push(error);
                isLoading.value = false;
                throw error;
            });
    }

    /**
     * Cancels the current subscription.
     * @returns {Promise<void>} Resolves when cancellation and refresh complete.
     */
    function cancelSubscription() {
        if (!currentSubscription.value) return Promise.reject('No current subscription');

        isLoading.value = true;
        return subscriptionApi
            .cancelSubscription(currentSubscription.value.id)
            .then(() => {
                // Refresh current subscription
                return fetchCurrentSubscription();
            })
            .catch((error) => {
                errors.value.push(error);
                isLoading.value = false;
                throw error;
            });
    }

    /**
     * Changes the plan on the current subscription.
     * @param {Object} newPlan - New plan entity to set on the subscription.
     * @returns {Promise<void>} Resolves when update and refresh complete.
     */
    function changePlan(newPlan) {
        if (!currentSubscription.value) return Promise.reject('No current subscription');

        isLoading.value = true;
        const updatedSubscription = {
            ...currentSubscription.value,
            plan: newPlan,
            status: 'active'
        };

        return subscriptionApi
            .updateSubscription(SubscriptionAssembler.toResourceFromEntity(updatedSubscription))
            .then(() => {
                // Refresh current subscription
                return fetchCurrentSubscription();
            })
            .catch((error) => {
                errors.value.push(error);
                isLoading.value = false;
                throw error;
            });
    }


    return {
        currentSubscription,
        availablePlans,
        currentPlan,
        otherPlans,
        errors,
        isLoading,
        fetchCurrentSubscription,
        fetchAvailablePlans,
        renewSubscription,
        cancelSubscription,
        changePlan
    };
});

export default useSubscriptionStore;
