<script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const props = defineProps({
  visible: Boolean,
  amount: Number,
  planName: String,
  onClose: Function,
  onSuccess: Function,
});

const stripe = ref(null);
const cardElement = ref(null);
const card = ref(null);
const loading = ref(false);
const errorMsg = ref("");

onMounted(async () => {
  stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const elements = stripe.value.elements();
  card.value = elements.create("card");
  card.value.mount(cardElement.value);
});

const payNow = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    props.onSuccess();
  } catch (e) {
    errorMsg.value = "Error al procesar tarjeta.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">

      <h2 class="title">Confirmar pago</h2>

      <p class="summary">
        Plan seleccionado: <strong>{{ planName }}</strong>
      </p>

      <p class="amount">
        Total a pagar: <strong>${{ amount }}</strong>
      </p>

      <div class="card-container">
        <div ref="cardElement" class="card-element"></div>
      </div>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <div class="buttons">
        <button @click="onClose" class="btn cancel">Cancelar</button>
        <button @click="payNow" class="btn pay" :disabled="loading">
          {{ loading ? "Procesando..." : "Pagar ahora" }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  width: 450px;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.card-element {
  padding: 1rem;
  background: #f6f6f6;
  border-radius: 8px;
}

.buttons {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.cancel { background: #ccc; }
.pay { background: #4CAF50; color: white; }
.error { color: red; margin-top: 10px; }
</style>
