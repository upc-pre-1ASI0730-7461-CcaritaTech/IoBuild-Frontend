import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SubscriptionApi } from "../infrastructure/subscription-api.js";
import { SubscriptionAssembler } from "../infrastructure/subscription.assembler.js";
import { Plan } from "../domain/model/plan.entity.js";

const subscriptionApi = new SubscriptionApi();

export const useSubscriptionStore = defineStore("subscriptions", () => {
    const currentSubscription = ref(null);
    const availablePlans = ref([]);
    const errors = ref([]);
    const isLoading = ref(false);

    // Get builderId from environment variables
    const builderId = parseInt(import.meta.env.VITE_USER_ID);

    // Initialize available plans
    const initializePlans = () => {
        availablePlans.value = [
            new Plan({
                name: 'Professional',
                price: 799,
                description: 'Ideal for medium-sized projects',
                features: [
                    'Up to 200 IoT devices',
                    'Advanced dashboard',
                    '24/7 priority support',
                    'Updates and new features',
                    '3 administrators',
                    'Real-time reports',
                    'Custom API',
                    'Training included',
                ],
                maxDevices: 200,
                maxAdministrators: 3,
                supportLevel: '24/7 priority',
                hasAPI: true,
                hasAnalytics: true
            }),
            new Plan({
                name: 'Starter',
                price: 299,
                description: 'Perfect for small projects',
                features: [
                    'Up to 50 IoT devices',
                    'Basic dashboard',
                    'Email support',
                    'Updates included',
                    '1 administrator',
                    'Monthly reports',
                ],
                maxDevices: 50,
                maxAdministrators: 1,
                supportLevel: 'Email',
                hasAPI: false,
                hasAnalytics: false
            }),
            new Plan({
                name: 'Enterprise',
                price: 1299,
                description: 'For big developments',
                features: [
                    'Unlimited IoT devices',
                    'Enterprise dashboard',
                    'Dedicated 24/7 support',
                    'Development of custom features',
                    'Unlimited administrators',
                    'Advanced analytics',
                    'Complete API',
                    'Specialized consulting',
                    'Guaranteed SLA',
                ],
                maxDevices: -1, // Unlimited
                maxAdministrators: -1, // Unlimited
                supportLevel: 'Dedicated 24/7',
                hasAPI: true,
                hasAnalytics: true
            })
        ];
    };

    const currentPlan = computed(() => {
        if (!currentSubscription.value) return null;
        return availablePlans.value.find(plan =>
            plan.name === currentSubscription.value.plan
        );
    });

    const otherPlans = computed(() => {
        if (!currentSubscription.value) return availablePlans.value;
        return availablePlans.value.filter(plan =>
            plan.name !== currentSubscription.value.plan
        );
    });

    function fetchCurrentSubscription() {
        isLoading.value = true;
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

    function changePlan(newPlan) {
        if (!currentSubscription.value) return Promise.reject('No current subscription');

        isLoading.value = true;
        const updatedSubscription = {
            ...currentSubscription.value,
            plan: newPlan.name,
            price: newPlan.price
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

    // Initialize plans on store creation
    initializePlans();

    return {
        currentSubscription,
        availablePlans,
        currentPlan,
        otherPlans,
        errors,
        isLoading,
        fetchCurrentSubscription,
        renewSubscription,
        cancelSubscription,
        changePlan,
    };
});

export default useSubscriptionStore;
