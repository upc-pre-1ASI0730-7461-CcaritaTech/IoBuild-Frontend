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
        <strong>{{ t("projects.fields.status") }}:</strong> {{ t(`projects.status.${project.status}`) }}<br />
        <strong>{{ t("projects.fields.progress") }}:</strong>
        {{ project.progressPercent }}%<br />
        <strong>{{ t("projects.fields.last-update") }}:</strong>
        {{ project.lastUpdatedAt }}
      </p>
      <div class="mt-4">
        <pv-button
            :label="t('projects.actions.view-details')"
            icon="pi pi-info-circle"
            @click="$emit('viewDetails')"
        />
      </div>
    </template>
  </pv-card>
</template>

<style scoped>

</style>