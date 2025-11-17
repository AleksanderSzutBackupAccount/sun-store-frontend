<script setup lang="ts">

import type {Product} from "~/types/ProductSearch";
import CategoryBadge from "~/components/Product/CategoryBadge.vue";

defineProps<{product: Product}>()
</script>

<template>
  <UCard  class="h-full" :ui="{body: 'h-full flex flex-col justify-between'}">
    <div>

      <h3 class="text-xl font-bold mb-2">{{ product.name }}</h3>
      <p class="text-gray-500 mb-3">{{ product.description }}</p>

    </div>

      <div class="flex justify-between mt-5">
        <CategoryBadge :category="product.category"/>
        <div class="mb-2 font-bold">
          {{ product.price }} zł
        </div>
      </div>
  </UCard>
</template>

<style scoped>

</style>