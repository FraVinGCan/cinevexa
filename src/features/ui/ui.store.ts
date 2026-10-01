import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

type UiState = {
  theme: Theme
  searchOpen: boolean
  mobileNavOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSearchOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      searchOpen: false,
      mobileNavOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
    }),
    {
      name: 'cinevexa-ui',
      partialize: ({ theme }) => ({ theme }),
    },
  ),
)

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}
