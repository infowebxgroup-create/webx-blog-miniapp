<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-6">Topics</h1>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="cat in categories" :key="cat.name"
        class="bg-dark-card rounded-xl p-4 border border-dark-border hover:border-primary-500/50 transition cursor-pointer"
        @click="goToCategory(cat.name)">
        <span :class="cat.color" class="text-2xl mb-2 block">{{ cat.emoji }}</span>
        <h3 class="font-display font-semibold">{{ cat.name }}</h3>
        <p class="text-xs text-gray-500">{{ cat.count }} articles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const categories = [
  { name: 'AI', emoji: '🤖', color: 'text-purple-400', count: 12 },
  { name: 'IT', emoji: '💻', color: 'text-blue-400', count: 8 },
  { name: 'Web3', emoji: '🌐', color: 'text-green-400', count: 6 },
  { name: 'Crypto', emoji: '💰', color: 'text-yellow-400', count: 15 },
  { name: 'Physics', emoji: '⚛️', color: 'text-red-400', count: 4 },
  { name: 'Cosmos', emoji: '🚀', color: 'text-indigo-400', count: 7 }
]

const goToCategory = (name: string) => {
  router.push(`/blog?category=${name}`)
}
</script>
