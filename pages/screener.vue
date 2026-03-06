<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
      <div class="flex gap-2">
        <button @click="viewMode = viewMode === 'table' ? 'chart' : 'table'" 
          class="px-4 py-2 rounded-lg text-sm" :class="viewMode === 'table' ? 'bg-primary-500' : 'bg-opacity-20'">
          {{ viewMode === 'table' ? '📊 Table' : '📈 Chart' }}
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" 
        :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" 
        class="px-4 py-2 rounded-full text-sm whitespace-nowrap">{{ tab }}</button>
    </div>
    
    <div class="flex gap-2 mb-4">
      <select v-model="sectorFilter" class="px-3 py-2 rounded-lg text-sm bg-opacity-20">
        <option value="">All Sectors</option>
        <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
      </select>
      
      <!-- Chart Type Selector -->
      <select v-model="chartType" class="px-3 py-2 rounded-lg text-sm bg-opacity-20">
        <option value="line">📈 Line</option>
        <option value="candle">🕯️ Candles</option>
        <option value="area">📊 Area</option>
        <option value="bars">📊 Bars</option>
      </select>
    </div>
    
    <!-- Info Bar -->
    <div class="mb-4 flex items-center justify-between text-sm">
      <span class="opacity-50">{{ selectedStocks.length }} selected</span>
      <button v-if="selectedStocks.length > 0" @click="selectedStocks = []" class="text-primary-400">Clear</button>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-4 gap-2">
      <div v-for="i in 16" :key="i" class="aspect-square bg-opacity-20 rounded-lg animate-pulse"></div>
    </div>
    
    <!-- Chart Grid (4x4 = 16 always) -->
    <div v-else class="grid grid-cols-4 gap-2">
      <div v-for="stock in displayStocks" :key="stock.id" 
        @click="toggleSelect(stock)"
        @mouseenter="hoveredStock = stock"
        @mouseleave="hoveredStock = null"
        class="aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200"
        :class="isSelected(stock) ? 'border-primary-500 bg-primary-500/20' : 'border-transparent bg-opacity-20 hover:border-primary-500/50'">
        
        <!-- Ticker & Change -->
        <div class="p-2 flex justify-between items-start">
          <span class="font-bold text-sm">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs font-bold">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
        
        <!-- Chart -->
        <div class="h-20 px-1">
          <svg viewBox="0 0 60 30" class="w-full h-full" preserveAspectRatio="none">
            <!-- Area -->
            <path v-if="chartType === 'area'" :d="getAreaPath(stock)" :fill="getColor(stock)" opacity="0.3"/>
            
            <!-- Bars -->
            <g v-if="chartType === 'bars'">
              <rect v-for="(bar, i) in stock.chartData.slice(-15)" :key="i"
                :x="i * 4" :y="bar.close > bar.open ? 30 - getBarHeight(bar) : 30 - getBarHeightLow(bar)" 
                width="3" :height="Math.abs(getBarHeight(bar) - getBarHeightLow(bar))" 
                :fill="bar.close > bar.open ? '#4ade80' : '#f87171'" rx="1"/>
            </g>
            
            <!-- Candles -->
            <g v-else-if="chartType === 'candle'">
              <line v-for="(c, i) in stock.chartData.slice(-10)" :key="'w'+i"
                :x1="i * 6 + 3" y1="30 - getY(c.low, stock)" :x2="i * 6 + 3" y2="30 - getY(c.high, stock)"
                :stroke="c.close > c.open ? '#4ade80' : '#f87171'" stroke-width="1"/>
              <rect v-for="(c, i) in stock.chartData.slice(-10)" :key="'b'+i"
                :x="i * 6 + 1" :y="30 - Math.max(c.open, c.close) * scale" 
                width="4" height="Math.max(1, Math.abs(c.close - c.open) * scale)"
                :fill="c.close > c.open ? '#4ade80' : '#f87171'" rx="1"/>
            </g>
            
            <!-- Line / Area default -->
            <polyline v-if="chartType === 'line' || chartType === 'area'"
              fill="none" :stroke="getColor(stock)" stroke-width="1.5"
              :points="getLinePoints(stock)"/>
          </svg>
        </div>
        
        <!-- Price -->
        <div class="px-2 flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>{{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Scroll for more -->
    <div v-if="!loading && displayStocks.length < filteredStocks.length" class="text-center py-4">
      <button @click="showMore" class="px-6 py-2 bg-primary-500 rounded-full text-sm">
        Show More (+{{ Math.min(16, filteredStocks.length - displayStocks.length) }})
      </button>
    </div>
    
    <!-- Selected Stocks List -->
    <div v-if="selectedStocks.length > 0" class="mt-6 p-4 bg-primary-500/20 rounded-xl">
      <h3 class="font-bold mb-2">Selected: {{ selectedStocks.length }}</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="s in selectedStocks" :key="s.id" 
          class="px-3 py-1 bg-primary-500 rounded-full text-sm cursor-pointer"
          @click="toggleSelect(s)">
          {{ s.ticker }} ×
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const viewMode = ref('chart')
const chartType = ref('line')
const activeTab = ref('All')
const sectorFilter = ref('')
const loading = ref(true)
const displayCount = ref(16)
const hoveredStock = ref(null)
const selectedStocks = ref([])

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']

const stocks = ref([])

onMounted(() => {
  setTimeout(() => {
    stocks.value = generateStocks()
    loading.value = false
  }, 600)
})

watch([activeTab, sectorFilter], () => { displayCount.value = 16; selectedStocks.value = [] })

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  if (sectorFilter.value) result = result.filter(s => s.sector === sectorFilter.value)
  if (activeTab.value === 'Gainers') result = result.sort((a, b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a, b) => a.change - b.change)
  else if (activeTab.value === 'Volume') result = result.sort((a, b) => b.volume - a.volume)
  return result
})

const displayStocks = computed(() => filteredStocks.value.slice(0, displayCount.value))

const showMore = () => { displayCount.value = Math.min(displayCount.value + 16, filteredStocks.value.length) }

const toggleSelect = (stock) => {
  const idx = selectedStocks.value.findIndex(s => s.id === stock.id)
  if (idx >= 0) selectedStocks.value.splice(idx, 1)
  else selectedStocks.value.push(stock)
}

const isSelected = (stock) => selectedStocks.value.some(s => s.id === stock.id)

const formatVolume = (v) => v >= 1e6 ? (v/1e6).toFixed(0) + 'M' : v >= 1e3 ? (v/1e3).toFixed(0) + 'K' : v

const getColor = (s) => s.change >= 0 ? '#4ade80' : '#f87171'

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

const getAreaPath = (stock) => {
  const points = getLinePoints(stock)
  const lastX = 60
  return points + ` ${lastX},30 0,30`
}

const scale = 0.5

const getY = (price, stock) => {
  const prices = stock.chartData.map(d => Math.max(d.high, d.low))
  const min = Math.min(...prices), max = Math.max(...prices)
  return ((price - min) / (max - min || 1)) * 26 + 2
}

const getBarHeight = (bar) => Math.max(1, Math.abs(bar.close - bar.open) * 0.5)
const getBarHeightLow = (bar) => Math.max(1, Math.min(bar.close, bar.open) * 0.5)
</script>
