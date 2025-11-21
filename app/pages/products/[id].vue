<script setup lang="ts">
import {useRoute} from 'vue-router'
import type {Product} from "~/types/ProductSearch";
import CategoryBadge from "~/components/Product/CategoryBadge.vue";

const route = useRoute()
const id = route.params.id as string

const {data: product, pending, error} = await useAsyncData<Product>(
    `product-${id}`,
    () => $fetch(`/api/products/${id}`)
)
</script>

<template>
  <UContainer class="py-10">

    <div v-if="pending" class="flex justify-center py-20">
      <ULoader size="xl"/>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 font-medium">Failed to load product.</p>
    </div>

    <!-- Produkt -->
    <div v-else-if="product">

      <UBreadcrumb
          :items="[
          { label: 'Products', to: '/' },
          { label: product.category },
          { label: product.name }
        ]"
          class="mb-6"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <UCard class="p-4 flex items-center justify-center h-80">
            <UIcon name="mdi:image-outline" class="w-32 h-32 text-gray-400"/>
          </UCard>
        </div>

        <div class="space-y-6">

          <div>
            <h1 class="text-3xl font-bold">{{ product.name }}</h1>
            <p class="text-gray-500">{{ product.manufacturer }}</p>
          </div>

          <div>
            <p class="text-4xl font-semibold text-primary-600">
              {{ product.price }} zł
            </p>
          </div>

          <UCard class="p-4 space-y-2">
            <template #header>
              <h3 class="font-semibold text-lg">Product details</h3>
            </template>
            <div class="grid gap-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Category</span>
                <CategoryBadge :category="product.category"/>
              </div>

              <template v-for="(value, key) in product" :key="key">
                <div
                    v-if="key.startsWith('attr_')"
                    class="flex justify-between"
                >
                  <span class="text-gray-500">
                    {{ key.replace('attr_', '').replace('_', ' ') }}
                  </span>

                  <span class="font-medium">
                      {{ value }}
                  </span>
                </div>
              </template>
              <div class="flex justify-between">
                <span class="text-gray-500">Created at</span>
                <span class="font-medium">
                  {{ new Date(product.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </UCard>

          <UCard class="p-4">
            <h3 class="font-semibold text-lg mb-2">Description</h3>
            <p class="text-gray-300 leading-relaxed">
              {{ product.description }}
            </p>
          </UCard>

          <UButton color="primary" icon="mdi:cart">
            Add to cart
          </UButton>

        </div>
      </div>

    </div>
  </UContainer>
</template>

<style scoped>
</style>