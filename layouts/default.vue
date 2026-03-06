<template>
  <div :class="themeClass">
    <header class="fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-blur-lg border-b border-opacity-20" :class="headerClass">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl">WEBX<span class="text-primary-400">.blog</span></NuxtLink>
        <div class="relative">
          <button @click="showThemeMenu = !showThemeMenu" class="p-2 rounded-lg text-xl hover:scale-110 transition-transform">{{ themeIcon }}</button>
          <div v-if="showThemeMenu" class="absolute right-0 top-12 w-40 rounded-xl border border-opacity-20 shadow-xl overflow-hidden" :class="menuClass">
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
    <nav class="fixed bottom-0 left-0 right-0 bg-opacity-80 backdrop-blur-lg border-t border-opacity-20" :class="headerClass">
      <div class="max-w-md mx-auto flex justify-around h-16 items-center">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 p-2 transition" :class="$route.path === '/' ? 'text-primary-400' : 'text-gray-400'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-xs">Home</span>
        </NuxtLink>
        <NuxtLink to="/blog" class="flex flex-col items-center gap-1 p-2 transition" :class="$route.path.startsWith('/blog') ? 'text-primary-400' : 'text-gray-400'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          <span class="text-xs">Blog</span>
        </NuxtLink>
        <NuxtLink to="/categories" class="flex flex-col items-center gap-1 p-2 transition" :class="$route.path === '/categories' ? 'text-primary-400' : 'text-gray-400'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          <span class="text-xs">Topics</span>
        </NuxtLink>
        <NuxtLink to="/about" class="flex flex-col items-center gap-1 p-2 transition" :class="$route.path === '/about' ? 'text-primary-400' : 'text-gray-400'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="text-xs">About</span>
        </NuxtLink>
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
const main => theme.value ===Class = computed(() 'dark' ? 'bg-dark-bg' : theme.value === 'light' ? 'bg-light-bg' : 'bg-pink-bg')
const menuClass = computed(() => theme.value === 'dark' ? 'bg-dark-card border-gray-700' : theme.value === 'light' ? 'bg-white border-gray-200' : 'bg-pink-card border-pink-700')
const setTheme = (t) => { theme.value = t; localStorage.setItem('theme', t); showThemeMenu.value = false }
onMounted(() => { theme.value = localStorage.getItem('theme') || 'dark' })
</script>
