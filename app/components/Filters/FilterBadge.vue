<script setup lang="ts">

defineProps<{label: string}>()

const modal = defineModel<FilterValue | null>({
  default: null
})


const emit = defineEmits(['clear'])

const clear = (item: unknown) => {
  if(Array.isArray(modal.value)) {
    modal.value = modal.value.filter(v => v !== item)
  }
  emit('clear')
}
</script>

<template>
  <UBadge variant="subtle" color="neutral">
    <span> {{ label.replace('attr_', '').replace('_', ' ') }}:</span>
    <template v-if="Array.isArray(modal)">
      <template v-for="item in modal">
        <UBadge
            color="primary"
            variant="solid"
            class="flex items-center gap-1"
        >
          {{item}}
          <UIcon
              name="mdi:close"
              class="cursor-pointer"
              @click="clear(item)"
          />
        </UBadge></template>
    </template>
    <UBadge
        v-else
        color="primary"
        variant="solid"
        class="flex items-center gap-1"
    >
      {{ modal }}
    </UBadge>
  </UBadge>
</template>

<style scoped>

</style>