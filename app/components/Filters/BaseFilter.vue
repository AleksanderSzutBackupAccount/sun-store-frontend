<script setup lang="ts">

import {ref, watch} from "vue";
import type {FilterNumber,  FilterString} from "~/types/ProductSearch";


const props  = defineProps<{filter: FilterString | FilterNumber, label: string}>()


const valueRange = ref<[number, number]>([props.filter.min, props.filter.max])
const valueSelect = ref<string>(null)
const valueSelectMany = ref<[]>([])


const model = defineModel<unknown>({
  default: null
})

onMounted(() => {
   if(model.value) {
     valueRange.value = model.value
     valueSelect.value = model.value
     valueSelectMany.value = model.value
   }
})

const emit = defineEmits<{
  (e: 'update:filter', payload: number[]| string | string[]| null): void
}>()

watch(valueRange, (value) => {
  model.value = value
  emit('update:filter', value)
})
watch(valueSelect, (value) => {
  model.value = value
  emit('update:filter', value)
})
watch(valueSelectMany, (value) => {
  model.value = value
  emit('update:filter', value)
})

const clear = () => {
  model.value = null

  valueRange.value = [props.filter.min, props.filter.max]
  valueSelect.value = null
  valueSelectMany.value = []
  emit('update:filter', null)
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
          v-model="valueSelect"
          :items="filter.values"
          placeholder="Wybierz..."
          class="w-full"
      />
    </div>
    <div v-if="filter.ui === 'select_many'">
      <USelectMenu
          v-model="valueSelectMany"
          :items="filter.values"
          multiple
          placeholder="Wybierz..."
          class="w-full"
      />
    </div>

    <div v-else-if="filter.ui === 'range'">
      <div class="flex justify-between text-sm mb-1">
        <span>{{Math.floor(filter.min * 10 )/10 }} {{ filter.unit || '' }} </span>
        <span v-if="model">{{Math.floor(valueRange[0] * 10 )/10 }} {{ filter.unit || '' }} - {{valueRange[1]}} {{ filter.unit || '' }}</span>
        <span>{{ filter.max }} {{ filter.unit || '' }}</span>
      </div>
      <USlider
          v-model="valueRange"
          :min="Math.floor(filter.min * 10 )/10 "
          :max="filter.max"
          range
          tooltip
      />
    </div>
  </div>

</template>

<style scoped>

</style>