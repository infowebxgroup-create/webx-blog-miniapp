<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="font-display text-2xl font-bold">Stock Screener</h1>
      <button @click="viewMode = viewMode === 'table' ? 'grid' : 'table'" class="px-4 py-2 rounded-lg text-sm" :class="viewMode === 'table' ? 'bg-blue-500' : 'bg-green-500'">
        {{ viewMode === 'table' ? 'Table' : 'Grid' }}
      </button>
    </div>
    
    <div class="mb-4 flex gap-2 overflow-x-auto">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" class="px-4 py-2 rounded-full text-sm" :class="activeTab === tab ? 'bg-blue-500' : 'bg-gray-700'">{{ tab }}</button>
    </div>
    
    <div class="mb-4 flex gap-2">
      <button v-for="type in chartTypes" :key="type.value" @click="chartType = type.value" class="px-3 py-1 rounded text-sm" :class="chartType === type.value ? 'bg-purple-500' : 'bg-gray-700'">{{ type.icon }}</button>
    </div>
    
    <div v-if="loading" class="grid gap-2" :style="{ gridTemplateColumns: 'repeat(' + gridSize + ', 1fr)' }">
      <div v-for="i in gridSize * gridSize" :key="i" class="aspect-square bg-gray-700 rounded animate-pulse"></div>
    </div>
    
    <div v-else-if="viewMode === 'grid'" class="grid gap-2" :style="{ gridTemplateColumns: 'repeat(' + gridSize + ', 1fr)' }">
      <div v-for="stock in displayStocks" :key="stock.id" class="aspect-square bg-gray-800 rounded p-2">
        <div class="flex justify-between text-xs mb-1">
          <span class="font-bold">{{ stock.ticker }}</span>
          <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(1) }}%</span>
        </div>
        <svg v-if="chartType === 'line'" viewBox="0 0 60 30" class="w-full h-12"><polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="1.5" :points="getPoints(stock)"/></svg>
        <svg v-else-if="chartType === 'area'" viewBox="0 0 60 30" class="w-full h-12"><path :d="getArea(stock)" :fill="stock.change >= 0 ? '#4ade80' : '#f87171'" opacity="0.3"/><polyline fill="none" :stroke="stock.change >= 0 ? '#4ade80' : '#f87171'" stroke-width="1.5" :points="getPoints(stock)"/></svg>
        <svg v-else-if="chartType === 'bars'" viewBox="0 0 60 30" class="w-full h-12"><rect v-for="(b,i) in stock.chartData.slice(-15)" :key="i" :x="i*4" :y="30-b.close*0.5" width="3" height="b.close*0.5" :fill="b.close>=b.open?'#4ade80':'#f87171'" rx="1"/></svg>
        <svg v-else viewBox="0 0 60 30" class="w-full h-12"><g v-for="(c,i) in stock.chartData.slice(-10)" :key="i"><line :x1="i*6+3" :y1="30-c.high*0.5" :x2="i*6+3" :y2="30-c.low*0.5" :stroke="c.close>=c.open?'#4ade80':'#f87171'" stroke-width="1"/><rect :x="i*6+1" :y="30-Math.max(c.open,c.close)*0.5" width="4" height="Math.abs(c.close-c.open)*0.5||2" :fill="c.close>=c.open?'#4ade80':'#f87171'" rx="1"/></g></svg>
      </div>
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead><tr class="text-left text-xs text-gray-400 border-b"><th>Ticker</th><th class="text-right">Price</th><th class="text-right">%</th></tr></thead>
        <tbody>
          <tr v-for="stock in stocks.slice(0,50)" :key="stock.id" class="border-b border-gray-800">
            <td class="py-2 font-bold text-blue-400">{{ stock.ticker }}</td>
            <td class="py-2 text-right">${{ stock.price.toFixed(2) }}</td>
            <td class="py-2 text-right" :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">{{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div ref="trigger" class="h-4"></div>
    <div v-if="hasMore" class="text-center py-2 text-sm opacity-50">Scroll for more...</div>
    
    <!-- Floating Grid Button -->
    <button @click="showGrid = !showGrid" class="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 rounded-full shadow-lg font-bold z-20">
      {{ gridSize }}
    </button>
    
    <!-- Grid Popup -->
    <div v-if="showGrid" class="fixed inset-0 bg-black/70 flex items-center justify-center z-30" @click="showGrid = false">
      <div class="bg-gray-900 rounded-2xl w-80 border border-gray-700" @click.stop>
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-bold">Grid Mode</h3>
        </div>
        <div class="p-4 space-y-2">
          <button v-for="g in [1,2,3,4,6]" :key="g" @click="gridSize = g; showGrid = false" class="w-full p-3 rounded-lg text-left" :class="gridSize === g ? 'bg-blue-500' : 'bg-gray-800'">
            {{ g }} x {{ g }} ({{ g*g }} charts)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const viewMode = ref('grid')
const chartType = ref('line')
const gridSize = ref(4)
const showGrid = ref(false)
const activeTab = ref('All')
const loading = ref(true)
const trigger = ref(null)

const tabs = ['All', 'Gainers', 'Losers', 'Volume']
const chartTypes = [{value:'line',icon:'Line'},{value:'area',icon:'Area'},{value:'bars',icon:'Bars'},{value:'candle',icon:'Candle'}]

const stocks = ref([])
const displayCount = ref(16)

onMounted(() => {
  stocks.value = generateStocks()
  loading.value = false
  const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting && hasMore.value) displayCount.value += 16 }, { rootMargin: '100px' })
  if (trigger.value) obs.observe(trigger.value)
  onUnmounted(() => obs.disconnect())
})

const hasMore = computed(() => displayCount.value < stocks.value.length)
const displayStocks = computed(() => stocks.value.slice(0, displayCount.value))

const getPoints = (s) => {
  const d = s.chartData || []
  if (!d.length) return '0,15 60,15'
  return d.map((p, i) => ((i/(d.length-1))*60) + ',' + (30-(p.price/200)*25)).join(' ')
}

const getArea = (s) => getPoints(s) + ' 60,30 0,30'
</script>
