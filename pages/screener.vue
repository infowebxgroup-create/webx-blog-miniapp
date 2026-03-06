<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
        <p class="text-xs opacity-50">{{ filteredStocks.length }} stocks</p>
      </div>
      <div class="flex gap-2">
        <select v-model="sectorFilter" class="px-3 py-2 rounded-lg text-sm bg-opacity-20">
          <option value="">All</option>
          <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
        </select>
        <button @click="showGridMenu = !showGridMenu" class="px-3 py-2 rounded-lg text-sm bg-opacity-20">{{ gridSize }}x{{ gridSize }}</button>
        <div v-if="showGridMenu" class="absolute right-4 top-24 w-24 bg-dark-card rounded-xl border border-gray-700 z-10">
          <button v-for="g in [2,3,4,5,6]" :key="g" @click="setGrid(g)" class="w-full px-4 py-2 hover:bg-opacity-20">{{ g }}x{{ g }}</button>
        </div>
      </div>
    </div>
    
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" class="px-4 py-2 rounded-full text-sm">{{ tab }}</button>
    </div>
    
    <!-- Table -->
    <div v-if="viewMode === 'table'" class="overflow-x-auto">
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
          <tr v-for="stock in paginatedStocks" :key="stock.id" class="border-b border-opacity-10">
            <td class="py-2 opacity-50">{{ stock.id + 1 }}</td>
            <td class="py-2 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-2">{{ stock.sector }}</td>
            <td class="py-2 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-2 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</td>
            <td class="py-2 text-right opacity-70">{{ formatVolume(stock.volume) }}</td>
            <td class="py-2 text-right opacity-70">{{ formatVolume(stock.marketCap) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center py-4">
        <button v-if="displayedCount < filteredStocks.length" @click="loadMore" class="px-6 py-2 bg-primary-500 rounded-full text-sm">Load More +50</button>
      </div>
    </div>
    
    <!-- Grid -->
    <div v-else class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
      <div v-for="stock in displayedStocks" :key="stock.id" class="bg-opacity-20 rounded-xl border border-opacity-10 p-4">
        <div class="flex justify-between mb-2">
          <span class="font-bold">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</span>
        </div>
        <div class="h-16 mb-2 bg-opacity-10 rounded flex items-center justify-center">
          <svg viewBox="0 0 100 40" class="w-full h-full">
            <polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="2" :points="getChartPoints(stock)" />
          </svg>
        </div>
        <div class="flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>{{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="viewMode === 'chart' && displayedCount < filteredStocks.length" class="text-center py-4">
      <button @click="loadMore" class="px-6 py-2 bg-primary-500 rounded-full text-sm">Load More +{{ gridSize * gridSize }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const viewMode = ref('table')
const gridSize = ref(3)
const showGridMenu = ref(false)
const activeTab = ref('All')
const sectorFilter = ref('')
const itemsPerPage = ref(50)

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']

const stocks = ref([])

onMounted(() => {
  stocks.value = generateStocks()
})

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  if (sectorFilter.value) result = result.filter(s => s.sector === sectorFilter.value)
  if (activeTab.value === 'Gainers') result = result.sort((a, b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a, b) => a.change - b.change)
  else if (activeTab.value === 'Volume') result = result.sort((a, b) => b.volume - a.volume)
  return result
})

const displayedCount = computed(() => viewMode.value === 'table' ? itemsPerPage.value : gridSize.value * gridSize.value)
const paginatedStocks = computed(() => filteredStocks.value.slice(0, itemsPerPage.value))
const displayedStocks = computed(() => filteredStocks.value.slice(0, gridSize.value * gridSize.value))

const loadMore = () => {
  if (viewMode.value === 'table') itemsPerPage.value += 50
  else gridSize.value = Math.min(gridSize.value + 1, 6)
}

const setGrid = (g) => { gridSize.value = g; showGridMenu.value = false }

const formatVolume = (v) => {
  if (v >= 1e12) return (v/1e12).toFixed(1) + 'T'
  if (v >= 1e9) return (v/1e9).toFixed(1) + 'B'
  if (v >= 1e6) return (v/1e6).toFixed(1) + 'M'
  return v.toString()
}

const getChartPoints = (stock) => {
  const data = stock.chartData || []
  if (!data.length) return '0,20 100,20'
  const min = Math.min(...data.map(d => d.price))
  const max = Math.max(...data.map(d => d.price))
  const range = max - min || 1
  return data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 40 - ((d.price - min) / range) * 35
    return `${x},${y}`
  }).join(' ')
}
</script>
