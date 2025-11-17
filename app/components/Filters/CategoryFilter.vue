<script setup lang="ts">
const categories = [
  {label: "All", value: null,},
  { label: 'Connectors', value: 'connectors' },
  { label: 'Batteries', value: 'batteries' },
  { label: 'Solar Panels', value: 'solar_panels' }
]

const model = defineModel<string | null>({
  default: null
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="#category-filter">
      Category
    </label>

    <USelect
        id="category-filter"
        :default-value="null"
        v-model="model"
        :items="categories"
        placeholder="Select category"
        clearable
    />
  </div>
</template>