<script setup>
import { onMounted, ref, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import useSubscriptionStore from "../../application/subscription.store.js";
import PlanCard from "../components/plan-card.vue";
import CurrentPlanCard from "../components/current-plan-card.vue";
import PreviousInvoicesModal from "../components/previous-invoices-modal.vue";
import { SubscriptionApi } from "../../infrastructure/subscription-api.js";

// Stripe
import { loadStripe } from "@stripe/stripe-js";

const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
const store = useSubscriptionStore();
const subscriptionApi = new SubscriptionApi();

const showInvoices = ref(false);
const invoices = ref([]);
const invoicesLoading = ref(false);
const invoicesError = ref("");

const stripeModalVisible = ref(false);
const selectedPlanForCheckout = ref(null);


const publishableKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(publishableKey);
let stripe = null;
let elements = null;
let card = null;
const cardMounted = ref(false);
const stripeError = ref("");
const isProcessing = ref(false);
const clientSecret = ref(null);


watch(stripeModalVisible, async (val) => {
  if (val) {
    stripeError.value = "";
    if (!publishableKey) {
      stripeError.value = "Falta VITE_STRIPE_PUBLISHABLE_KEY en .env";
      return;
    }
    await nextTick();
    await mountCard();
  } else {
    destroyCard();
    clientSecret.value = null;
    stripeError.value = "";
  }
});

const openStripeModal = (plan) => {
  selectedPlanForCheckout.value = plan;
  stripeModalVisible.value = true;
};

const closeStripeModal = () => {
  stripeModalVisible.value = false;

  destroyCard();
  clientSecret.value = null;
  stripeError.value = "";
};


const startStripePayment = async () => {
  try {
    isProcessing.value = true;
    const builderId = parseInt(import.meta.env.VITE_USER_ID || "1");
    const resp = await subscriptionApi.createCheckoutSession(
      builderId,
      selectedPlanForCheckout.value?.name,
      selectedPlanForCheckout.value?.price
    );


    if (resp?.data?.checkoutUrl) {
      window.location.href = resp.data.checkoutUrl;
      return;
    }

    if (resp?.data?.clientSecret) {
      clientSecret.value = resp.data.clientSecret;
      await nextTick();
      if (publishableKey) await mountCard();
      return;
    }


    stripeError.value = "No se obtuvo clientSecret ni checkoutUrl desde el servidor.";
    toast.add({ severity: "error", summary: "Error", detail: stripeError.value });
  } catch (e) {
    console.error('startStripePayment error:', e);
    const serverMessage = e?.response?.data?.message || e?.response?.data || e?.message || 'Error al conectar con el servidor';
    stripeError.value = String(serverMessage);
    toast.add({ severity: "error", summary: "Error", detail: stripeError.value });
  } finally {
    isProcessing.value = false;
  }
};
/* ===================================== */

onMounted(() => {
  store.fetchCurrentSubscription();
});

onUnmounted(() => {
  destroyCard();
});

const handleRenewPlan = () => openStripeModal(store.currentPlan);

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

const handleChangePlan = (plan) => openStripeModal(plan);

const openInvoices = async () => {
  if (!store.currentSubscription) return;
  invoices.value = [];
  invoicesError.value = "";
  invoicesLoading.value = true;
  showInvoices.value = true;

  try {
    const resp = await subscriptionApi.getPreviousInvoicesBySubscriptionId(
      store.currentSubscription.id
    );

    const rows = Array.isArray(resp.data)
      ? resp.data
      : resp.data?.data || [];

    invoices.value = rows
      .map((inv) => ({
        id: inv.id,
        period: inv.period || "",
        date: inv.dueDate || inv.date || null,
        dueDate: inv.dueDate || inv.date || null,
        billingStart: inv.billingStart || null,
        billingEnd: inv.billingEnd || null,
        status: inv.status || "paid",
        currency: inv.currency || "$",
        amount: inv.amount || 0,
        downloadUrl: inv.downloadUrl || "#",
      }))
      .filter((i) => i.id);
  } catch (e) {
    invoicesError.value = e?.message || t("subscriptions.change-failed");
  } finally {
    invoicesLoading.value = false;
  }
};

const closeInvoices = () => {
  showInvoices.value = false;
};

// ---------------- Stripe helpers ----------------
async function mountCard() {
  if (cardMounted.value) return;
  try {
    if (!stripe) {
      stripe = await stripePromise;
      if (!stripe) {
        stripeError.value = "Stripe no disponible";
        return;
      }
    }

    elements = stripe.elements();

    const style = {
      base: {
        color: "#111827",
        fontSize: "16px",
        "::placeholder": { color: "#94a3b8" },
      },
    };

    card = elements.create("card", { style, hidePostalCode: true });

    const el = document.getElementById("stripe-card-element");
    if (el) {
      card.mount(el);
      cardMounted.value = true;
      card.on("change", (ev) => {
        stripeError.value = ev.error ? ev.error.message : "";
      });
    } else {
      stripeError.value = "Elemento de tarjeta no encontrado";
    }
  } catch (err) {
    stripeError.value = err?.message || "Error al inicializar Stripe";
  }
}

function destroyCard() {
  try {
    if (card) {
      card.unmount();
      card = null;
    }
    cardMounted.value = false;
  } catch (e) {
    cardMounted.value = false;
    card = null;
  }
}

async function handleConfirmPay() {
  stripeError.value = "";
  if (!clientSecret.value) {
    stripeError.value = "No hay clientSecret disponible";
    return;
  }

  isProcessing.value = true;
  try {
    if (!stripe) {
      stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe no está inicializado");
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret.value,
      {
        payment_method: { card },
      }
    );

    if (error) throw error;

    // Pago exitoso
    toast.add({
      severity: "success",
      summary: t("subscriptions.success"),
      detail: t("subscriptions.payment-success") || "Pago realizado",
      life: 3000,
    });

    // refrescar estado
    store.fetchCurrentSubscription();
    closeStripeModal();
  } catch (e) {
    stripeError.value = e?.message || "Error al procesar el pago";
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div :class="{ 'blur-background': stripeModalVisible }">
    <div class="subscription-container">
      <div class="header-row">
        <div class="header-left">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-1">
            {{ t("subscriptions.title") }}
          </h1>
          <p class="text-lg font-semibold text-gray-800">
            {{ t("subscriptions.current-plan") }}:
            <span class="text-black font-bold">
              {{ store.currentPlan?.name || "N/A" }}
            </span>
          </p>
        </div>
        <div class="header-right">
          <pv-button
            :label="t('subscriptions.previous-invoices-button')"
            class="p-button-sm invoices-btn"
            @click="openInvoices"
            :disabled="!store.currentSubscription"
          />
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

        <div class="change-plan-section">
          <div
            class="change-plan-header bg-white border border-green-500 text-green-600 font-semibold px-6 py-4 rounded-xl mb-6 text-center shadow-sm"
          >
            {{ t("subscriptions.change-plan") }}
          </div>

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

      <div v-else class="text-center py-8">
        <p class="text-gray-500 mb-4">
          {{ t("subscriptions.no-subscription") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlanCard
            v-for="plan in store.availablePlans"
            :key="plan.name"
            :plan="plan"
            @select="handleChangePlan"
          />
        </div>
      </div>

      <PreviousInvoicesModal
        :visible="showInvoices"
        :invoices="invoices"
        :loading="invoicesLoading"
        :error="invoicesError"
        @close="closeInvoices"
      />
    </div>
  </div>

  <!-- ================= MODAL STRIPE ================ -->
  <div v-if="stripeModalVisible" class="stripe-modal-overlay">
    <div class="stripe-modal">
      <h2 class="title">Resumen de compra</h2>

      <p class="plan-name">{{ selectedPlanForCheckout?.name }}</p>

      <p class="price">
        {{ selectedPlanForCheckout?.price }} USD / mes
      </p>

      <!-- Tarjeta de Stripe montada aquí -->
      <div style="margin-top: 1rem;">
        <label class="block mb-2">Tarjeta</label>
        <div id="stripe-card-element" class="card-element" style="min-height:48px; border:1px solid #e5e7eb; padding:12px; border-radius:8px; background:#fafafa;"></div>
        <div v-if="stripeError" class="text-red-600 mt-2">{{ stripeError }}</div>
      </div>

      <button class="pay-button" @click="clientSecret ? handleConfirmPay() : startStripePayment()" :disabled="isProcessing">
        <span v-if="isProcessing">Procesando…</span>
        <span v-else>{{ clientSecret ? 'Pagar ahora' : 'Iniciar pago' }}</span>
      </button>

      <button class="close-button" @click="closeStripeModal">
        Cancelar
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ==================== BLUR ==================== */
.blur-background {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

/* ==================== MODAL ==================== */
.stripe-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.stripe-modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-out;
}

.title {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.plan-name {
  font-size: 1.3rem;
  font-weight: 600;
}

.price {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #16a34a;
  font-weight: bold;
}

.pay-button {
  margin-top: 1.5rem;
  width: 100%;
  background: #16a34a;
  color: white;
  padding: 0.9rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.close-button {
  margin-top: 1rem;
  width: 100%;
  background: #e5e7eb;
  color: black;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.card-element {
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
  }
}

/* ==================== CONTENEDOR PRINCIPAL ==================== */
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

.header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-left p {
  margin-bottom: 0.5rem;
}

.invoices-btn {
  white-space: nowrap;
}

:deep(.invoices-btn .p-button-label) {
  color: #ffffff !important;
}

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

/* ---------- MEDIA QUERIES ---------- */

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
  }
}

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

@media (max-width: 768px) {
  .subscription-container {
    padding: 1rem;
    text-align: center;
  }
  .header-row {
    flex-direction: column;
    align-items: center;
  }
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
  }
  .plan-cards-container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-align: center;
    gap: 1.5rem;
  }
  .subscription-container h1 {
    font-size: 2rem;
  }
  .subscription-container p {
    font-size: 1rem;
  }
  .change-plan-header {
    font-size: 0.95rem;
    padding: 0.75rem 1.25rem;
  }
}

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

@media (max-width: 768px) {
  :deep(.current-plan-card) {
    transform: scale(1) !important;
    max-width: 100% !important;
    margin: 0 !important;
  }
}

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
