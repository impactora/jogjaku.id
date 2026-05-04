<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useHead, useSeoMeta, useI18n, useAsyncData } from "#imports";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

const { locale, t } = useI18n();

const { data: rawStops } = await useAsyncData("sumbu", () =>
  $fetch<any[]>("/api/data/sumbu"),
);

const stops = computed(() => {
  if (!rawStops.value) return [];
  const l = locale.value as "id" | "en";
  return rawStops.value.map((s: any) => ({
    ...s,
    displayName: s.name[l],
    displaySubtitle: s.subtitle[l],
    displayNarrative: s.narrative[l],
    displayPhilosophy: s.philosophy[l],
    displaySecret: s.secret[l],
  }));
});

const activeIndex = ref(-1);
const isCardVisible = ref(true);
const isSecretActive = ref(false);
const isMuted = ref(true);
const isAudioPlaying = ref(false);
let isAnimating = false;
let ctx: gsap.Context | null = null;

const audioFiles = [
  "hero",
  "merapi",
  "tugu",
  "keraton",
  "krapyak",
  "parangtritis",
];
const audios = ref<HTMLAudioElement[]>([]);
let currentAudio: HTMLAudioElement | null = null;

const toggleAudio = () => {
  isMuted.value = !isMuted.value;
  if (currentAudio) {
    currentAudio.muted = isMuted.value;
    if (!isMuted.value) {
      currentAudio
        .play()
        .then(() => {
          isAudioPlaying.value = true;
        })
        .catch(() => {
          isAudioPlaying.value = false;
        });
    } else {
      isAudioPlaying.value = false;
    }
  }
};

const navigateTo = (index: number) => {
  if (index < -1 || index >= stops.value.length) return;

  isAnimating = true;
  activeIndex.value = index;

  const targetAudio = audios.value[index + 1];
  if (targetAudio && currentAudio !== targetAudio) {
    if (currentAudio) {
      const prev = currentAudio;
      gsap.to(prev, { volume: 0, duration: 2, onComplete: () => prev.pause() });
    }

    targetAudio.muted = isMuted.value;
    if (!isMuted.value) {
      targetAudio
        .play()
        .then(() => {
          isAudioPlaying.value = true;
        })
        .catch(() => {
          isAudioPlaying.value = false;
        });
    }

    gsap.to(targetAudio, { volume: 0.5, duration: 2 });
    currentAudio = targetAudio;
  }

  setTimeout(() => {
    isAnimating = false;
  }, 1800);
};

const handleScrollStep = (direction: 1 | -1) => {
  if (isAnimating) return;
  navigateTo(activeIndex.value + direction);
};

onMounted(async () => {
  await nextTick();
  gsap.registerPlugin(Observer);

  audios.value = audioFiles.map((file) => {
    const a = new Audio(`/audio/sumbu/${file}.mp3`);
    a.loop = true;
    a.volume = 0;
    return a;
  });

  ctx = gsap.context(() => {
    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      tolerance: 40,
      preventDefault: false,
      ignore: ".card-scrollbar, .card-scrollbar *, button, button *",
      onUp: () => handleScrollStep(1),
      onDown: () => handleScrollStep(-1),
    });
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
  audios.value.forEach((a) => {
    a.pause();
    a.src = "";
  });
});

const filosofiTitle = computed(
  () => `${t("home.editorial.sumbu.title")} — JogjaKu`,
);

useSeoMeta({
  title: filosofiTitle,
  description: computed(() => t("home.editorial.sumbu.desc")),
  ogTitle: filosofiTitle,
});

useHead({
  bodyAttrs: {
    class: "overflow-hidden",
  },
  style: [
    {
      innerHTML: "footer { display: none !important; }",
    },
  ],
});
</script>

<template>
  <main
    class="relative w-full h-screen overflow-hidden bg-[#1a1208] text-[#faf7f2]"
  >
    <SumbuMap :activeIndex="activeIndex" :isSecretActive="isSecretActive" />

    <div
      class="fixed inset-0 z-10 bg-gradient-to-t lg:bg-gradient-to-r from-[#1a1208]/90 to-transparent to-[30%] pointer-events-none"
    ></div>

    <button
      @click="toggleAudio"
      class="fixed top-[90px] lg:top-24 left-6 z-[60] bg-[#1a1208]/80 backdrop-blur-md border border-[#faf7f2]/10 p-3 lg:px-4 lg:py-3 rounded-xl shadow-2xl flex items-center gap-3 cursor-pointer group transform-gpu"
    >
      <div class="flex items-end h-3 gap-[2px]">
        <div
          class="w-[3px] bg-[#b8491f] transition-all duration-100"
          :class="isAudioPlaying ? 'animate-sound-1' : 'h-[2px] opacity-50'"
        ></div>
        <div
          class="w-[3px] bg-[#b8491f] transition-all duration-100"
          :class="isAudioPlaying ? 'animate-sound-2' : 'h-[2px] opacity-50'"
        ></div>
        <div
          class="w-[3px] bg-[#b8491f] transition-all duration-100"
          :class="isAudioPlaying ? 'animate-sound-3' : 'h-[2px] opacity-50'"
        ></div>
        <div
          class="w-[3px] bg-[#b8491f] transition-all duration-100"
          :class="isAudioPlaying ? 'animate-sound-4' : 'h-[2px] opacity-50'"
        ></div>
      </div>
      <span
        class="font-josefin text-[9px] tracking-widest uppercase text-[#faf7f2]/60 group-hover:text-[#faf7f2] transition-colors"
      >
        {{
          isMuted
            ? locale === "id"
              ? "Audio Mati"
              : "Audio Off"
            : locale === "id"
              ? "Audio Nyala"
              : "Audio On"
        }}
      </span>
    </button>

    <SumbuControls
      :isCardVisible="isCardVisible"
      :activeIndex="activeIndex"
      :stopsCount="stops.length"
      @toggleCard="isCardVisible = !isCardVisible"
      @navigate="navigateTo"
    />

    <SumbuScrollIndicator
      :activeIndex="activeIndex"
      :stopsCount="stops.length"
    />

    <SumbuInfoCard
      :activeIndex="activeIndex"
      :stops="stops"
      :isCardVisible="isCardVisible"
      @navigate="navigateTo"
      @secretState="isSecretActive = $event"
    />

    <SumbuMobileNav
      :activeIndex="activeIndex"
      :stopsCount="stops.length"
      @navigate="navigateTo"
    />
  </main>
</template>

<style scoped>
.animate-sound-1 {
  animation: sound 1s -0.6s infinite ease-in-out alternate;
  height: 100%;
}
.animate-sound-2 {
  animation: sound 1s -0.2s infinite ease-in-out alternate;
  height: 100%;
}
.animate-sound-3 {
  animation: sound 1s -0.8s infinite ease-in-out alternate;
  height: 100%;
}
.animate-sound-4 {
  animation: sound 1s -0.4s infinite ease-in-out alternate;
  height: 100%;
}

@keyframes sound {
  0% {
    height: 20%;
  }
  100% {
    height: 100%;
  }
}
</style>
