<script setup lang="ts">
import CategoryFilter from "~/components/Filters/CategoryFilter.vue";
import PriceFilter from "~/components/Filters/PriceFilter.vue";
import { reactive, watch } from 'vue'

const props = defineProps<{ modelValue: ProductsQuery }>()
const emit = defineEmits<{'update:modelValue':[ProductsQuery]}>()

const localFilters = reactive({ ...props.modelValue })
watch(() => props.modelValue, v => Object.assign(localFilters, v))

</script>

<template>
  <USlideover :modal="false" :ui="{body: 'gap-4 flex flex-col', footer: 'flex justify-between'}" :dismissible="false" side="right">
    <UButton label="Filters" leading-icon="material-symbols:filter-alt" variant="subtle" />
    <template #title>
      <UIcon name="material-symbols:filter-alt" class="mr-2"/>Filters
    </template>
    <template #body>
      <CategoryFilter />
      <div class="flex">

        <USelect
            v-model="localFilters.sortField"
            :items="[
          { label: 'Data utworzenia', value: 'created_at' },
          { label: 'Name', value: 'name.keyword' },
          { label: 'Price', value: 'price' },
        ]"
        />
        <USelect
            v-model="localFilters.sortOrder"
            :items="[
          { label: 'Rosnąco', value: 'asc' },
          { label: 'Malejąco', value: 'desc' }
        ]"
        />
      </div>
      <PriceFilter @update:price="price => (localFilters.priceRange = price)" />
    </template>

    <template #footer>
        <UButton label="Clear" variant="outline" @click="Object.assign(localFilters, { query: '', sortField: 'created_at', sortOrder: 'asc', priceRange: { min: 0, max: undefined }, category: null, page: 1 })" />
        <UButton label="Apply" color="primary" @click="emit('update:modelValue', { ...localFilters })" />
    </template>
  </USlideover>
</template>

<style scoped>

</style>