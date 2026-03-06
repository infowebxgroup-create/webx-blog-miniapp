export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  app: {
    head: {
      title: 'WEBX Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { name: 'theme-color', content: '#0F172A' },
        { name: 'description', content: 'AI, IT, Web3, Crypto, Physics, Cosmos Blog' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  googleFonts: {
    families: {
      'Space Grotesk': [400, 500, 600, 700],
      'Inter': [400, 500, 600]
    },
    display: 'swap'
  },

  content: {
    highlight: {
      theme: 'github-dark'
    },
    markdown: {
      toc: { depth: 3, searchDepth: 3 }
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },

  compatibilityDate: '2024-11-01'
})
