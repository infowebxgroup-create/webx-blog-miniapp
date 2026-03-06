<template>
  <div class="min-h-screen bg-dark-bg">
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <nav class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-xl">
          WEBX<span class="text-primary-400">.blog</span>
        </NuxtLink>
        <button class="p-2 hover:bg-dark-card rounded-lg transition">
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
        <NuxtLink to="/" class="flex flex-col items-center gap-1 p-2">
          <svg class="w-5 h-5" :class="$route.path === '/' ? 'text-primary-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs" :class="$route.path === '/' ? 'text-primary-400' : 'text-gray-400'">Home</span>
        </NuxtLink>
        
        <NuxtLink to="/blog" class="flex flex-col items-center gap-1 p-2">
          <svg class="w-5 h-5" :class="$route.path.startsWith('/blog') ? 'text-primary-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span class="text-xs" :class="$route.path.startsWith('/blog') ? 'text-primary-400' : 'text-gray-400'">Blog</span>
        </NuxtLink>
        
        <NuxtLink to="/categories" class="flex flex-col items-center gap-1 p-2">
          <svg class="w-5 h-5" :class="$route.path === '/categories' ? 'text-primary-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span class="text-xs" :class="$route.path === '/categories' ? 'text-primary-400' : 'text-gray-400'">Topics</span>
        </NuxtLink>
        
        <NuxtLink to="/about" class="flex flex-col items-center gap-1 p-2">
          <svg class="w-5 h-5" :class="$route.path === '/about' ? 'text-primary-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-xs" :class="$route.path === '/about' ? 'text-primary-400' : 'text-gray-400'">About</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
