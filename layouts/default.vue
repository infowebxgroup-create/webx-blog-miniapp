<template>
  <div :class="themeClass">
    <header class="fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-blur-lg border-b" :class="headerClass">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl">WEBX<span class="text-primary-400">.blog</span></NuxtLink>
        <div class="relative">
          <button @click="showThemeMenu = !showThemeMenu" class="p-2 rounded-lg text-xl hover:scale-110 transition-transform">{{ themeIcon }}</button>
          <div v-if="showThemeMenu" class="absolute right-0 top-12 w-40 rounded-xl border shadow-xl overflow-hidden" :class="menuClass">
            <button v-for="t in themes" :key="t.name" @click="setTheme(t.name)" class="w-full px-4 py-3 flex items-center gap-3 hover:bg-opacity-20 transition">
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
    <nav class="fixed bottom-0 left-0 right-0 bg-opacity-80 backdrop-blur-lg border-t" :class="headerClass">
      <div class="max-w-md mx-auto flex justify-around h-16 items-center">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 p-2" :class="$route.path === '/' ? 'text-primary-400' : 'text-gray-400'">Home</NuxtLink>
        <NuxtLink to="/blog" class="flex flex-col items-center gap-1 p-2" :class="$route.path.startsWith('/blog') ? 'text-primary-400' : 'text-gray-400'">Blog</NuxtLink>
        <NuxtLink to="/categories" class="flex flex-col items-center gap-1 p-2" :class="$route.path === '/categories' ? 'text-primary-400' : 'text-gray-400'">Topics</NuxtLink>
        <NuxtLink to="/about" class="flex flex-col items-center gap-1 p-2" :class="$route.path === '/about' ? 'text-primary-400' : 'text-gray-400'">About</NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const theme = ref('dark')
const showThemeMenu = ref(false)
const themes = [
  { name: 'dark', label: 'Dark', icon: '🌙' },
  { name: 'light', label: 'Light', icon: '☀️' },
  { name: 'pink', label: 'Pink', icon: '🌸' }
]
const themeIcon = computed(() => themes.find(t => t.name === theme.value)?.icon || '🌙')
const themeClass = computed(() => theme.value === 'dark' ? 'bg-dark-bg text-white' : theme.value === 'light' ? 'bg-light-bg text-gray-900' : 'bg-pink-bg text-pink-100')
const headerClass = computed(() => theme.value === 'dark' ? 'bg-dark-bg border-gray-700' : theme.value === 'light' ? 'bg-light-bg border-gray-200' : 'bg-pink-bg border-pink-700')
const mainClass = computed(() => theme.value === 'dark' ? 'bg-dark-bg' : theme.value === 'light' ? 'bg-light-bg' : 'bg-pink-bg')
const menuClass = computed(() => theme.value === 'dark' ? 'bg-dark-card border-gray-700' : theme.value === 'light' ? 'bg-white border-gray-200' : 'bg-pink-card border-pink-700')
const setTheme = (t) => { theme.value = t; localStorage.setItem('theme', t); showThemeMenu.value = false }
onMounted(() => { theme.value = localStorage.getItem('theme') || 'dark' })
</script>
