<template>
  <div :class="themeClass">
    <header class="fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-blur-lg border-b border-opacity-20" :class="headerClass">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl">WEBX<span class="text-primary-400">.blog</span></NuxtLink>
        <div class="relative">
          <button @click="showThemeMenu = !showThemeMenu" class="p-2 rounded-lg text-xl hover:scale-110 transition-transform">
            {{ themeIcon }}
          </button>
          
          <!-- Theme Menu -->
          <div v-if="showThemeMenu" class="absolute right-0 top-12 w-40 rounded-xl border border-opacity-20 shadow-xl overflow-hidden" :class="menuClass">
            <button v-for="t in themes" :key="t.name" @click="setTheme(t.name)" 
              class="w-full px-4 py-3 flex items-center gap-3 hover:bg-opacity-20 transition"
              :class="theme === t.name ? 'bg-primary-500 bg-opacity-20' : ''">
              <span class="text-lg">{{ t.icon }}</span>
              <span class="text-sm font-medium">{{ t.label }}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
    
    <main class="pt-14 pb-20" :class="mainClass">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-opacity-80 backdrop-blur-lg border-t border-opacity-20" :class="headerClass">
      <div class="max-w-md mx-auto flex justify-around h-16 items-center">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex flex-col items-center gap-1 p-2 transition" :class="$route.path === item.to ? 'text-primary-400' : 'text-gray-400'">
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-xs">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import IconHome from '~/components/icons/IconHome.vue'
import IconBook from '~/components/icons/IconBook.vue'
import IconGrid from '~/components/icons/IconGrid.vue'
import IconUser from '~/components/icons/IconUser.vue'

const theme = ref('dark')
const showThemeMenu = ref(false)

const themes = [
  { name: 'dark', label: 'Dark', icon: '🌙' },
  { name: 'light', label: 'Light', icon: '☀️' },
  { name: 'pink', label: 'Pink', icon: '🌸' }
]

const themeIcon = computed(() => themes.find(t => t.name === theme.value)?.icon || '🌙')

const themeClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-bg text-white'
  if (theme.value === 'light') return 'bg-light-bg text-gray-900'
  return 'bg-pink-bg text-pink-100'
})

const headerClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-bg border-gray-700'
  if (theme.value === 'light') return 'bg-light-bg border-gray-200'
  return 'bg-pink-bg border-pink-700'
})

const mainClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-bg'
  if (theme.value === 'light') return 'bg-light-bg'
  return 'bg-pink-bg'
})

const menuClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-card border-gray-700'
  if (theme.value === 'light') return 'bg-white border-gray-200'
  return 'bg-pink-card border-pink-700'
})

const navItems = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/blog', label: 'Blog', icon: IconBook },
  { to: '/categories', label: 'Topics', icon: IconGrid },
  { to: '/about', label: 'About', icon: IconUser }
]

const setTheme = (t: string) => {
  theme.value = t
  localStorage.setItem('theme', t)
  showThemeMenu.value = false
}

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'dark'
})
</script>
