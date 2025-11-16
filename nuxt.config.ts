// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/hints',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/eslint'
  ],
    css: ['~/assets/css/main.css']
})