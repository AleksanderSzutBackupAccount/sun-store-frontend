<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import {useProductFetch} from "~/composables/useProductFetch";

const {
  products,
  fetch,
  searchQuery
} = useProductFetch()

watch(searchQuery, () => fetch())

const popupRef = ref(null)


onClickOutside(popupRef, () => {
  products.value.splice(0)
})

</script>

<template>
  <div class="flex flex-col gap-2 mb-4 relative"  ref="popupRef">
    <div class="flex rounded ring ring-default">
      <UInput
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full"
          variant="ghost"
      />
    </div>
    <UCard
        v-if="products.length > 0"
        class="absolute w-100 z-20 mt-1 max-h-64 top-[100%]"
    >
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
    </UCard>
  </div>
</template>

<style scoped>

</style>