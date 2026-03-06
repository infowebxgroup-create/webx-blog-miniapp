<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold">📊 Stock Screener</h1>
      <div class="flex gap-2">
        <button @click="viewMode = 'table'" :class="viewMode === 'table' ? 'bg-primary-500' : 'bg-opacity-20'" class="px-3 py-1 rounded-lg text-sm">Table</button>
        <button @click="viewMode = 'chart'" :class="viewMode === 'chart' ? 'bg-primary-500' : 'bg-opacity-20'" class="px-3 py-1 rounded-lg text-sm">Chart</button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-6 space-y-3">
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
          <tr v-for="stock in filteredStocks" :key="stock.ticker" class="border-b border-opacity-10 hover:bg-opacity-10 cursor-pointer">
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
    
    <!-- Chart View (TradingView style) -->
    <div v-else class="space-y-2">
      <div v-for="stock in filteredStocks" :key="stock.ticker" 
        class="bg-opacity-30 rounded-xl p-4 border border-opacity-20 flex items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-primary-400">{{ stock.ticker }}</span>
            <span class="text-xs opacity-50">{{ stock.name }}</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-bold">${{ stock.price.toFixed(2) }}</span>
            <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-sm">
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
            </span>
          </div>
        </div>
        
        <!-- Mini Chart -->
        <div class="w-24 h-8">
          <svg viewBox="0 0 100 40" class="w-full h-full">
            <polyline :fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="2"
              :points="generateChartPoints(stock.change)" />
          </svg>
        </div>
        
        <div class="text-right">
          <p class="text-xs opacity-50">Volume</p>
          <p class="text-sm">{{ formatVolume(stock.volume) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const viewMode = ref('table')
const activeTab = ref('Most Active')
const tabs = ['Overview', 'Gainers', 'Losers', 'Most Active', 'S&P 500', 'NASDAQ 100']

const stocks = ref([
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 172.02, change: 1.24, volume: 55000000, marketCap: 557000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'sell' },
  { ticker: 'PLTR', name: 'Palantir', price: 22.92, change: 1.42, volume: 47000000, marketCap: 52000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 871.30, change: 5.44, volume: 45000000, marketCap: 2160000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'AMD', name: 'AMD Inc.', price: 178.95, change: 4.18, volume: 52000000, marketCap: 289000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'MSTR', name: 'MicroStrategy', price: 328.85, change: 9.58, volume: 17000000, marketCap: 7200000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.35, volume: 52000000, marketCap: 2800000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'MSFT', name: 'Microsoft', price: 378.25, change: 1.82, volume: 21000000, marketCap: 2810000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.95, volume: 18000000, marketCap: 1780000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'neutral' },
  { ticker: 'JPM', name: 'JPMorgan', price: 198.50, change: 0.85, volume: 8000000, marketCap: 571000000000, sector: 'Finance', exchange: 'NYSE', signal: 'buy' },
  { ticker: 'XOM', name: 'Exxon Mobil', price: 105.30, change: 1.15, volume: 15000000, marketCap: 430000000000, sector: 'Energy', exchange: 'NYSE', signal: 'neutral' }
])

const filteredStocks = computed(() => {
  let result = stocks.value
  if (activeTab.value === 'Gainers') result = [...stocks.value].sort((a,b) => b.change - a.change).slice(0,5)
  else if (activeTab.value === 'Losers') result = [...stocks.value].sort((a,b) => a.change - b.change).slice(0,5)
  else if (activeTab.value === 'Most Active') result = [...stocks.value].sort((a,b) => b.volume - a.volume).slice(0,5)
  return result
})

const signalColor = (signal) => {
  if (signal === 'buy') return 'bg-green-500/30 text-green-400'
  if (signal === 'sell') return 'bg-red-500/30 text-red-400'
  return 'bg-gray-500/30 text-gray-400'
}

const formatVolume = (v) => {
  if (v >= 1e9) return (v/1e9).toFixed(1) + 'B'
  if (v >= 1e6) return (v/1e6).toFixed(1) + 'M'
  return v.toString()
}

const generateChartPoints = (change) => {
  // Generate mini chart points based on change direction
  let points = ''
  const direction = change >= 0 ? 1 : -1
  for (let i = 0; i <= 100; i += 20) {
    const y = 20 + (Math.random() * 10 - 5) * direction + (i * direction * 0.15)
    points += `${i},${y} `
  }
  return points
}
</script>
