<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  plan: { type: Object, required: true }
});

defineEmits(['select']);
</script>

<template>
  <div
    class="border border-green-500 rounded-xl p-6 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
    @click="$emit('select', plan)"
  >
    <h3 class="text-lg font-semibold text-gray-800 mb-1">
      {{ plan.name }}
    </h3>
    <p class="text-gray-600 mb-4">{{ plan.description }}</p>
    <p class="text-2xl font-bold text-gray-900 mb-4">
      {{ plan.getFormattedPrice() }}
      <span class="text-base font-normal text-gray-600">/{{ t("subscriptions.month") }}</span>
    </p>
    <ul class="space-y-2">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="flex items-start text-gray-700"
      >
        <span class="text-green-500 mr-2">✔</span> {{ feature }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  line-height: 1.5rem;
}
</style>
