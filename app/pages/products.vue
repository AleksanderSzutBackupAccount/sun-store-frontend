<script setup lang="ts">
import {useProductsSearch} from "~/composables/useProductSearch";
import {onMounted} from "vue";

const {
  products,
  loading,
  error,
  total,
  fetchProducts,
  currentPage,
} = useProductsSearch()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="p-6 space-y-8">

    <h1 class="text-3xl font-bold">Products</h1>

    <div v-if="loading">
      <UCard v-for="n in 6" :key="n" class="mb-4 animate-pulse">
        <div class="h-6 bg-gray-300 rounded mb-3"/>
        <div class="h-4 bg-gray-200 rounded"/>
      </UCard>
    </div>

    <UAlert v-if="error" color="warning" title="Error" :description="error" />

    <UPageGrid v-if="!loading && !error" :columns="3" :gap="6">
      <UCard v-for="p in products" :key="p.id" class="h-full">
        <h3 class="text-xl font-bold mb-2">{{ p.name }}</h3>
        <p class="text-gray-600 mb-3">{{ p.description }}</p>

        <div class="font-semibold mb-2">
          {{ p.price }} zł
        </div>

        <UBadge color="neutral">{{ p.category }}</UBadge>
      </UCard>
    </UPageGrid>

    <!-- PAGINATION -->
    <div v-if="total > 1" class="flex flex-col items-center gap-4">
      <!-- Numeric pages -->
      <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="15"
      />

    </div>

  </div>
</template>