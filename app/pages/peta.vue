<script setup lang="ts">
import { ref, computed } from "vue";
import { useSeoMeta, useI18n } from "#imports";

const { t } = useI18n();

const currentMode = ref<"poi" | "internet">("poi");
const selectedCategory = ref<
  "all" | "wisata" | "kuliner" | "budaya" | "teknologi"
>("all");

useSeoMeta({
  title: computed(() => t("peta.page_title")),
  description: computed(() => t("peta.header_desc")),
  ogTitle: computed(() => t("peta.page_title")),
});
</script>

<template>
  <main
    class="min-h-screen pt-[120px] lg:pt-[180px] px-5 md:px-6 lg:px-[60px] pb-20 flex flex-col relative z-10"
  >
    <div
      class="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-6 reveal-up"
      v-observe
    >
      <CategoryHeader
        :category="$t('peta.category')"
        :title="$t('peta.header_title')"
        :description="$t('peta.header_desc')"
        class="mb-0"
      />
      <PetaControls
        v-model:mode="currentMode"
        v-model:category="selectedCategory"
      />
    </div>

    <PetaMapContainer :mode="currentMode" :category="selectedCategory" />
  </main>
</template>
