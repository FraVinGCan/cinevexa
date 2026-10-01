import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const REGIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'IT', label: 'Italy' },
  { code: 'ES', label: 'Spain' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'SE', label: 'Sweden' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'South Korea' },
  { code: 'IN', label: 'India' },
] as const

export type RegionCode = (typeof REGIONS)[number]['code']

export const DEFAULT_REGION: RegionCode = 'US'
export const DEFAULT_LANGUAGE = 'en-US'

export function isRegionCode(value: string): value is RegionCode {
  return REGIONS.some((region) => region.code === value)
}

export function regionLabel(code: RegionCode): string {
  return REGIONS.find((region) => region.code === code)?.label ?? code
}

type PreferencesState = {
  region: RegionCode
  language: string
  includeAdult: boolean
  setRegion: (region: RegionCode) => void
  setLanguage: (language: string) => void
  setIncludeAdult: (includeAdult: boolean) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      region: DEFAULT_REGION,
      language: DEFAULT_LANGUAGE,
      includeAdult: false,
      setRegion: (region) => set({ region }),
      setLanguage: (language) => set({ language }),
      setIncludeAdult: (includeAdult) => set({ includeAdult }),
    }),
    {
      name: 'cinevexa-preferences',
    },
  ),
)

export function getPreferences(): {
  region: RegionCode
  language: string
  includeAdult: boolean
} {
  const { region, language, includeAdult } = usePreferencesStore.getState()
  return { region, language, includeAdult }
}
