<script setup lang="ts">
import {onClickOutside} from '@vueuse/core'
import {useProductFetch} from "~/composables/useProductFetch";

import {debounce} from 'lodash-es'
import type {ProductsQuery} from "~/composables/useProductList";

const {
  products,
  fetch,
  searchQuery
} = useProductFetch()

const model = defineModel<ProductsQuery>({
  default: null
})

const debouncedFetch = debounce(() => fetch(), 300)

watch(searchQuery, () => debouncedFetch())

const popupRef = ref(null)

onClickOutside(popupRef, () => {
  products.value.splice(0)
})

const canSearch = computed(() => {
  return searchQuery.value?.length >= 3
})

const isSearched = computed(()=> {
  console.log(searchQuery.value, model.value.query)
  if(searchQuery.value.length === 0) {
    return false
  }

  return model.value.query === searchQuery.value
})

const apply = () => {
  model.value.query = searchQuery.value
}

const clear = () => {
  searchQuery.value = ''
  apply()
}

</script>

<template>
  <div ref="popupRef" class="flex flex-col gap-2 relative">
    <div class="flex rounded ring ring-default">
      <UInput
          v-model="searchQuery"
          :ui="{trailing: 'pe-0'}"
          placeholder="Search..."
          class="w-full"
      >
        <template #trailing>
          <template v-if="isSearched">
            <UButton icon="mdi-close" :variant="canSearch ? 'solid':'ghost'" @click="clear"/>

          </template>
          <template v-else>
            <UButton icon="mdi-search" :variant="'solid'" @click="apply"/>
          </template>
        </template>
      </UInput>
    </div>
    <UCard
        v-if="products.length > 0"

        class="absolute w-100 z-20 mt-1  top-[100%]"
    >
      <template #header>
        <h5 class="font-bold ">Suggested products</h5>
      </template>
      <template #default>
        <NuxtLink
            v-for="item in products"
            :key="item.id"
            :to="`/products/${item.id}`"
            class="block no-underline"
            @click="() => { products = []; }"
        >
          <div
              class="p-2 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
          >
            <div class="flex content-center justify-between">
              <div class="flex items-center">
                <Icon name="mdi-search" mode="svg" class="mr-1"/>

                <span class="font-medium text-gray-900 dark:text-gray-100">
                {{ item.name }}
              </span></div>
              <span class="text-sm text-gray-300 dark:text-gray-400">
                {{ item.price }} zł
              </span>
            </div>
          </div>
        </NuxtLink>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>