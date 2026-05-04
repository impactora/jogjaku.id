<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSeoMeta, useI18n, useAsyncData } from "#imports";
import { Printer } from "lucide-vue-next";

const { t, locale } = useI18n();

const { data: rawDestinations } = await useAsyncData("wisata", () =>
  $fetch<any[]>("/api/data/wisata"),
);

const destinations = computed(() => {
  if (!rawDestinations.value) return [];
  return rawDestinations.value.map((d: any) => ({
    ...d,
    displayDesc: d.desc[locale.value as "id" | "en"],
  }));
});

const activeDestination = ref("");

const activeMapUrl = computed(() => {
  const target = destinations.value.find(
    (d) => d.id === activeDestination.value,
  );
  return target?.mapUrl ?? destinations.value[0]?.mapUrl ?? "";
});

const activeImage = computed(() => {
  const target = destinations.value.find(
    (d) => d.id === activeDestination.value,
  );
  return target?.image ?? destinations.value[0]?.image ?? "";
});

watch(
  () => destinations.value,
  (val) => {
    if (val.length && !activeDestination.value) {
      activeDestination.value = val[0].id;
    }
  },
  { immediate: true },
);

const triggerPrint = () => {
  window.print();
};

useSeoMeta({
  title: computed(() => t("wisata.page_title")),
  description: computed(() => t("wisata.header_desc")),
  ogTitle: computed(() => t("wisata.page_title")),
});
</script>

<template>
  <main
    class="min-h-screen pt-[120px] lg:pt-[180px] px-5 md:px-6 lg:px-[60px] pb-32 relative z-10 print:pt-0 print:px-0"
  >
    <div class="flex justify-between items-start mb-8 print:hidden">
      <CategoryHeader
        v-observe
        class="reveal-up"
        :category="$t('wisata.category')"
        :title="$t('wisata.header_title')"
        :description="$t('wisata.header_desc')"
      />
      <div class="flex gap-2 reveal-up delay-100 mt-2 lg:mt-0">
        <button
          @click="triggerPrint"
          class="hidden md:flex items-center gap-2 px-3 py-2 bg-ink text-warm-white hover:bg-terra transition-colors font-josefin text-[10px] tracking-widest uppercase cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          {{ $t("wisata.print_pdf") }}
        </button>
      </div>
    </div>

    <WisataHero
      :activeDestination="activeDestination"
      :activeImage="activeImage"
    />

    <div
      class="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-10 lg:gap-16 print:block"
    >
      <WisataList
        :destinations="destinations"
        v-model:activeDestination="activeDestination"
      />
      <WisataMap
        :activeDestination="activeDestination"
        :activeMapUrl="activeMapUrl"
      />
    </div>
  </main>
</template>
