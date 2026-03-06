<template>
  <div :class="theme" class="min-h-screen bg-dark-bg dark:bg-dark-bg light:bg-light-bg pink:bg-pink-bg transition-colors">
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 dark:bg-dark-bg/80 light:bg-light-bg/80 pink:bg-pink-bg/80 backdrop-blur-lg border-b border-dark-border dark:border-dark-border light:border-light-border pink:border-pink-border">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl">
          WEBX<span class="text-primary-400">.blog</span>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <button @click="cycleTheme" class="p-2 hover:bg-dark-card dark:hover:bg-dark-card light:hover:bg-gray-100 pink:hover:bg-pink-card rounded-lg transition">
            <span v-if="theme === 'dark'">🌙</span>
            <span v-else-if="theme === 'light'">☀️</span>
            <span v-else>🌸</span>
          </button>
        </div>
      </nav>
    </header>
    
    <main class="pt-14 pb-20">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-dark-bg/80 dark:bg-dark-bg/80 light:bg-light-bg/80 pink:bg-pink-bg/80 backdrop-blur-lg border-t border-dark-border dark:border-dark-border light:border-light-border pink:border-pink-border">
      <div class="max-w-md mx-auto flex justify-around h-16 items-center">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" 
          class="flex flex-col items-center gap-1 p-2 transition"
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

const { theme, setTheme, initTheme } = useTheme()

const navItems = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/blog', label: 'Blog', icon: IconBook },
  { to: '/categories', label: 'Topics', icon: IconGrid },
  { to: '/about', label: 'About', icon: IconUser }
]

const cycleTheme = () => {
  const themes = ['dark', 'light', 'pink']
  const i = themes.indexOf(theme.value)
  setTheme(themes[(i + 1) % themes.length])
}

onMounted(() => initTheme())
</script>
