<script setup lang="ts">
import {ref, watch} from 'vue'
import type {ProductsQuery} from "~/composables/useProductList";
import BaseFilter from "~/components/Filters/BaseFilter.vue";
import type {FiltersResponse} from "~/types/ProductSearch";

const props = defineProps<{
  filters: FiltersResponse
  modelValue: ProductsQuery
}>()

const emit = defineEmits(['update:modelValue', 'applyFilters'])

const localFilters = ref<Record<string, any>>({ ...props.modelValue })

watch(
    () => props.modelValue,
    () => {
      localFilters.value = { ...props.modelValue }
    }
)

const clearFilters = () => {
  localFilters.value = {}
}

const applyFilters = () => {
  emit('update:modelValue', { ...localFilters.value })
  emit('applyFilters')
}
</script>

<template>
  <USlideover :modal="false" :ui="{body: 'gap-4 flex flex-col', footer: 'flex justify-between'}" :dismissible="false" side="right">
    <UButton label="Filters" leading-icon="material-symbols:filter-alt" variant="subtle" />
    <template #title>
      <UIcon name="material-symbols:filter-alt" class="mr-2"/>Filters
    </template>
    <template #body>
      <div class="space-y-6">
        <BaseFilter
            v-for="(filter, key) in props.filters"
            :filter="filter"
            @update:filter="(value) => localFilters.filters[key] = value"
            v-model="localFilters.filters[key]"
            :label="key"
            :key="key"
            class="space-y-2"
        />
        <div
            v-if="false"
            v-for="(filter, key) in props.filters"
            :key="key"
            class="space-y-2"
        >
          <label class="font-medium capitalize">
            {{ key.replace('attr_', '').replace('_', ' ') }}
          </label>

          <div v-if="filter.ui === 'select'">
            <USelectMenu
                v-model="localFilters[key]"
                :items="filter.values"
                placeholder="Wybierz..."
                class="w-full"
            />
          </div>

          <!-- RANGE (number) -->
          <div v-else-if="filter.ui === 'range'">
            <div class="px-1 text-sm text-gray-500">
              {{ filter.min }} – {{ filter.max }} {{ filter.unit || '' }}
            </div>

            <USlider
                v-model="localFilters['filters'][key]"
                :min="filter.min"
                :max="filter.max"
                range
                tooltip
            />
          </div>
        </div>


      </div>
    </template>

    <template #footer>
        <UButton
            color="gray"
            variant="soft"
            @click="clearFilters"
        >
          Clear
        </UButton>

        <UButton
            color="primary"
            @click="applyFilters"
        >
          Apply
        </UButton>
   </template>
  </USlideover>
</template>

<style scoped>

</style>