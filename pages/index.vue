<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-6">Latest Articles</h1>
    
    <!-- News Section -->
    <div class="mb-8">
      <h2 class="font-display text-lg font-semibold mb-3 text-primary-400">📰 Latest News</h2>
      <div v-if="news.length" class="space-y-3">
        <article v-for="(item, i) in news" :key="i" class="bg-opacity-50 rounded-xl p-4 border border-opacity-20" :class="cardClass">
          <h3 class="font-semibold text-sm mb-1">{{ item.title }}</h3>
          <p class="text-xs opacity-70">{{ item.description }}</p>
          <span class="text-xs opacity-50">{{ item.source }}</span>
        </article>
      </div>
      <p v-else class="text-sm opacity-50">Loading news...</p>
    </div>
    
    <!-- Articles -->
    <h2 class="font-display text-lg font-semibold mb-3">Articles</h2>
    <div class="space-y-4">
      <article v-for="post in posts" :key="post._path" class="bg-opacity-50 rounded-xl p-4 border border-opacity-20" :class="cardClass">
        <NuxtLink :to="'/blog' + post._path">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs px-2 py-0.5 rounded-full bg-primary-600">{{ post.category }}</span>
            <span class="text-xs opacity-50">{{ post.date }}</span>
          </div>
          <h2 class="font-display font-semibold text-lg mb-2 text-primary-400">{{ post.title }}</h2>
          <p class="text-sm opacity-70 line-clamp-2">{{ post.description }}</p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const news = ref<any[]>([])

const cardClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-card border-gray-700'
  if (theme.value === 'light') return 'bg-white border-gray-200'
  return 'bg-pink-card border-pink-700'
})

const theme = ref('dark')

onMounted(async () => {
  theme.value = localStorage.getItem('theme') || 'dark'
  
  // Fetch news
  try {
    const { data } = await useFetch('/api/news')
    if (data.value?.articles) {
      news.value = data.value.articles
    }
  } catch (e) {
    console.log('News error')
  }
})

const { data: posts } = await useAsyncData('posts', () => 
  queryContent('/blog').sort({ date: -1 }).limit(10).find()
)
</script>
