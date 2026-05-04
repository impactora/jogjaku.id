<script setup lang="ts">
import { ref, computed } from "vue";
import { useSeoMeta, useI18n, useAsyncData } from "#imports";

const { t, locale } = useI18n();

const { data: rawCulinary } = await useAsyncData("kuliner", () =>
  $fetch<any[]>("/api/data/kuliner"),
);

const categories = computed(() => [
  { key: "all", label: t("kuliner.filters.all") },
  { key: "main_course", label: t("kuliner.filters.main_course") },
  { key: "snacks", label: t("kuliner.filters.snacks") },
  { key: "drinks", label: t("kuliner.filters.drinks") },
]);

const activeCategory = ref("all");

const culinaryItems = computed(() => {
  if (!rawCulinary.value) return [];
  const l = locale.value as "id" | "en";
  return rawCulinary.value.map((item: any) => ({
    ...item,
    displayTitle: item.title[l],
    displayStory: item.story[l],
    displayMeta: item.meta[l],
    displayAddress: item.address[l],
    displayPrice: item.price[l],
    displayCategory: t(`kuliner.filters.${item.categoryId}`),
  }));
});

const featuredItem = computed(() =>
  culinaryItems.value.find((i) => i.featured),
);

const filteredItems = computed(() => {
  if (activeCategory.value === "all")
    return culinaryItems.value.filter((i) => !i.featured);
  return culinaryItems.value.filter(
    (i) => i.categoryId === activeCategory.value,
  );
});

useSeoMeta({
  title: computed(() => t("kuliner.page_title")),
  description: computed(() => t("kuliner.header_desc")),
  ogTitle: computed(() => t("kuliner.page_title")),
});
</script>

<template>
  <main
    class="min-h-screen pt-[120px] lg:pt-[180px] px-5 md:px-6 lg:px-[60px] pb-32 relative z-10"
  >
    <CategoryHeader
      v-observe
      class="reveal-up"
      :category="$t('kuliner.category')"
      :title="$t('kuliner.header_title')"
      :description="$t('kuliner.header_desc')"
    />

    <KulinerFeatured v-if="featuredItem" :item="featuredItem" />

    <KulinerFilter v-model="activeCategory" :categories="categories" />

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
    >
      <transition-group name="list">
        <KulinerCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </transition-group>
    </div>
  </main>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
</style>
