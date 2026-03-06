<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-6">Latest Articles</h1>
    
    <div class="space-y-4">
      <article v-for="post in posts" :key="post._path" 
        class="bg-dark-card rounded-xl p-4 border border-dark-border hover:border-primary-500/50 transition">
        <div class="flex items-center gap-2 mb-2">
          <span :class="categoryColors[post.category] || 'bg-gray-600'" 
            class="text-xs px-2 py-0.5 rounded-full">{{ post.category }}</span>
          <span class="text-xs text-gray-500">{{ formatDate(post.date) }}</span>
        </div>
        <NuxtLink :to="'/blog' + post._path">
          <h2 class="font-display font-semibold text-lg mb-2 hover:text-primary-400 transition">
            {{ post.title }}
          </h2>
          <p class="text-sm text-gray-400 line-clamp-2">{{ post.description }}</p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const categoryColors: Record<string, string> = {
  AI: 'bg-purple-600',
  IT: 'bg-blue-600',
  Web3: 'bg-green-600',
  Crypto: 'bg-yellow-600',
  Physics: 'bg-red-600',
  Cosmos: 'bg-indigo-600'
}

const { data: posts } = await useAsyncData('posts', () => 
  queryContent('/blog').sort({ date: -1 }).limit(10).find()
)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
