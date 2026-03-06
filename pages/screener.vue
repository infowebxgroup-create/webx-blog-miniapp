<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
        <p class="text-xs opacity-50">{{ stocks.length }} stocks • {{ loadedCount }} loaded</p>
      </div>
      <div class="flex gap-2 items-center">
        <button @click="viewMode = viewMode === 'table' ? 'chart' : 'table'" 
          class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="viewMode === 'table' ? 'bg-primary-500' : 'bg-opacity-20'">
          {{ viewMode === 'table' ? '📊 Table' : '📈 Chart' }}
        </button>
        <select v-model="sectorFilter" class="px-3 py-2 rounded-lg text-sm bg-opacity-20">
          <option value="">All Sectors</option>
          <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" 
        :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" 
        class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition">
        {{ tab }}
      </button>
    </div>
    
    <!-- Loading Skeletons -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-opacity-20 rounded-xl p-4 animate-pulse">
        <div class="flex justify-between mb-2">
          <div class="h-4 w-16 bg-opacity-30 rounded"></div>
          <div class="h-4 w-12 bg-opacity-30 rounded"></div>
        </div>
        <div class="h-16 bg-opacity-30 rounded"></div>
      </div>
    </div>
    
    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs opacity-50 border-b">
            <th class="pb-2">#</th>
            <th class="pb-2">Ticker</th>
            <th class="pb-2">Sector</th>
            <th class="pb-2 text-right">Price</th>
            <th class="pb-2 text-right">%</th>
            <th class="pb-2 text-right">Volume</th>
            <th class="pb-2 text-right">M.Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in displayedStocks" :key="stock.id" class="border-b border-opacity-10 hover:bg-opacity-5 transition">
            <td class="py-3 opacity-50">{{ stock.id + 1 }}</td>
            <td class="py-3 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-3 text-xs">{{ stock.sector }}</td>
            <td class="py-3 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-3 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
            </td>
            <td class="py-3 text-right opacity-70">{{ formatVolume(stock.volume) }}</td>
            <td class="py-3 text-right opacity-70">{{ formatVolume(stock.marketCap) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Chart Grid View -->
    <div v-else class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
      <div v-for="stock in displayedStocks" :key="stock.id" 
        class="bg-opacity-20 rounded-xl border border-opacity-10 p-4 hover:bg-opacity-30 transition cursor-pointer">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-bold text-lg">{{ stock.ticker }}</span>
            <span class="text-xs opacity-50 ml-2">{{ stock.sector }}</span>
          </div>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="font-bold">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
        
        <!-- SVG Chart -->
        <div class="h-20 mb-2">
          <svg viewBox="0 0 100 45" class="w-full h-full">
            <polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="2" 
              :points="getChartPoints(stock)" />
          </svg>
        </div>
        
        <div class="flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>Vol: {{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Infinite Scroll Trigger -->
    <div ref="scrollTrigger" class="h-4 mt-4"></div>
    
    <!-- Grid Size Selector -->
    <div v-if="viewMode === 'chart'" class="fixed bottom-24 right-4 z-10">
      <button @click="cycleGrid" class="w-12 h-12 bg-primary-500 rounded-full shadow-lg flex items-center justify-center font-bold">
        {{ gridSize }}x{{ gridSize }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const viewMode = ref('table')
const gridSize = ref(3)
const activeTab = ref('All')
const sectorFilter = ref('')
const loading = ref(true)
const loadedCount = ref(0)
const batchSize = 30
const scrollTrigger = ref(null)

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']

const stocks = ref([])

onMounted(() => {
  // Initial load
  setTimeout(() => {
    stocks.value = generateStocks()
    loadedCount.value = stocks.value.length
    loading.value = false
  }, 800)
  
  // Infinite scroll
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && loadedCount.value < filteredStocks.value.length) {
      // Already loaded all
    }
  }, { threshold: 0.1 })
  
  if (scrollTrigger.value) observer.observe(scrollTrigger.value)
  
  onUnmounted(() => observer.disconnect())
})

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  if (sectorFilter.value) result = result.filter(s => s.sector === sectorFilter.value)
  if (activeTab.value === 'Gainers') result = result.sort((a, b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a, b) => a.change - b.change)
  else if (activeTab.value === 'Volume') result = result.sort((a, b) => b.volume - a.volume)
  return result
})

const displayedStocks = computed(() => filteredStocks.value.slice(0, viewMode.value === 'table' ? 100 : gridSize.value * gridSize.value))

const cycleGrid = () => { gridSize.value = gridSize.value >= 6 ? 2 : gridSize.value + 1 }

const formatVolume = (v) => {
  if (v >= 1e12) return (v/1e12).toFixed(1) + 'T'
  if (v >= 1e9) return (v/1e9).toFixed(1) + 'B'
  if (v >= 1e6) return (v/1e6).toFixed(1) + 'M'
  return v.toString()
}

const getChartPoints = (stock) => {
  const data = stock.chartData || []
  if (!data.length) return '0,22 100,22'
  const prices = data.map(d => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  return data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 42 - ((d.price - min) / range) * 38
    return `${x},${y}`
  }).join(' ')
}
</script>
