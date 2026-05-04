<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta, useI18n, useAsyncData } from "#imports";

const { t, locale } = useI18n();

const { data: rawInitiatives } = await useAsyncData("teknologi", () =>
  $fetch<any[]>("/api/data/teknologi"),
);

const initiatives = computed(() => {
  if (!rawInitiatives.value) return [];
  const l = locale.value as "id" | "en";
  return rawInitiatives.value.map((item: any) => ({
    ...item,
    displayMeta: item.meta[l],
    displayTitle: item.title[l],
    displayDesc: item.desc[l],
  }));
});

useSeoMeta({
  title: computed(() => t("teknologi.page_title")),
  description: computed(() => t("teknologi.header_desc")),
  ogTitle: computed(() => t("teknologi.page_title")),
});
</script>

<template>
  <main
    class="min-h-screen pt-[120px] lg:pt-[180px] px-5 md:px-6 lg:px-[60px] pb-32 relative z-10 transition-colors duration-300"
  >
    <CategoryHeader
      v-observe
      class="reveal-up"
      :category="$t('teknologi.category')"
      :title="$t('teknologi.header_title')"
      :description="$t('teknologi.header_desc')"
    />

    <TeknologiHero />

    <TeknologiStats />

    <TeknologiInitiatives :items="initiatives" />
  </main>
</template>
