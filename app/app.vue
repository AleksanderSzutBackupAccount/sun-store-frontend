<template>
  <UApp>
    <UContainer class="py-6">
      <UNavigationMenu
          :items="[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' }
        ]"
      />
    </UContainer>

    <UContainer class="py-10">
      <NuxtPage />
    </UContainer>
  </UApp>
</template>