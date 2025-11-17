<script setup lang="ts">
const props = defineProps<{
  category: string
}>();

const colors: Record<string, "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"> = {
  connectors: "info",
  batteries: "warning",
  solar_panels: "success"
};
const icons: Record<string, string> = {
  connectors: "mdi:cable-data",
  batteries: "mdi:battery",
  solar_panels: "mdi:solar-power"
};

const badgeColor = colors[props.category] ?? 'neutral';
</script>

<template>
  <UBadge :color="badgeColor" class="capitalize">
    <template v-if="icons[props.category]" #leading>
      <UIcon :name="icons[props.category] ?? 'mdi:tag'" />
    </template>
    {{ props.category.replace('_', ' ') }}
  </UBadge>
</template>

<style scoped>
</style>