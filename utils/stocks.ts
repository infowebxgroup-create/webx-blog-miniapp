export const generateStocks = () => {
  const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial']
  const names: Record<string, string[]> = {
    Tech: ['Apple', 'Microsoft', 'NVIDIA', 'Google', 'Amazon', 'Meta', 'Tesla', 'AMD', 'Intel', 'Oracle', 'Salesforce', 'Adobe', 'Netflix', 'PayPal'],
    Finance: ['JPMorgan', 'Bank of America', 'Wells Fargo', 'Goldman', 'Morgan Stanley', 'Citigroup', 'Charles Schwab', 'US Bancorp'],
    Healthcare: ['Johnson & Johnson', 'UnitedHealth', 'Pfizer', 'Merck', 'AbbVie', 'Thermo', 'Eli Lilly', 'Gilead'],
    Energy: ['Exxon', 'Chevron', 'ConocoPhillips', 'EOG', 'Schlumberger', 'Halliburton', 'Baker Hughes'],
    Consumer: ['Walmart', 'Costco', 'Home Depot', 'Lowe', 'Target', 'Best Buy', 'Dollar General', 'Ross Stores'],
    Industrial: ['Caterpillar', 'Deere', '3M', 'General Electric', 'Honeywell', 'UPS', 'FedEx', 'Union Pacific']
  }
  
  const stocks = []
  let id = 0
  
  for (const sector of sectors) {
    const sectorNames = names[sector] || names.Tech
    for (const name of sectorNames) {
      for (let i = 0; i < 5; i++) {
        const ticker = (name.substring(0, 3) + i).toUpperCase()
        const price = 10 + Math.random() * 900
        const change = (Math.random() - 0.5) * 20
        const volume = Math.floor(Math.random() * 100000000)
        
        const chartData = []
        let price2 = price * 0.9
        for (let d = 0; d < 30; d++) {
          price2 = price2 * (1 + (Math.random() - 0.48) * 0.05)
          chartData.push({ day: d + 1, price: price2 })
        }
        
        stocks.push({
          id: id++,
          ticker,
          name: `${name} ${i > 0 ? (i+1) : ''}`.trim(),
          sector,
          price: parseFloat(price.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          volume,
          marketCap: Math.floor(price * 1000000000),
          pe: parseFloat((10 + Math.random() * 50).toFixed(1)),
          high52w: parseFloat((price * 1.3).toFixed(2)),
          low52w: parseFloat((price * 0.7).toFixed(2)),
          chartData
        })
      }
    }
  }
  
  return stocks.sort(() => Math.random() - 0.5)
}
