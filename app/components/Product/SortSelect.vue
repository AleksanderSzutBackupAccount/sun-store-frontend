<script setup lang="ts">
import type { ProductsQuery } from "~/composables/useProductList";

const query = defineModel<ProductsQuery>({ default: null });
const emit = defineEmits(["update"]);

const isMobile = ref(false);

onMounted(() => {
  const update = () => {
    isMobile.value = window.innerWidth < 640;
  };

  update();
  window.addEventListener("resize", update);
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {});
});

const value = ref(
    query.value && query.value.sortField && query.value.sortOrder
        ? `${query.value.sortField}:${query.value.sortOrder}`
        : "created_at:desc"
);

watch(value, (value: string) => {
  const [field, order] = value.split(":");
  query.value.sortField = field as string;
  query.value.sortOrder = order as "asc" | "desc";
  emit("update");
});

const sortItems = [
  { label: "Oldest first", short: "Oldest", value: "created_at:asc" },
  { label: "Newest first", short: "Newest", value: "created_at:desc" },
  { label: "Cheapest", short: "Price ↑", value: "price:asc" },
  { label: "Most expensive", short: "Price ↓", value: "price:desc" },
  { label: "Name A-Z", short: "A → Z", value: "name.keyword:asc" },
  { label: "Name Z-A", short: "Z → A", value: "name.keyword:desc" },
];

const displayItems = computed(() => {
  return sortItems.map((item) => ({
    ...item,
    label: isMobile.value ? item.short : item.label,
  }));
});
</script>

<template>
  <USelect
      v-model="value"
      :items="displayItems"
      :trailing-icon="isMobile ? '':'mdi:chevron-down'"
      class="w-full sm:w-auto"
      :ui="{ content: 'min-w-fit' }"
  />
</template>