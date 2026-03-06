<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold">📊 Stock Screener</h1>
      <div class="flex gap-2 items-center">
        <!-- Grid Selector -->
        <div class="relative">
          <button @click="showGridMenu = !showGridMenu" class="px-3 py-1 rounded-lg text-sm bg-opacity-20 flex items-center gap-2">
            <span>Grid:</span>
            <span class="font-bold">{{ gridSize }}x{{ gridSize }}</span>
          </button>
          <div v-if="showGridMenu" class="absolute right-0 top-10 w-32 bg-dark-card rounded-xl border border-gray-700 shadow-xl overflow-hidden z-10">
            <button v-for="g in [1,2,3,4]" :key="g" @click="setGrid(g)" 
              class="w-full px-4 py-2 text-left hover:bg-opacity-20 flex justify-between">
              <span>{{ g }}x{{ g }}</span>
              <span class="opacity-50">={{ g*g }} charts</span>
            </button>
          </div>
        </div>
        
        <!-- View Mode -->
        <button @click="viewMode = viewMode === 'table' ? 'chart' : 'table'" :class="viewMode === 'chart' ? 'bg-primary-500' : 'bg-opacity-20'" class="px-3 py-1 rounded-lg text-sm">
          {{ viewMode === 'table' ? '📊 Table' : '📈 Chart' }}
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-6">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition"
          :class="activeTab === tab ? 'bg-primary-500 text-white' : 'bg-opacity-20 opacity-70'">
          {{ tab }}
        </button>
      </div>
    </div>
    
    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs opacity-50 border-b border-opacity-20">
            <th class="pb-2">Ticker</th>
            <th class="pb-2">Name</th>
            <th class="pb-2 text-right">Price</th>
            <th class="pb-2 text-right">Change</th>
            <th class="pb-2 text-right">Volume</th>
            <th class="pb-2 text-right">Signal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in filteredStocks" :key="stock.ticker" class="border-b border-opacity-10">
            <td class="py-3 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-3">{{ stock.name }}</td>
            <td class="py-3 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-3 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
            </td>
            <td class="py-3 text-right">{{ formatVolume(stock.volume) }}</td>
            <td class="py-3 text-right">
              <span :class="signalColor(stock.signal)" class="px-2 py-0.5 rounded text-xs">{{ stock.signal }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Chart View (Grid) -->
    <div v-else class="grid gap-3" :style="gridStyle">
      <div v-for="stock in displayedStocks" :key="stock.ticker" 
        class="bg-opacity-30 rounded-xl p-3 border border-opacity-20">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="font-bold text-primary-400">{{ stock.ticker }}</span>
            <span class="text-xs opacity-50 ml-2">{{ stock.name }}</span>
          </div>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
        
        <!-- Chart -->
        <div class="h-16 mb-2">
          <svg viewBox="0 0 100 40" class="w-full h-full">
            <polyline :fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="2"
              :points="generateChartPoints(stock.change)" />
          </svg>
        </div>
        
        <div class="flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>{{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const viewMode = ref('chart')
const gridSize = ref(2)
const showGridMenu = ref(false)
const activeTab = ref('Most Active')
const tabs = ['Overview', 'Gainers', 'Losers', 'Most Active', 'S&P 500', 'NASDAQ 100']

const stocks = ref([
  { ticker: 'TSLA', name: 'Tesla', price: 172.02, change: 1.24, volume: 55000000, signal: 'sell' },
  { ticker: 'PLTR', name: 'Palantir', price: 22.92, change: 1.42, volume: 47000000, signal: 'buy' },
  { ticker: 'NVDA', name: 'NVIDIA', price: 871.30, change: 5.44, volume: 45000000, signal: 'buy' },
  { ticker: 'AMD', name: 'AMD', price: 178.95, change: 4.18, volume: 52000000, signal: 'buy' },
  { ticker: 'MSTR', name: 'MicroStrategy', price: 328.85, change: 9.58, volume: 17000000, signal: 'buy' },
  { ticker: 'AAPL', name: 'Apple', price: 178.50, change: 2.35, volume: 52000000, signal: 'buy' },
  { ticker: 'MSFT', name: 'Microsoft', price: 378.25, change: 1.82, volume: 21000000, signal: 'buy' },
  { ticker: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.95, volume: 18000000, signal: 'neutral' },
  { ticker: 'JPM', name: 'JPMorgan', price: 198.50, change: 0.85, volume: 8000000, signal: 'buy' },
  { ticker: 'XOM', name: 'Exxon', price: 105.30, change: 1.15, volume: 15000000, signal: 'neutral' },
  { ticker: 'META', name: 'Meta', price: 505.75, change: 2.80, volume: 14000000, signal: 'buy' },
  { ticker: 'AMZN', name: 'Amazon', price: 178.25, change: 1.55, volume: 35000000, signal: 'buy' },
  { ticker: 'NFLX', name: 'Netflix', price: 628.90, change: 3.22, volume: 5000000, signal: 'buy' },
  { ticker: 'COIN', name: 'Coinbase', price: 172.45, change: -2.15, volume: 8000000, signal: 'sell' },
  { ticker: 'HOOD', name: 'Robinhood', price: 18.92, change: 0.85, volume: 12000000, signal: 'neutral' },
  { ticker: 'SQ', name: 'Block', price: 78.30, change: -1.25, volume: 9000000, signal: 'neutral' }
])

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`
}))

const displayedStocks = computed(() => {
  let result = [...stocks.value]
  if (activeTab.value === 'Gainers') result = result.sort((a,b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a,b) => a.change - b.change)
  else if (activeTab.value === 'Most Active') result = result.sort((a,b) => b.volume - a.volume)
  return result.slice(0, gridSize.value * gridSize.value)
})

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  if (activeTab.value === 'Gainers') result = result.sort((a,b) => b.change - a.change).slice(0,10)
  else if (activeTab.value === 'Losers') result = result.sort((a,b) => a.change - b.change).slice(0,10)
  else if (activeTab.value === 'Most Active') result = result.sort((a,b) => b.volume - a.volume).slice(0,10)
  return result
})

const setGrid = (g) => { gridSize.value = g; showGridMenu.value = false }

const signalColor = (s) => s === 'buy' ? 'bg-green-500/30 text-green-400' : s === 'sell' ? 'bg-red-500/30 text-red-400' : 'bg-gray-500/30 text-gray-400'
const formatVolume = (v) => v >= 1e9 ? (v/1e9).toFixed(1) + 'B' : v >= 1e6 ? (v/1e6).toFixed(1) + 'M' : v.toString()
const generateChartPoints = (change) => {
  let pts = '', dir = change >= 0 ? 1 : -1
  for (let i = 0; i <= 100; i += 20) pts += `${i},${20 + (Math.random()*10-5)*dir + i*dir*0.15} `
  return pts
}
</script>
