<script setup lang="ts">
import type {FilterNumber, FilterString} from "~/types/ProductSearch";
import {watch} from "vue";

const props  = defineProps<{filter: FilterString}>()

const value = ref<string|undefined>()

const model = defineModel<string|undefined>({
  default: null
})

watch(value, (v) => {
  model.value = v
})
watch(model, (v) => {
  if(!v) {
    value.value  = undefined
    return
  }
  value.value = v
})
</script>

<template>
  <USelectMenu
      v-model="value"
      :items="filter.values"
      placeholder="Wybierz..."
      class="w-full"
  />
</template>

<style scoped>

</style>