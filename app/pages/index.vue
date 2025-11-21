<script setup lang="ts">
import {useProductList} from "~/composables/useProductList";
import {onMounted} from "vue";
import SearchProduct from "~/components/SearchProduct.vue";
import ProductFiltering from "~/components/Filters/ProductFiltering.vue";
import FilterBadge from "~/components/Filters/FilterBadge.vue";

const {
  products,
  loading,
  error,
  total,
  fetchProducts,
  fetchFilters,
  filters,
  isPageChanging,
  filtersDefinition,
  searchQueryData,
  page,
} = useProductList()

onMounted(() => {
  fetchProducts()
  fetchFilters()
})
</script>

<template>
  <div class="p-6 space-y-8">

    <h1 class="text-3xl font-bold">Products</h1>
    <div class=" sticky z-50 top-0 flex-col flex gap-1 p-4 sm:p-6 rounded-lg bg-default ring ring-default h-full">
      <div class="flex justify-between w-full gap-2">
        <SearchProduct v-model="searchQueryData"/>
        <div class="flex items-center gap-2">
          <ProductSortSelect v-model="searchQueryData" @update="fetchProducts"/>

          <ProductFiltering v-model="searchQueryData" :filters="filtersDefinition"/>
        </div>
      </div>
      <div class="flex gap-1 justify-end">
        <template v-for="(value, key) in filters" :key="key">
          <FilterBadge v-model="searchQueryData.filters[key]" :label="`${key}`" @clear="fetchProducts"/>
        </template>
      </div>
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

    <div v-if="total > 1" class="fixed bottom-0 left-0 right-0 flex justify-center">

      <div class="w-(--ui-container) px-14">

        <UCard class="flex flex-col items-center gap-4 ">
          <UPagination
              v-model:page="page"
              :disabled="isPageChanging"
              :total="total"
              :items-per-page="15"
          />

        </UCard>
      </div>

    </div>
  </div>
</template>