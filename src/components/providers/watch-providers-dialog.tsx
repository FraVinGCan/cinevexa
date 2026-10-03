import { ExternalLinkIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ProviderGroup } from '@/features/catalog/watch-providers'
import { logoUrl } from '@/lib/tmdb/image'

type WatchProvidersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  regionLabel: string
  groups: readonly ProviderGroup[]
}

/**
 * The long list, for the reader who wants to compare services rather than be
 * told whether any exist. The cell carries the answer; this only expands it.
 */
export function WatchProvidersDialog({
  open,
  onOpenChange,
  title,
  regionLabel,
  groups,
}: WatchProvidersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Where to watch</DialogTitle>
          <DialogDescription>
            Availability TMDB publishes for {title} in {regionLabel}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60dvh] flex-col gap-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <section key={group.monetization} className="flex flex-col gap-2.5">
              <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.providers.map((provider) => {
                  const src = logoUrl(provider.logo_path)
                  return (
                    <li key={`${group.monetization}-${provider.provider_id}`}>
                      <span className="flex min-h-11 items-center gap-2 rounded-3xl bg-surface px-3 py-1.5">
                        {src !== null && (
                          <img
                            src={src}
                            alt=""
                            width={154}
                            height={40}
                            loading="lazy"
                            decoding="async"
                            className="h-5 w-auto object-contain"
                          />
                        )}
                        <span className="text-sm font-medium">
                          {provider.provider_name}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        {groups[0]?.link && (
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={groups[0].link}
                target="_blank"
                rel="noreferrer noopener"
              />
            }>
            Compare all services
            <ExternalLinkIcon />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
