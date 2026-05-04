<script setup lang="ts">
import { ref, computed } from "vue";
import { useSeoMeta, useI18n, useAsyncData } from "#imports";

const { t, locale } = useI18n();

const { data: rawTimeline } = await useAsyncData("sejarah", () =>
  $fetch<any[]>("/api/data/sejarah"),
);

const timeline = computed(() => {
  if (!rawTimeline.value) return [];
  const l = locale.value as "id" | "en";
  return rawTimeline.value.map((item: any) => ({
    ...item,
    displayTitle: item.title[l],
    displayDesc: item.desc[l],
    displayMeta: item.meta[l],
  }));
});

const activeIndex = ref(0);

useSeoMeta({
  title: computed(() => t("sejarah.page_title")),
  description: computed(() => t("sejarah.header_desc")),
  ogTitle: computed(() => t("sejarah.page_title")),
});
</script>

<template>
  <main
    class="min-h-screen pt-[120px] lg:pt-[180px] px-5 md:px-6 lg:px-[60px] pb-20 relative z-10"
  >
    <CategoryHeader
      v-observe
      class="reveal-up"
      :category="$t('sejarah.category')"
      :title="$t('sejarah.header_title')"
      :description="$t('sejarah.header_desc')"
    />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-10 lg:mt-20"
    >
      <div>
        <SejarahTimelineList
          :items="timeline"
          :activeIndex="activeIndex"
          @update:activeIndex="activeIndex = $event"
        />
      </div>
      <div class="relative h-full w-full">
        <div class="lg:sticky lg:top-[120px] w-full">
          <SejarahTimelineDetail
            v-if="timeline.length > 0"
            :item="timeline[activeIndex]"
          />
        </div>
      </div>
    </div>
  </main>
</template>
