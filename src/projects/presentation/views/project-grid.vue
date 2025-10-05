<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useProjectStore from "../../application/project.store.js";
import ProjectCard from "../components/project-card.vue";

const { t } = useI18n();
const router = useRouter();
const store = useProjectStore();
const { projects, projectsLoaded, fetchProjects } = store;

onMounted(() => {
  if (!projectsLoaded) fetchProjects();
});

const navigateToNew = () => router.push({ name: "projects-management-new" });
const navigateToDetails = (id) => router.push({ name: "projects-management-details", params: { id } });
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">{{ t("projects.title") }}</h1>
      <div class="ml-auto">
        <pv-button
            :label="t('projects.add')"
            icon="pi pi-plus"
            size="small"
            @click="navigateToNew"
        />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr"
         v-if="projects.length">
      <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @viewDetails="navigateToDetails(project.id)"
      />
    </div>
    <p v-else class="text-gray-500">{{ t('projects.messages.no-projects') }}</p>
  </div>
</template>

<style scoped>

</style>