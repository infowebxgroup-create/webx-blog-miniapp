<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
      <div class="flex gap-2 items-center">
        <div class="relative">
          <button @click="showGridMenu = !showGridMenu" class="px-3 py-1 rounded-lg text-sm bg-opacity-20 flex items-center gap-2">
            <span>{{ gridSize }}x{{ gridSize }}</span>
          </button>
          <div v-if="showGridMenu" class="absolute right-0 top-10 w-24 bg-dark-card rounded-xl border border-gray-700 shadow-xl z-10">
            <button v-for="g in [2,3,4,5,6]" :key="g" @click="setGrid(g)" class="w-full px-4 py-2 text-center hover:bg-opacity-20">{{ g }}x{{ g }}</button>
          </div>
        </div>
        <button @click="viewMode = viewMode === 'table' ? 'chart' : 'table'" class="px-3 py-1 rounded-lg text-sm" :class="viewMode === 'chart' ? 'bg-primary-500' : 'bg-opacity-20'">{{ viewMode === 'table' ? '📊' : '📈' }}</button>
      </div>
    </div>
    
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" class="px-4 py-2 rounded-full text-sm whitespace-nowrap">{{ tab }}</button>
    </div>
    
    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead><tr class="text-left text-xs opacity-50 border-b border-opacity-20">
          <th class="pb-2">Ticker</th><th class="pb-2">Name</th><th class="pb-2 text-right">Price</th><th class="pb-2 text-right">%</th><th class="pb-2 text-right">Vol</th></tr></thead>
        <tbody>
          <tr v-for="stock in filteredStocks" :key="stock.ticker" class="border-b border-opacity-10">
            <td class="py-3 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-3">{{ stock.name }}</td>
            <td class="py-3 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-3 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</td>
            <td class="py-3 text-right opacity-70">{{ formatVolume(stock.volume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Chart Grid (TradingView style squares) -->
    <div v-else class="grid gap-2" :style="gridStyle">
      <div v-for="stock in displayedStocks" :key="stock.ticker" class="bg-opacity-20 rounded-lg border border-opacity-10 p-2">
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-sm">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs font-bold">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</span>
        </div>
        <!-- Square Mini Chart -->
        <div class="h-16 w-full">
          <svg viewBox="0 0 60 30" class="w-full h-full">
            <!-- Candlesticks -->
            <g v-for="(c, i) in generateCandles(stock.change)" :key="i">
              <line :x1="c.x" y1="5" :x2="c.x" y2="25" :stroke="c.color" stroke-width="2"/>
              <rect :x="c.x-2" :y="c.bodyY" width="4" :height="c.bodyH" :fill="c.color" rx="1"/>
            </g>
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
const gridSize = ref(3)
const showGridMenu = ref(false)
const activeTab = ref('Most Active')
const tabs = ['Overview', 'Gainers', 'Losers', 'Most Active']

const stocks = ref([
  { ticker: 'TSLA', name: 'Tesla', price: 172.02, change: 1.24, volume: 55000000 },
  { ticker: 'PLTR', name: 'Palantir', price: 22.92, change: 1.42, volume: 47000000 },
  { ticker: 'NVDA', name: 'NVIDIA', price: 871.30, change: 5.44, volume: 45000000 },
  { ticker: 'AMD', name: 'AMD', price: 178.95, change: 4.18, volume: 52000000 },
  { ticker: 'MSTR', name: 'MStrategy', price: 328.85, change: 9.58, volume: 17000000 },
  { ticker: 'AAPL', name: 'Apple', price: 178.50, change: 2.35, volume: 52000000 },
  { ticker: 'MSFT', name: 'Microsoft', price: 378.25, change: 1.82, volume: 21000000 },
  { ticker: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.95, volume: 18000000 },
  { ticker: 'META', name: 'Meta', price: 505.75, change: 2.80, volume: 14000000 },
  { ticker: 'AMZN', name: 'Amazon', price: 178.25, change: 1.55, volume: 35000000 },
  { ticker: 'COIN', name: 'Coinbase', price: 172.45, change: -2.15, volume: 8000000 },
  { ticker: 'NFLX', name: 'Netflix', price: 628.90, change: 3.22, volume: 5000000 },
  { ticker: 'HOOD', name: 'Robinhood', price: 18.92, change: 0.85, volume: 12000000 },
  { ticker: 'SQ', name: 'Block', price: 78.30, change: -1.25, volume: 9000000 },
  { ticker: 'XOM', name: 'Exxon', price: 105.30, change: 1.15, volume: 15000000 },
  { ticker: 'JPM', name: 'JPMorgan', price: 198.50, change: 0.85, volume: 8000000 },
  { ticker: 'V', name: 'Visa', price: 275.80, change: 0.45, volume: 6000000 },
  { ticker: 'JNJ', name: 'J&J', price: 156.80, change: -0.35, volume: 5500000 }
])

const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${gridSize.value}, 1fr)` }))

const displayedStocks = computed(() => {
  let r = [...stocks.value]
  if (activeTab.value === 'Gainers') r = r.sort((a,b) => b.change - a.change)
  else if (activeTab.value === 'Losers') r = r.sort((a,b) => a.change - b.change)
  else if (activeTab.value === 'Most Active') r = r.sort((a,b) => b.volume - a.volume)
  return r.slice(0, gridSize.value * gridSize.value)
})

const filteredStocks = computed(() => {
  let r = [...stocks.value]
  if (activeTab.value === 'Gainers') r = r.sort((a,b) => b.change - a.change).slice(0,10)
  else if (activeTab.value === 'Losers') r = r.sort((a,b) => a.change - b.change).slice(0,10)
  else if (activeTab.value === 'Most Active') r = r.sort((a,b) => b.volume - a.volume).slice(0,10)
  return r
})

const setGrid = (g) => { gridSize.value = g; showGridMenu.value = false }
const formatVolume = (v) => v >= 1e9 ? (v/1e9).toFixed(1) + 'B' : v >= 1e6 ? (v/1e6).toFixed(1) + 'M' : v.toString()

const generateCandles = (change) => {
  const candles = []
  const color = change >= 0 ? '#4ade80' : '#f87171'
  const dir = change >= 0 ? 1 : -1
  for (let i = 0; i < 12; i++) {
    const x = i * 5 + 2
    const bodyH = 3 + Math.random() * 8
    const bodyY = 15 - (bodyH/2) * dir + (Math.random() - 0.5) * 5
    candles.push({ x, color, bodyH, bodyY })
  }
  return candles
}
</script>
