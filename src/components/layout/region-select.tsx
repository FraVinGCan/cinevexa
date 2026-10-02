import { GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  REGIONS,
  isRegionCode,
  regionLabel,
  usePreferencesStore,
} from '@/features/preferences/preferences.store'

export function RegionSelect() {
  const region = usePreferencesStore((state) => state.region)
  const setRegion = usePreferencesStore((state) => state.setRegion)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-11 gap-1.5 px-3"
            aria-label={`Region: ${regionLabel(region)}. Change region`}
          />
        }>
        <GlobeIcon />
        <span className="text-xs font-medium tracking-[0.12em]">{region}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="leading-relaxed">
            Market
            <span className="mt-1 block text-xs font-normal text-muted-foreground/80">
              Watch providers, certifications and rails resolve against this
              market.
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={region}
            onValueChange={(value) => {
              if (typeof value === 'string' && isRegionCode(value))
                setRegion(value)
            }}>
            {REGIONS.map((entry) => (
              <DropdownMenuRadioItem
                key={entry.code}
                value={entry.code}
                closeOnClick>
                {entry.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
