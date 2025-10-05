<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import useProjectStore from "../../application/project.store.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const store = useProjectStore();
const project = ref(null);

onMounted(async () => {
  await store.fetchProjects();
  project.value = store.getProjectById(route.params.id);
});

const navigateBack = () => router.push({ name: "projects-management" });
const navigateToEdit = () =>
    router.push({ name: "projects-management-edit", params: { id: project.value.id } });

const confirmDelete = () => {
  confirm.require({
    message: t("projects.confirm-delete", { name: project.value.name }),
    header: t("projects.delete-header"),
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      store.deleteProject(project.value);
      router.push({ name: "projects" });
    },
  });
};
</script>

<template>
  <div v-if="project" class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
    <div class="mb-4">
      <pv-button
          icon="pi pi-arrow-left"
          :label="t('projects.actions.go-back') || 'Go Back'"
          text
          @click="navigateBack"
      />
    </div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-center flex-1">{{ project.name }}</h1>
      <div class="flex items-center gap-2">
        <pv-button icon="pi pi-pencil" text rounded @click="navigateToEdit" />
        <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete" />
      </div>
    </div>
    <div class="space-y-2 text-gray-800 leading-relaxed">
      <p>
        <strong>{{ t("projects.fields.status") }}:</strong>
        {{ t(`projects.status.${project.status}`) }}
      </p>
      <p><strong>{{ t("projects.fields.progress") }}:</strong> {{ project.progressPercent }}%</p>
      <p><strong>{{ t("projects.fields.last-update") }}:</strong> {{ project.lastUpdatedAt }}</p>
      <p><strong>{{ t("projects.fields.location") }}:</strong> {{ project.location }}</p>
      <p><strong>{{ t("projects.fields.description") }}:</strong> {{ project.description }}</p>
      <p v-if="project.budget !== null">
        <strong>{{ t("projects.fields.budget") }}:</strong>
        $ {{ project.budget.toLocaleString() }}
      </p>
    </div>
  </div>
  <p v-else class="text-gray-500 text-center">{{ t("projects.messages.no-projects") }}</p>
</template>

<style scoped>

</style>