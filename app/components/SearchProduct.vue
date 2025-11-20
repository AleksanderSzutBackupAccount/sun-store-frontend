<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import {useProductFetch} from "~/composables/useProductFetch";

import { debounce } from 'lodash-es'
import type {ProductsQuery} from "~/composables/useProductList";

const {
  products,
  fetch,
  searchQuery
} = useProductFetch()

defineModel<ProductsQuery>({
  default: null
})

const debouncedFetch = debounce(() => fetch(), 300)

watch(searchQuery, () => debouncedFetch())

const popupRef = ref(null)

onClickOutside(popupRef, () => {
  products.value.splice(0)
})

const canSearch = computed(() => {
  return searchQuery.value?.length > 3
})

</script>

<template>
  <div ref="popupRef"  class="flex flex-col gap-2 relative">
    <div class="flex rounded ring ring-default">
      <UInput
          v-model="searchQuery"
          :ui="{trailing: 'pe-0'}"
          placeholder="Search..."
          class="w-full"
      >

        <template #trailing>
          <UButton icon="mdi-search" :variant="canSearch ? 'solid':'ghost'"/>
        </template>
      </UInput>
    </div>
    <UCard
        v-if="products.length > 0"
        class="absolute w-100 z-20 mt-1 max-h-64 top-[100%]"
    >
      <template #header>
        <h5 class="font-bold ">Suggested products</h5>
      </template>
      <template #default>
        <UCard
            v-for="item in products"
            :key="item.id"
            variant="subtle"
            class="p-0 cursor-pointer"
            :ui="{ body: 'p-0'  }"
            @click="() => { searchQuery = item.name; products = []; }"
        >
          <div class="flex flex-col">
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ item.name }}
          </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.price }} zł
          </span>
          </div>
        </UCard>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>