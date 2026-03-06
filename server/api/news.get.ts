export default defineEventHandler(async () => {
  // Return sample news
  return {
    status: 'ok',
    articles: [
      { title: 'GPT-5 Released with Native Computer Use', description: 'OpenAI releases most capable model with 1M context', source: 'TechCrunch' },
      { title: 'Bitcoin Reaches New High', description: 'BTC hits $72,000 amid institutional adoption', source: 'CoinDesk' },
      { title: 'Quantum Computing Breakthrough', description: 'New processor achieves 1000+ qubits', source: 'Nature' },
      { title: 'Claude 4 Released', description: 'Anthropic releases most capable AI model yet', source: 'Anthropic' },
      { title: 'Web3 Growth Accelerates', description: 'More developers join blockchain ecosystem', source: 'Decrypt' }
    ]
  }
})
