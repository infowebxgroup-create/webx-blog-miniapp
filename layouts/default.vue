<template>
  <div class="min-h-screen bg-dark-bg">
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl text-white">
          WEBX<span class="text-primary-400">.blog</span>
        </NuxtLink>
        <button @click="toggleSearch" class="p-2 hover:bg-dark-card rounded-lg transition">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </nav>
    </header>
    
    <main class="pt-14 pb-20">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-dark-bg/80 backdrop-blur-lg border-t border-dark-border">
      <div class="max-w-md mx-auto flex justify-around h-16 items-center">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" 
          class="flex flex-col items-center gap-1 p-2 rounded-lg transition"
          :class="$route.path === item.to ? 'text-primary-400' : 'text-gray-400 hover:text-white'">
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-xs">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import IconHome from '~/components/icons/IconHome.vue'
import IconBook from '~/components/icons/IconBook.vue'
import IconGrid from '~/components/icons/IconGrid.vue'
import IconUser from '~/components/icons/IconUser.vue'

const navItems = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/blog', label: 'Blog', icon: IconBook },
  { to: '/categories', label: 'Topics', icon: IconGrid },
  { to: '/about', label: 'About', icon: IconUser }
]

const toggleSearch = () => {
  // TODO: Search modal
}
</script>
