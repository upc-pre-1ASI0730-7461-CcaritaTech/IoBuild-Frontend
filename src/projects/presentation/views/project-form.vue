<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useProjectStore from "../../application/project.store.js";
import { Project } from "../../domain/model/project.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useProjectStore();

const form = ref({ name: "", progress: 0, status: "planned", location: "" });
const isEdit = computed(() => !!route.params.id);

const statuses = computed(() => [
  { label: t("projects.status.planned"), value: "planned" },
  { label: t("projects.status.in_progress"), value: "in_progress" },
  { label: t("projects.status.completed"), value: "completed" },
  { label: t("projects.status.halted"), value: "halted" }
]);

onMounted(() => {
  if (isEdit.value) {
    const existing = store.getProjectById(route.params.id);
    if (existing) form.value = { ...existing };
    else router.push({ name: "projects-management" });
  }
});

const save = async () => {
  const project = new Project({
    id: isEdit.value ? route.params.id : null,
    ...form.value,
  });
  if (isEdit.value) await store.updateProject(project);
  else await store.addProject(project);
  router.push({ name: "projects-management" });
};

const cancel = () => {
  if (isEdit.value) {
    router.push({ name: "projects-management-details", params: { id: route.params.id } });
  } else {
    router.push({ name: "projects-management" });
  }
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t("projects.edit-title") : t("projects.new-title") }}</h1>

    <form @submit.prevent="save">
      <div class="mb-3">
        <label>{{ t("projects.fields.name") }}</label>
        <pv-input-text v-model="form.name" class="w-full" required />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.progress") }}</label>
        <pv-input-number v-model="form.progress" :min="0" :max="100" class="w-full" />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.status") }}</label>
        <pv-select
            v-model="form.status"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            class="w-full"
        />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.location") }}</label>
        <pv-input-text v-model="form.location" class="w-full" />
      </div>

      <pv-button type="submit" :label="t('projects.actions.save')" icon="pi pi-check" />
      <pv-button :label="t('projects.actions.cancel')" class="ml-2" severity="secondary" @click="cancel" />
    </form>
  </div>
</template>

<style scoped>

</style>