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

const form = ref({ name: "", description: "", location: "", totalUnits: 0, occupiedUnits: 0 });
const isEdit = computed(() => !!route.params.id);

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
        <label>{{ t("projects.fields.description") }}</label>
        <pv-input-text v-model="form.description" class="w-full" />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.location") }}</label>
        <pv-input-text v-model="form.location" class="w-full" />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.total-units") }}</label>
        <pv-input-number v-model="form.totalUnits" :min="0" class="w-full" />
      </div>
      <div v-if="isEdit" class="mb-3">
        <label>{{ t("projects.fields.occupied-units") }}</label>
        <pv-input-number v-model="form.occupiedUnits" :min="0" class="w-full" />
      </div>
      <div class="mb-3">
        <label>{{ t("projects.fields.image-url") }}</label>
        <pv-input-text v-model="form.imageUrl" class="w-full" />
      </div>

      <pv-button type="submit" :label="t('projects.actions.save')" icon="pi pi-check" />
      <pv-button :label="t('projects.actions.cancel')" class="ml-2" severity="secondary" @click="cancel" />
    </form>
  </div>
</template>

<style scoped>

</style>