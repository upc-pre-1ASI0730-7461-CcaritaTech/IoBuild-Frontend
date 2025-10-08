<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  project: { type: Object, required: true },
});
defineEmits(["viewDetails"]);
</script>

<template>
  <pv-card class="bg-white text-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
    <template #content>
      <h3 class="text-lg font-semibold mb-2">{{ project.name }}</h3>
      <p class="text-sm text-gray-700 leading-relaxed">
        <strong>{{ t("projects.fields.status") }}:</strong> {{ project.status }}<br />
        <strong>{{ t("projects.fields.occupancy-rate") }}:</strong>
        {{ project.occupiedUnits }}/{{ project.totalUnits }}<br />
        <strong>{{ t("projects.fields.created-date") }}:</strong>
        {{ project.createdDate }}
      </p>
      <div class="mt-4">
        <pv-button
            :label="t('projects.actions.view-details')"
            icon="pi pi-info-circle"
            class="custom-green-button"
            @click="$emit('viewDetails')"
        />
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
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