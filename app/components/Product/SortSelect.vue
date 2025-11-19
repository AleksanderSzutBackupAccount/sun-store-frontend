<script setup lang="ts">

import type {ProductsQuery} from "~/composables/useProductList";

const query = defineModel<ProductsQuery>({
  default: null
})

const emit = defineEmits(['update'])

const value = ref(
    query.value && query.value.sortField && query.value.sortOrder
        ? `${query.value.sortField}:${query.value.sortOrder}`
        : 'created_at:desc'
)

watch(value, (value: string) => {
  const [field, order] = value.split(":");

  query.value.sortField = field as string
  query.value.sortOrder = order as 'asc'|'desc'
  emit('update')
})

const sortItems = [
  {label: 'Oldest first', value: 'created_at:asc'},
  {label: 'Newest first', value: 'created_at:desc'},
  {label: 'Cheapest', value: 'price:asc'},
  {label: 'Most expensive', value: 'price:desc'},
  {label: 'Name A-Z', value: 'name.keyword:asc'},
  {label: 'Name Z-A', value: 'name.keyword:desc'},
];
</script>

<template>
  <USelect
      v-model="value"
      :items="sortItems"
  />
</template>

<style scoped>

</style>