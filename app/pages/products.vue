<script setup lang="ts">
import {useProductList} from "~/composables/useProductList";
import {onMounted} from "vue";
import SearchProduct from "~/components/SearchProduct.vue";
import PriceFilter from "~/components/Filters/PriceFilter.vue";

const {
  products,
  loading,
  error,
  total,
  fetchProducts,
  currentPage,
  sortField,
  priceRange,
  sortOrder,
} = useProductList()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="p-6 space-y-8">

    <h1 class="text-3xl font-bold">Products</h1>

    <div class="flex gap-4 items-end">
      <SearchProduct/>
      <USelect
          v-model="sortField"
          default-value="name.keyword"
          :items="[
    { label: 'Nazwa', value: 'name.keyword' },
    { label: 'Cena', value: 'price' },
    { label: 'Data utworzenia', value: 'created_at' }
  ]"
      />
      <USelect
          v-model="sortOrder"
          :items="[
    { label: 'Rosnąco', value: 'asc' },
    { label: 'Malejąco', value: 'desc' }
  ]"
      />
      <PriceFilter @update:price="(price) => priceRange= price"/>
      <UButton @click="fetchProducts()">Apply</UButton>
    </div>

    <div v-if="loading">
      <UCard v-for="n in 6" :key="n" class="mb-4 animate-pulse">
        <div class="h-6 bg-gray-300 rounded mb-3"/>
        <div class="h-4 bg-gray-200 rounded"/>
      </UCard>
    </div>

    <UAlert v-if="error" color="warning" title="Error" :description="error"/>

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