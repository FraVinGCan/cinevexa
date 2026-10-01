import { useEffect } from 'react'
import { applyTheme, useUiStore } from '@/features/ui/ui.store'

export function ThemeProvider() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return null
}
