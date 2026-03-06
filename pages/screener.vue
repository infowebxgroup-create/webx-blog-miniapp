<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
        <p class="text-xs opacity-50">{{ filteredStocks.length }} stocks</p>
      </div>
      <div class="flex gap-2">
        <button @click="viewMode = viewMode === 'table' ? 'chart' : 'table'" 
          class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="viewMode === 'table' ? 'bg-primary-500' : 'bg-opacity-20'">
          {{ viewMode === 'table' ? '📊 Table' : '📈 Chart' }}
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" 
        :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" 
        class="px-4 py-2 rounded-full text-sm whitespace-nowrap">
        {{ tab }}
      </button>
    </div>
    
    <select v-model="sectorFilter" class="mb-4 px-3 py-2 rounded-lg text-sm bg-opacity-20">
      <option value="">All Sectors</option>
      <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
    </select>
    
    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-opacity-20 rounded-xl p-4 animate-pulse">
        <div class="h-4 w-24 bg-opacity-30 rounded mb-2"></div>
        <div class="h-16 bg-opacity-30 rounded"></div>
      </div>
    </div>
    
    <!-- Table -->
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
          <tr v-for="stock in visibleStocks" :key="stock.id" class="border-b border-opacity-10">
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
    
    <!-- Chart Grid -->
    <div v-else class="grid gap-3" :style="gridStyle">
      <div v-for="stock in visibleStocks" :key="stock.id" 
        class="bg-opacity-20 rounded-xl border border-opacity-10 p-4">
        <div class="flex justify-between mb-2">
          <span class="font-bold">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
        <div class="h-20 mb-2">
          <svg viewBox="0 0 100 45" class="w-full h-full">
            <polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="2" :points="getChartPoints(stock)" />
          </svg>
        </div>
        <div class="flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>{{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Infinite Scroll Trigger -->
    <div ref="trigger" class="h-20 flex items-center justify-center">
      <div v-if="visibleCount < filteredStocks.length" class="text-sm opacity-50">
        Scroll for more ({{ filteredStocks.length - visibleCount }} remaining)...
      </div>
      <div v-else class="text-sm opacity-30">All loaded</div>
    </div>
    
    <!-- Grid Selector Button -->
    <div v-if="viewMode === 'chart'" class="fixed bottom-24 right-4 z-20">
      <button @click="showGridMenu = !showGridMenu" 
        class="w-14 h-14 bg-primary-500 rounded-full shadow-lg flex items-center justify-center font-bold text-lg">
        {{ gridSize }}×{{ gridSize }}
      </button>
      
      <!-- Grid Menu (TradingView style) -->
      <div v-if="showGridMenu" class="absolute bottom-16 right-0 w-72 bg-dark-card rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-bold">РЕЖИМ СЕТКИ ГРАФИКОВ</h3>
        </div>
        
        <div class="p-4 space-y-3">
          <!-- Auto / Manual -->
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="gridMode" value="auto" class="accent-primary-500">
              <span class="text-sm">Авто</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="gridMode" value="manual" class="accent-primary-500">
              <span class="text-sm">Другой</span>
            </label>
          </div>
          
          <!-- Grid Preview -->
          <div v-if="gridMode === 'manual'" class="bg-opacity-10 p-2 rounded-lg">
            <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${Math.min(gridSize, 4)}, 1fr)` }">
              <div v-for="i in Math.min(gridSize * gridSize, 16)" :key="i" 
                class="aspect-square bg-primary-500/30 rounded-sm">
              </div>
            </div>
          </div>
          
          <!-- Options -->
          <div class="space-y-2">
            <label v-for="opt in gridOptions" :key="opt.value" 
              class="flex items-center gap-3 cursor-pointer hover:bg-opacity-10 p-2 rounded-lg transition">
              <input type="radio" v-model="gridSize" :value="opt.value" 
                :disabled="gridMode === 'auto'" class="accent-primary-500">
              <span class="text-sm" :class="gridMode === 'auto' ? 'opacity-50' : ''">{{ opt.label }}</span>
            </label>
          </div>
        </div>
        
        <div class="p-3 bg-opacity-10 text-center text-sm">
          {{ gridSize }} × {{ gridSize }} на экран
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const viewMode = ref('table')
const gridSize = ref(3)
const gridMode = ref('auto')
const activeTab = ref('All')
const sectorFilter = ref('')
const loading = ref(true)
const showGridMenu = ref(false)
const visibleCount = ref(30)
const trigger = ref(null)

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']
const gridOptions = [
  { value: 1, label: '1 × 1 (1 график)' },
  { value: 2, label: '2 × 2 (4 графика)' },
  { value: 3, label: '3 × 3 (9 графиков)' },
  { value: 4, label: '4 × 4 (16 графиков)' },
  { value: 6, label: '6 × 6 (36 графиков)' }
]

const stocks = ref([])

onMounted(() => {
  setTimeout(() => {
    stocks.value = generateStocks()
    loading.value = false
  }, 800)
  
  // Infinite scroll
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount.value < filteredStocks.value.length) {
      visibleCount.value += 30
    }
  }, { rootMargin: '100px' })
  
  if (trigger.value) observer.observe(trigger.value)
  onUnmounted(() => observer.disconnect())
})

// Reset visible count when filters change
watch([activeTab, sectorFilter], () => { visibleCount.value = 30 })

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  if (sectorFilter.value) result = result.filter(s => s.sector === sectorFilter.value)
  if (activeTab.value === 'Gainers') result = result.sort((a, b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a, b) => a.change - b.change)
  else if (activeTab.value === 'Volume') result = result.sort((a, b) => b.volume - a.volume)
  return result
})

const visibleStocks = computed(() => {
  const max = viewMode.value === 'table' ? visibleCount.value : gridSize.value * gridSize.value
  return filteredStocks.value.slice(0, max)
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`
}))

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
