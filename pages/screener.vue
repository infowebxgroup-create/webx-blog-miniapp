<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold">📊 Screener</h1>
        <p class="text-xs opacity-50">{{ filteredStocks.length }} stocks • Showing {{ displayedCount }}</p>
      </div>
      <div class="flex gap-2">
        <select v-model="sectorFilter" class="px-3 py-2 rounded-lg text-sm bg-opacity-20 border border-opacity-20">
          <option value="">All Sectors</option>
          <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
        </select>
        <div class="relative">
          <button @click="showGridMenu = !showGridMenu" class="px-3 py-2 rounded-lg text-sm bg-opacity-20 border border-opacity-20">
            {{ gridSize }}x{{ gridSize }}
          </button>
          <div v-if="showGridMenu" class="absolute right-0 top-12 w-24 bg-dark-card rounded-xl border border-gray-700 shadow-xl z-10">
            <button v-for="g in [2,3,4,5,6]" :key="g" @click="setGrid(g)" class="w-full px-4 py-2 hover:bg-opacity-20">{{ g }}x{{ g }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="activeTab === tab ? 'bg-primary-500' : 'bg-opacity-20'" class="px-4 py-2 rounded-full text-sm whitespace-nowrap">{{ tab }}</button>
    </div>
    
    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs opacity-50 border-b border-opacity-20">
            <th class="pb-2">#</th>
            <th class="pb-2">Ticker</th>
            <th class="pb-2">Sector</th>
            <th class="pb-2 text-right">Price</th>
            <th class="pb-2 text-right">%</th>
            <th class="pb-2 text-right">Volume</th>
            <th class="pb-2 text-right">M.Cap</th>
            <th class="pb-2 text-right">P/E</th>
            <th class="pb-2">Chart</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in paginatedStocks" :key="stock.id" class="border-b border-opacity-10 hover:bg-opacity-5">
            <td class="py-3 text-xs opacity-50">{{ stock.id + 1 }}</td>
            <td class="py-3 font-bold text-primary-400">{{ stock.ticker }}</td>
            <td class="py-3 text-xs">{{ stock.sector }}</td>
            <td class="py-3 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-3 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</td>
            <td class="py-3 text-right opacity-70">{{ formatVolume(stock.volume) }}</td>
            <td class="py-3 text-right opacity-70">{{ formatVolume(stock.marketCap) }}</td>
            <td class="py-3 text-right opacity-70">{{ stock.pe }}</td>
            <td class="py-3 w-24">
              <div class="h-8 w-20">
                <ClientOnly>
                  <LineChart :data="stock.chartData" :width="80" :height="32">
                    <Line type="monotone" :dataKey="stock.change >= 0 ? 'price' : 'price'" stroke="#4ade80" :strokeWidth="1.5" dot={false} />
                  </LineChart>
                </ClientOnly>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Load More -->
      <div class="text-center py-4">
        <button v-if="displayedCount < filteredStocks.length" @click="loadMore" class="px-6 py-2 bg-primary-500 rounded-full text-sm">
          Load More ({{ filteredStocks.length - displayedCount }} remaining)
        </button>
      </div>
    </div>
    
    <!-- Grid View with Real Charts -->
    <div v-else class="grid gap-3" :style="gridStyle">
      <div v-for="stock in displayedStocks" :key="stock.id" class="bg-opacity-20 rounded-xl border border-opacity-10 p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-bold text-lg">{{ stock.ticker }}</span>
            <span class="text-xs opacity-50 ml-2">{{ stock.sector }}</span>
          </div>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</span>
        </div>
        
        <!-- Real Chart -->
        <div class="h-24 mb-2">
          <ClientOnly>
            <LineChart :data="stock.chartData" :width="280" :height="90">
              <XAxis dataKey="day" hide />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Tooltip contentStyle="background:#1e293b;border:none;border-radius:8px" :formatter="(v) => '$' + v.toFixed(2)" />
              <Line type="monotone" dataKey="price" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" :strokeWidth="2" dot={false} />
            </LineChart>
          </ClientOnly>
        </div>
        
        <div class="flex justify-between text-xs opacity-50">
          <span>${{ stock.price.toFixed(2) }}</span>
          <span>Vol: {{ formatVolume(stock.volume) }}</span>
          <span>P/E: {{ stock.pe }}</span>
        </div>
      </div>
    </div>
    
    <!-- Load More Button for Grid -->
    <div v-if="viewMode === 'chart' && displayedCount < filteredStocks.length" class="text-center py-4">
      <button @click="loadMore" class="px-6 py-2 bg-primary-500 rounded-full text-sm">
        Load More ({{ filteredStocks.length - displayedCount }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const viewMode = ref('table')
const gridSize = ref(3)
const showGridMenu = ref(false)
const activeTab = ref('All')
const sectorFilter = ref('')
const itemsPerPage = ref(50)

const tabs = ['All', 'Gainers', 'Losers', 'Most Active', 'Volume']
const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']

// Generate 300+ stocks
const stocks = ref([])
onMounted(() => {
  stocks.value = generateStocks()
})

const filteredStocks = computed(() => {
  let result = [...stocks.value]
  
  if (sectorFilter.value) result = result.filter(s => s.sector === sectorFilter.value)
  
  if (activeTab.value === 'Gainers') result = result.sort((a, b) => b.change - a.change)
  else if (activeTab.value === 'Losers') result = result.sort((a, b) => a.change - b.change)
  else if (activeTab.value === 'Most Active') result = result.sort((a, b) => b.volume - a.volume)
  else if (activeTab.value === 'Volume') result = result.sort((a, b) => b.volume - a.volume)
  
  return result
})

const displayedCount = computed(() => viewMode.value === 'table' ? itemsPerPage.value : gridSize.value * gridSize.value)

const paginatedStocks = computed(() => filteredStocks.value.slice(0, itemsPerPage.value))

const displayedStocks = computed(() => filteredStocks.value.slice(0, gridSize.value * gridSize.value))

const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${gridSize.value}, 1fr)` }))

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
</script>
