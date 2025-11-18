<script setup lang="ts">
import {useProductList} from "~/composables/useProductList";
import {onMounted} from "vue";
import SearchProduct from "~/components/SearchProduct.vue";
import ProductFiltering from "~/components/Filters/ProductFiltering.vue";

const {
  products,
  loading,
  error,
  total,
  fetchProducts,
  fetchFilters,
  filters,
  searchQueryData,
} = useProductList()

onMounted(() => {
  fetchProducts()
  fetchFilters()
})
watch(searchQueryData, () => fetchProducts())
</script>

<template>
  <div class="p-6 space-y-8">

    <h1 class="text-3xl font-bold">Products</h1>
    <div class="flex gap-4 items-end">
      <SearchProduct/>
      <ProductFiltering v-model="searchQueryData" :filters="filters"/>
    </div>

    <div v-if="loading">
      <UCard v-for="n in 6" :key="n" class="mb-4 animate-pulse">
        <div class="h-6 bg-gray-300 rounded mb-3"/>
        <div class="h-4 bg-gray-200 rounded"/>
      </UCard>
    </div>

    <UAlert v-if="error" color="warning" title="Error" :description="error"/>

    <UPageGrid v-if="!loading && !error" :columns="3" :gap="6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" class="h-full"/>
    </UPageGrid>

    <div v-if="total > 1" class="flex flex-col items-center gap-4">
      <UPagination
          v-model:page="searchQueryData.page"
          :total="total"
          :items-per-page="15"
      />

    </div>

  </div>
</template>