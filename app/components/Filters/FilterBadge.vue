<script setup lang="ts">

defineProps<{ label: string }>()

const modal = defineModel<FilterValue | undefined>({
  default: undefined
})


const emit = defineEmits(['clear'])

const clear = (item: unknown) => {
  if (Array.isArray(modal.value)) {
    modal.value = modal.value.filter(v => v !== item)
  }
  emit('clear')
}

const isRange = computed(() => {
  return Array.isArray(modal.value) && modal.value.length === 2 && typeof modal.value[0] === "number" && typeof modal.value[1] === "number"
})

</script>

<template>
  <UBadge variant="subtle" color="neutral">
    <span> {{ label.replace('attr_', '').replace('_', ' ') }}</span>
    <template v-if="modal && isRange">
      <UBadge
          color="primary"
          variant="solid"
          class="flex items-center gap-1"
      >
        {{modal[0]}}-{{modal[1]}}
      </UBadge>
    </template>
    <template v-else-if="Array.isArray(modal)">
      <template v-for="item in modal" :key="item">
        <UBadge
            color="primary"
            variant="solid"
            class="flex items-center gap-1"
        >
          {{ item }}
          <UIcon
              name="mdi:close"
              class="cursor-pointer"
              @click="clear(item)"
          />
        </UBadge>
      </template>
    </template>
    <UBadge
        v-else
        color="primary"
        variant="solid"
        class="flex items-center gap-1"
    >
      {{ modal }}
    </UBadge>
    <UIcon
        name="mdi:close"
        class="cursor-pointer"
        @click="modal = undefined"
    />
  </UBadge>
</template>

<style scoped>

</style>