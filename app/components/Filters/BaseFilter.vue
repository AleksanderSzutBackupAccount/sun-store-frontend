<script setup lang="ts">

import {ref, watch} from "vue";
import type {FilterNumber,  FilterString} from "~/types/ProductSearch";
import RangeFilter from "~/components/Filters/BaseFilter/RangeFilter.vue";


defineProps<{filter: FilterString | FilterNumber, label: string}>()


const value= ref()


const model = defineModel<FilterValue|undefined>({
  default: null
})

const emit = defineEmits<{
  (e: 'update:filter', payload: FilterValue | undefined): void
}>()

onMounted(() => {
  if (model.value) {
    value.value = model.value
  }
})

watch(value, (value) => {
  model.value = value
  emit('update:filter', value)
})

const clear = () => {
  model.value = undefined
  value.value = undefined
  emit('update:filter', undefined)
}
</script>

<template>
  <div
      class="space-y-2"
  >
    <label class="font-medium capitalize flex justify-between">
      {{ label.replace('attr_', '').replace('_', ' ') }}
      <UButton v-if="model" icon="mdi:trash" size="xs" variant="outline" @click="clear"/>
    </label>

    <div v-if="filter.ui === 'select'">
      <USelectMenu
          v-model="value"
          :items="filter.values"
          placeholder="Wybierz..."
          class="w-full"
      />
    </div>
    <div v-if="filter.ui === 'select_many'">
      <USelectMenu
          v-model="value"
          :items="filter.values"
          multiple
          placeholder="Wybierz..."
          class="w-full"
      />
    </div>

    <div v-else-if="filter.ui === 'range'">
      <RangeFilter v-model="value" :filter="filter"/>
    </div>
  </div>

</template>

<style scoped>

</style>