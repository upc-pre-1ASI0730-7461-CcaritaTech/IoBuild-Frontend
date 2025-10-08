<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  plan: { type: Object, required: true },
  subscription: { type: Object, required: true }
});

defineEmits(['renew', 'cancel']);
</script>

<template>
  <div class="border border-green-500 rounded-xl p-6 shadow-sm bg-white">
    <h2 class="text-lg font-semibold mb-4 text-gray-800">
      {{ plan.description }}
    </h2>

    <div class="mb-4">
      <p class="text-2xl font-bold text-gray-900 mb-2">
        {{ plan.getFormattedPrice() }}
        <span class="text-base font-normal text-gray-600">/{{ t("subscriptions.month") }}</span>
      </p>
      <p class="text-sm text-gray-600" v-if="subscription.status">
        {{ t("subscriptions.status") }}:
        <span :class="subscription.isActive() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
          {{ t(`subscriptions.status-${subscription.status}`) }}
        </span>
      </p>
    </div>

    <ul class="space-y-2 mb-6">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="flex items-start text-gray-700"
      >
        <span class="text-green-500 mr-2">✔</span> {{ feature }}
      </li>
    </ul>

    <div class="flex flex-col gap-3">
      <pv-button
        :label="t('subscriptions.renew-plan')"
        class="custom-green-button"
        @click="$emit('renew')"
        :disabled="!subscription.isActive()"
      />
      <pv-button
        :label="t('subscriptions.cancel-plan')"
        outlined
        severity="danger"
        @click="$emit('cancel')"
        :disabled="!subscription.isActive()"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-bg {
  background: linear-gradient(135deg, #f0fdf4 0%, #e6fffa 100%) !important;
}

:deep(.custom-green-button) {
  background-color: #10B981 !important;
  border-color: #10B981 !important;
  color: white !important;
}

:deep(.custom-green-button:hover) {
  background-color: #059669 !important;
  border-color: #059669 !important;
}

:deep(.custom-green-button:focus) {
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.5) !important;
}
</style>
