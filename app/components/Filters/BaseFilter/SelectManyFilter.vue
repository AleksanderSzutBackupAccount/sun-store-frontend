<script setup lang="ts">

</script>

<template>
  <USelectMenu
      v-model="valueSelect"
      :items="filter.values"
      placeholder="Wybierz..."
      class="w-full"
  />
</template>

<style scoped>

</style>