<template>
  <div class="px-4 py-6">
    <h1 class="font-display text-2xl font-bold mb-6">📊 Stock Screener</h1>
    
    <!-- Filters -->
    <div class="mb-6 space-y-3">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition"
          :class="activeTab === tab ? 'bg-primary-500 text-white' : 'bg-opacity-20 opacity-70'">
          {{ tab }}
        </button>
      </div>
      
      <div class="grid grid-cols-3 gap-2">
        <select v-model="filters.exchange" class="p-2 rounded-lg bg-opacity-20 border border-opacity-20 text-sm">
          <option value="">All Exchanges</option>
          <option value="NASDAQ">NASDAQ</option>
          <option value="NYSE">NYSE</option>
          <option value="SPB">SPB</option>
        </select>
        <select v-model="filters.sector" class="p-2 rounded-lg bg-opacity-20 border border-opacity-20 text-sm">
          <option value="">All Sectors</option>
          <option value="Tech">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Energy">Energy</option>
          <option value="Healthcare">Healthcare</option>
        </select>
        <select v-model="filters.signal" class="p-2 rounded-lg bg-opacity-20 border border-opacity-20 text-sm">
          <option value="">All Signals</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>
    </div>
    
    <!-- Table -->
    <div class="overflow-x-auto">
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
          <tr v-for="stock in filteredStocks" :key="stock.ticker" 
            class="border-b border-opacity-10 hover:bg-opacity-10 cursor-pointer"
            @click="selectStock(stock)">
            <td class="py-3 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-3">{{ stock.name }}</td>
            <td class="py-3 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-3 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
            </td>
            <td class="py-3 text-right">{{ formatVolume(stock.volume) }}</td>
            <td class="py-3 text-right">
              <span :class="signalColor(stock.signal)" class="px-2 py-0.5 rounded text-xs">
                {{ stock.signal }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Stock Detail Modal -->
    <div v-if="selectedStock" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="selectedStock = null">
      <div class="bg-dark-card rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-bold">{{ selectedStock.ticker }}</h2>
            <p class="text-sm opacity-70">{{ selectedStock.name }}</p>
          </div>
          <button @click="selectedStock = null" class="text-2xl">&times;</button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-xs opacity-50">Price</p>
            <p class="text-lg font-bold">${{ selectedStock.price.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-xs opacity-50">Change</p>
            <p :class="selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ selectedStock.change >= 0 ? '+' : '' }}{{ selectedStock.change.toFixed(2) }}%
            </p>
          </div>
          <div>
            <p class="text-xs opacity-50">Volume</p>
            <p>{{ formatVolume(selectedStock.volume) }}</p>
          </div>
          <div>
            <p class="text-xs opacity-50">Market Cap</p>
            <p>{{ formatVolume(selectedStock.marketCap) }}</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <p class="text-xs opacity-50">Signal: {{ selectedStock.signal }}</p>
          <p class="text-xs opacity-50">Sector: {{ selectedStock.sector }}</p>
          <p class="text-xs opacity-50">Exchange: {{ selectedStock.exchange }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('All')
const tabs = ['All', 'Most Volatile', 'Top Gainers', 'Top Losers', 'Most Active']

const filters = ref({
  exchange: '',
  sector: '',
  signal: ''
})

const selectedStock = ref(null)

const stocks = ref([
  { ticker: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.35, volume: 52000000, marketCap: 2800000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 378.25, change: 1.82, volume: 21000000, marketCap: 2810000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.95, volume: 18000000, marketCap: 1780000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'neutral' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 5.42, volume: 45000000, marketCap: 2160000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 175.20, change: -3.25, volume: 98000000, marketCap: 557000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'sell' },
  { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.50, change: 0.85, volume: 8000000, marketCap: 571000000000, sector: 'Finance', exchange: 'NYSE', signal: 'buy' },
  { ticker: 'XOM', name: 'Exxon Mobil', price: 105.30, change: 1.15, volume: 15000000, marketCap: 430000000000, sector: 'Energy', exchange: 'NYSE', signal: 'neutral' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', price: 156.80, change: -0.45, volume: 6000000, marketCap: 378000000000, sector: 'Healthcare', exchange: 'NYSE', signal: 'neutral' },
  { ticker: 'AMD', name: 'AMD Inc.', price: 178.90, change: 4.15, volume: 52000000, marketCap: 289000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' },
  { ticker: 'META', name: 'Meta Platforms', price: 505.75, change: 2.80, volume: 14000000, marketCap: 1290000000000, sector: 'Tech', exchange: 'NASDAQ', signal: 'buy' }
])

const filteredStocks = computed(() => {
  let result = stocks.value
  if (activeTab.value === 'Top Gainers') result = [...stocks.value].sort((a,b) => b.change - a.change).slice(0,5)
  else if (activeTab.value === 'Top Losers') result = [...stocks.value].sort((a,b) => a.change - b.change).slice(0,5)
  else if (activeTab.value === 'Most Active') result = [...stocks.value].sort((a,b) => b.volume - a.volume).slice(0,5)
  else if (activeTab.value === 'Most Volatile') result = [...stocks.value].sort((a,b) => Math.abs(b.change) - Math.abs(a.change)).slice(0,5)
  
  if (filters.value.exchange) result = result.filter(s => s.exchange === filters.value.exchange)
  if (filters.value.sector) result = result.filter(s => s.sector === filters.value.sector)
  if (filters.value.signal) result = result.filter(s => s.signal === filters.value.signal)
  
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

const selectStock = (stock) => {
  selectedStock.value = stock
}
</script>
