export const useTheme = () => {
  const theme = useState<string>('theme', () => 'dark')
  
  const setTheme = (t: string) => {
    theme.value = t
    if (process.client) {
      localStorage.setItem('theme', t)
      document.body.className = t !== 'dark' ? t : ''
    }
  }
  
  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme') || 'dark'
      setTheme(saved)
    }
  }
  
  return { theme, setTheme, initTheme }
}
