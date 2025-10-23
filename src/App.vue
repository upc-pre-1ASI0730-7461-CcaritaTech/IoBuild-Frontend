<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useRoute } from "vue-router";
import Layout from "./shared/presentation/components/layout.vue";
import { useIamStore } from "./iam/application/iam.store.js";

const { t } = useI18n();
const route = useRoute();
const iamStore = useIamStore();


const showLayout = computed(() => {
  return route.meta?.public !== true && iamStore.isAuthenticated;
});
</script>

<template>

  <layout v-if="showLayout" />
  

  <router-view v-else />
</template>

<style scoped>

</style>
