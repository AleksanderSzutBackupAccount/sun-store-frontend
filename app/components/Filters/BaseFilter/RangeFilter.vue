<script setup lang="ts">
import type {FilterNumber} from "~/types/ProductSearch";
import {watch} from "vue";

const props  = defineProps<{filter: FilterNumber}>()

const value = ref<[number, number]|undefined>([props.filter.min, props.filter.max])

const model = defineModel<[number, number]|undefined>({
  default: null
})

onMounted(() => {
  if(model.value) {
    value.value = model.value
  }
})

const isClearing = ref(false)

watch(value, (v) => {
  if(!isClearing.value) {
    model.value = v
    isClearing.value = false
  }
})
watch(model, (v) => {
  if(!v) {
    isClearing.value = true
    value.value =[props.filter.min, props.filter.max]
    return
  }
  value.value = v
})
</script>

<template>
  <div class="flex justify-between text-sm mb-1">
    <span>{{Math.floor(filter.min * 10 )/10 }} {{ filter.unit || '' }} </span>
    <span v-if="value">{{ Math.floor(value[0] * 10) / 10 }} {{
        filter.unit || ''
      }} - {{ value[1] }} {{ filter.unit || '' }}</span>
    <span>{{ filter.max }} {{ filter.unit || '' }}</span>
  </div>
  <USlider
      v-model="value"
      :min="Math.floor(filter.min * 10 )/10 "
      :max="filter.max"
      range
      tooltip
  />
</template>

<style scoped>

</style>