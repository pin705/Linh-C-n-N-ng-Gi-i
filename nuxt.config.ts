export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'nuxt-mongoose',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  mongoose: {
    uri: process.env.MONGODB_URI, // Chúng ta sẽ tạo file .env ngay sau đây
    // options: {},
    modelsDir: 'models'
  }
})
