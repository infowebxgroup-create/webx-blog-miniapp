<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-6">All Articles</h1>
    <ContentList path="/blog" v-slot="{ list }">
      <div class="space-y-4">
        <article v-for="post in list" :key="post._path" class="bg-opacity-50 rounded-xl p-4 border border-opacity-20" :class="cardClass">
          <NuxtLink :to="post._path">
            <h2 class="font-display font-semibold text-lg mb-2">{{ post.title }}</h2>
            <p class="text-sm opacity-70">{{ post.description }}</p>
          </NuxtLink>
        </article>
      </div>
    </ContentList>
  </div>
</template>

<script setup>
const theme = ref('dark')
const cardClass = computed(() => {
  if (theme.value === 'dark') return 'bg-dark-card border-gray-700'
  if (theme.value === 'light') return 'bg-white border-gray-200'
  return 'bg-pink-card border-pink-700'
})
onMounted(() => { theme.value = localStorage.getItem('theme') || 'dark' })
</script>
