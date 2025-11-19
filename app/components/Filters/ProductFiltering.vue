<script setup lang="ts">
import {ref, watch} from 'vue'
import type {ProductsQuery} from "~/composables/useProductList";
import BaseFilter from "~/components/Filters/BaseFilter.vue";
import type {FiltersResponse} from "~/types/ProductSearch";
import { cloneDeep } from 'lodash-es'
const props = defineProps<{
  filters: FiltersResponse
  modelValue: ProductsQuery
}>()

const isOpen = ref(false)

const emit = defineEmits(['update:modelValue', 'applyFilters'])

const localFilters = ref<Record<string, any>>(cloneDeep( props.modelValue))

watch(
    () => props.modelValue,
    () => {
      localFilters.value = cloneDeep(props.modelValue)
    }
)

const clearFilters = () => {
  isOpen.value = false
  emit('update:modelValue', {...props.modelValue, filters: {}})
  localFilters.value = {}
}

const applyFilters = () => {
  emit('update:modelValue', { ...localFilters.value })
  emit('applyFilters')
  isOpen.value = false
}

</script>

<template>
  <USlideover :ui="{body: 'gap-4 flex flex-col', footer: 'flex justify-between'}" side="right" v-model:open="isOpen">

    <UButton label="Filters" leading-icon="material-symbols:filter-alt" variant="subtle" />
    <template #title>
      <UIcon name="material-symbols:filter-alt" class="mr-2"/>Filters
    </template>
    <template #body>{{modelValue.filters}}
      <div class="space-y-6">
        <BaseFilter
            v-for="(filter, key) in props.filters"
            :key="key"
            v-model="localFilters.filters[key]"
            :filter="filter"
            :label="`${key}`"
            class="space-y-2"
            @update:filter="(value) => localFilters.filters[key] = value"
        />
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