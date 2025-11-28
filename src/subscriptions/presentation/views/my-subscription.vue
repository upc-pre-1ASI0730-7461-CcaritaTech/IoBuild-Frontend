<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import useSubscriptionStore from "../../application/subscription.store.js";
import PlanCard from "../components/plan-card.vue";
import CurrentPlanCard from "../components/current-plan-card.vue";
import PreviousInvoicesModal from "../components/previous-invoices-modal.vue";
import { SubscriptionApi } from "../../infrastructure/subscription-api.js";

const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
const store = useSubscriptionStore();
const subscriptionApi = new SubscriptionApi();

const showInvoices = ref(false);
const invoices = ref([]);
const invoicesLoading = ref(false);
const invoicesError = ref("");

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


const openInvoices = async () => {
  if (!store.currentSubscription) return;
  invoices.value = [];
  invoicesError.value = "";
  invoicesLoading.value = true;
  showInvoices.value = true;
  try {
    const resp = await subscriptionApi.getPreviousInvoicesBySubscriptionId(store.currentSubscription.id);
    const rows = Array.isArray(resp.data) ? resp.data : resp.data?.data || [];
    invoices.value = rows.map(inv => ({
      id: inv.id,
      period: inv.period || '',
      date: inv.dueDate || inv.date || null,
      dueDate: inv.dueDate || inv.date || null,
      billingStart: inv.billingStart || null,
      billingEnd: inv.billingEnd || null,
      status: inv.status || 'paid',
      currency: inv.currency || '$',
      amount: inv.amount || 0,
      downloadUrl: inv.downloadUrl || '#'
    })).filter(i => i.id);
  } catch (e) {
    invoicesError.value = e?.message || t('subscriptions.change-failed');
  } finally {
    invoicesLoading.value = false;
  }
};

const closeInvoices = () => {
  showInvoices.value = false;
};
</script>

<template>
  <div class="subscription-container">

    <div class="header-row">
      <div class="header-left">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1">
          {{ t("subscriptions.title") }}
        </h1>
        <p class="text-lg font-semibold text-gray-800">
          {{ t("subscriptions.current-plan") }}:
          <span class="text-black font-bold">{{ store.currentPlan?.name || 'N/A' }}</span>
        </p>
      </div>
      <div class="header-right">
        <pv-button :label="t('subscriptions.previous-invoices-button')" class="p-button-sm invoices-btn" @click="openInvoices" :disabled="!store.currentSubscription" />
      </div>
    </div>

    <div v-if="store.isLoading" class="flex justify-center items-center py-8">
      <pv-progress-spinner />
    </div>


    <div v-else-if="store.currentPlan" class="subscription-layout">

      <div class="current-plan-section">
        <CurrentPlanCard
          :plan="store.currentPlan"
          :subscription="store.currentSubscription"
          @renew="handleRenewPlan"
          @cancel="handleCancelPlan"
        />
      </div>

      <!-- Change Plan Section - Lado derecho -->
      <div class="change-plan-section">
        <div class="change-plan-header bg-white border border-green-500 text-green-600 font-semibold px-6 py-4 rounded-xl mb-6 text-center shadow-sm">
          {{ t("subscriptions.change-plan") }}
        </div>

        <!-- Plan Cards debajo del título -->
        <div class="plan-cards-container">
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

    <!-- Modal de facturas anteriores -->
    <PreviousInvoicesModal
      :visible="showInvoices"
      :invoices="invoices"
      :loading="invoicesLoading"
      :error="invoicesError"
      @close="closeInvoices"
    />
  </div>
</template>

<style scoped>
.subscription-container {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e6fffa 100%);
  max-width: 1400px;
  margin: 0 auto;
}

li {
  line-height: 1.5rem;
}

/* Header row con botón a la derecha */
.header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.header-left p { margin-bottom: 0.5rem; }
.invoices-btn { white-space: nowrap; }
/* Forzar texto blanco del label del botón de PrimeVue */
:deep(.invoices-btn .p-button-label) { color: #ffffff !important; }

.subscription-layout {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
}

.current-plan-section {
  flex: 0 0 auto;
  width: 40%;
  max-width: 650px;
}

.change-plan-section {
  flex: 0 0 auto;
  width: 45%;
  max-width: 550px;
}
.change-plan-header {
  justify-self: center;
  border-radius: 10px;
}

.plan-cards-container {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-box-pack: justify;
  gap: 1rem;
  width: 100%;
}

/* Media queries para responsividad */

/* Tablets en landscape (máx. 1200px) */
@media (max-width: 1200px) {
  .subscription-container {
    padding: 1.5rem;
  }

  .subscription-layout {
    gap: 1.5rem;
    justify-content: space-between;
  }


  .change-plan-section {
    flex: 1;
    max-width: 45%;
    min-width: 280px;
  }

  .plan-cards-container {
    gap: 0.75rem;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: justify;
  }
}

/* Tablets en portrait (máx. 1024px) */
@media (max-width: 1024px) {
  .subscription-container {
    padding: 1.5rem;
  }

  .subscription-layout {
    gap: 1.5rem;
    justify-content: center;
  }

  .current-plan-section {
    flex: 1;
    max-width: 60%;
    min-width: 300px;
  }

  .change-plan-section {
    flex: 1;
    max-width: 40%;
    min-width: 250px;
  }

  .plan-cards-container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    gap: 1rem;
  }
}

/* Móviles grandes y tablets pequeñas (máx. 768px) */
@media (max-width: 768px) {
  .subscription-container {
    padding: 1rem;
    text-align: center;
  }

  .header-row {
    flex-direction: column;
    align-items: center;
  }

  /* Cambiar a layout vertical */
  .subscription-layout {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .current-plan-section,
  .change-plan-section {
    flex: none;
    width: 100%;
    max-width: 500px;
    min-width: auto;
  }

  .plan-cards-container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-align: center;
    gap: 1.5rem;
    width: 100%;
  }

  /* Ajustar títulos para móvil */
  .subscription-container h1 {
    font-size: 2rem;
    text-align: center;
  }

  .subscription-container p {
    font-size: 1rem;
    text-align: center;
  }

  .change-plan-header {
    font-size: 0.95rem;
    padding: 0.75rem 1.25rem;
  }
}

/* Móviles pequeños (máx. 480px) */
@media (max-width: 480px) {
  .subscription-container {
    padding: 0.75rem;
  }

  .subscription-layout {
    gap: 1.5rem;
  }

  .plan-cards-container {
    gap: 1rem;
  }

  /* Títulos más pequeños en móviles */
  .subscription-container h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .subscription-container p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .change-plan-header {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
  }
}

/* Ajustes específicos para las tarjetas en móvil */
@media (max-width: 768px) {
  :deep(.current-plan-card) {
    transform: scale(1) !important;
    max-width: 100% !important;
    margin: 0 !important;
  }
}

/* Pantallas muy anchas (min. 1400px) */
@media (min-width: 1400px) {
  .subscription-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .subscription-layout {
    gap: 3rem;
  }
}
</style>
