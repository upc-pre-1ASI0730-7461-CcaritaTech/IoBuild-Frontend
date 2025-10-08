<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import useSubscriptionStore from "../../application/subscription.store.js";
import PlanCard from "../components/plan-card.vue";
import CurrentPlanCard from "../components/current-plan-card.vue";

const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
const store = useSubscriptionStore();

onMounted(() => {
  store.fetchCurrentSubscription();
});

const handleRenewPlan = () => {
  confirm.require({
    message: t("subscriptions.confirm-renew"),
    header: t("subscriptions.renew-header"),
    icon: "pi pi-check-circle",
    acceptClass: "p-button-success",
    accept: async () => {
      try {
        await store.renewSubscription();
        toast.add({
          severity: "success",
          summary: t("subscriptions.success"),
          detail: t("subscriptions.renewed-successfully"),
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: t("subscriptions.error"),
          detail: t("subscriptions.renew-failed"),
          life: 3000,
        });
      }
    },
  });
};

const handleCancelPlan = () => {
  confirm.require({
    message: t("subscriptions.confirm-cancel"),
    header: t("subscriptions.cancel-header"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await store.cancelSubscription();
        toast.add({
          severity: "success",
          summary: t("subscriptions.success"),
          detail: t("subscriptions.cancelled-successfully"),
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: t("subscriptions.error"),
          detail: t("subscriptions.cancel-failed"),
          life: 3000,
        });
      }
    },
  });
};

const handleChangePlan = (plan) => {
  confirm.require({
    message: t("subscriptions.confirm-change", { planName: plan.name }),
    header: t("subscriptions.change-header"),
    icon: "pi pi-info-circle",
    accept: async () => {
      try {
        await store.changePlan(plan);
        toast.add({
          severity: "success",
          summary: t("subscriptions.success"),
          detail: t("subscriptions.plan-changed", { planName: plan.name }),
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: t("subscriptions.error"),
          detail: t("subscriptions.change-failed"),
          life: 3000,
        });
      }
    },
  });
};
</script>

<template>
  <div class="subscription-container">
    <!-- Header -->
    <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
      {{ t("subscriptions.title") }}
    </h1>
    <p class="text-lg font-semibold text-gray-800 mb-8">
      {{ t("subscriptions.current-plan") }}:
      <span class="text-black font-bold">{{ store.currentPlan?.name || 'N/A' }}</span>
    </p>

    <!-- Loading state -->
    <div v-if="store.isLoading" class="flex justify-center items-center py-8">
      <pv-progress-spinner />
    </div>

    <!-- Main content -->
    <div v-else-if="store.currentPlan" class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <!-- Current Plan - Ocupa más espacio (3 columnas de 5) -->
      <div class="lg:col-span-3">
        <CurrentPlanCard
          :plan="store.currentPlan"
          :subscription="store.currentSubscription"
          @renew="handleRenewPlan"
          @cancel="handleCancelPlan"
        />
      </div>

      <div class="lg:col-span-2 flex flex-col items-center">
        <div class="border border-green-500 text-green-600 font-semibold px-6 py-2 rounded-full mb-6">
          {{ t("subscriptions.change-plan") }}
        </div>

        <div class="flex flex-col gap-6 w-full">
          <PlanCard
            v-for="plan in store.otherPlans"
            :key="plan.name"
            :plan="plan"
            @select="handleChangePlan"
          />
        </div>
      </div>
    </div>

    <!-- No subscription state -->
    <div v-else class="text-center py-8">
      <p class="text-gray-500 mb-4">{{ t("subscriptions.no-subscription") }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlanCard
          v-for="plan in store.availablePlans"
          :key="plan.name"
          :plan="plan"
          @select="handleChangePlan"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-container {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e6fffa 100%);
}

li {
  line-height: 1.5rem;
}
</style>
