<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "#imports";

const { t } = useI18n();
const words = computed(() => t("home.intro.text").split(" "));

const textContainer = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);

const handleScroll = () => {
  if (!textContainer.value) return;
  const rect = textContainer.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const start = windowHeight * 0.8;
  const end = windowHeight * 0.3;

  const progress = (start - rect.top) / (start - end);
  scrollProgress.value = Math.max(0, Math.min(1, progress));
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <section
    class="relative w-full min-h-[60vh] bg-warm-white flex items-center justify-center py-32 px-6 lg:px-12 z-10 select-none overflow-hidden border-b border-line transition-colors duration-300"
  >
    <div class="max-w-5xl w-full" ref="textContainer">
      <div
        class="font-josefin text-[10px] tracking-[0.5em] text-terra uppercase mb-12 flex items-center gap-4"
      >
        <div class="w-8 h-[1px] bg-terra"></div>
        {{ t("home.intro.prefix") }}
      </div>
      <p
        class="text-justify leading-relaxed md:leading-[1.6] lg:leading-[1.7] whitespace-pre-wrap break-words"
      >
        <span
          v-for="(word, index) in words"
          :key="index"
          class="font-libre text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight transition-colors duration-500 ease-out"
          :class="
            scrollProgress >= index / words.length ? 'text-ink' : 'text-muted'
          "
          >{{ word }}{{ index !== words.length - 1 ? " " : "" }}</span
        >
      </p>
    </div>
  </section>
</template>
