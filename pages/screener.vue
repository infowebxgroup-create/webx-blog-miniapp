<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-4">📊 Screener</h1>
    
    <!-- Filters -->
    <div class="mb-4 flex gap-2 overflow-x-auto">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" 
        class="px-4 py-2 rounded-full text-sm" :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'">
        {{ tab }}
      </button>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-4 gap-2">
      <div v-for="i in 16" :key="i" class="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
    
    <!-- Grid -->
    <div v-else class="grid grid-cols-4 gap-2">
      <div v-for="stock in displayStocks" :key="stock.id" 
        class="aspect-square rounded-lg border-2 border-transparent bg-gray-800 p-2">
        <div class="flex justify-between mb-1">
          <span class="font-bold text-sm">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
        <div class="h-16">
          <svg viewBox="0 0 60 30" class="w-full h-full">
            <polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="1.5"
              :points="getLinePoints(stock)"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && displayStocks.length < filteredStocks.length" class="text-center py-4">
      <button @click="showMore" class="px-6 py-2 bg-primary-500 rounded-full">More +16</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const activeTab = ref('All')
const loading = ref(true)
const displayCount = ref(16)

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const stocks = ref([])

onMounted(() => {
  setTimeout(() => {
    stocks.value = generateStocks()
    loading.value = false
  }, 500)
})

const filteredStocks = computed(() => {
  let r = [...stocks.value]
  if (activeTab.value === 'Gainers') r.sort((a,b) => b.change - a.change)
  else if (activeTab.value === 'Losers') r.sort((a,b) => a.change - b.change)
  else if (activeTab.value === 'Volume') r.sort((a,b) => b.volume - a.volume)
  return r
})

const displayStocks = computed(() => filteredStocks.value.slice(0, displayCount.value))

const showMore = () => { displayCount.value += 16 }

const getLinePoints = (stock) => {
  const data = stock.chartData || []
  if (!data.length) return '0,15 60,15'
  const prices = data.map(d => d.price)
  const min = Math.min(...prices), max = Math.max(...prices)
  const range = max - min || 1
  return data.map((d, i) => {
    const x = (i / (data.length - 1)) * 60
    const y = 30 - ((d.price - min) / range) * 26
    return `${x},${y}`
  }).join(' ')
}
</script>
