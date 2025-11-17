<script setup lang="ts">
import { ref, watch } from 'vue'

const value = ref<[number, number]>([25, 2000])

const emit = defineEmits<{
  (e: 'update:price', payload: { min: number; max: number }): void
}>()

watch(value, ([min, max]) => {
  emit('update:price', { min, max })
})
</script>

<template>
  <div class="w-64">
    <div class="flex justify-between text-sm mb-1">
      <span>{{ value[0] }} zł</span>
      <span>{{ value[1] }} zł</span>
    </div>

    <USlider
        v-model="value"
        class="mb-1"
        :min="0"
        :max="5000"
        :step="10"
        range
        tooltip
    />
  </div>
</template>