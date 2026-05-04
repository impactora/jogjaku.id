<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();

const handleError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = "/images/placeholder.jpg";
};
</script>

<template>
  <img
    :src="src"
    :alt="alt ?? ''"
    loading="lazy"
    decoding="async"
    @error="handleError"
    v-bind="$attrs"
  />
</template>
