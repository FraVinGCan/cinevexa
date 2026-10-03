import { useId, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { REGIONS, regionLabel } from '@/features/preferences/preferences.store'
import {
  ANY_OPTION,
  MONETIZATION_OPTIONS,
  ORIGINAL_LANGUAGE_OPTIONS,
  RELEASE_TYPE_OPTIONS,
  RUNTIME_MAX,
  RUNTIME_MIN,
  RUNTIME_STEP,
  TV_STATUS_OPTIONS,
  TV_TYPE_OPTIONS,
  VOTE_AVERAGE_MAX,
  VOTE_AVERAGE_STEP,
  VOTE_COUNT_MAX,
  VOTE_COUNT_STEP,
  YEAR_MAX,
  YEAR_MIN,
  labelForOption,
  languageLabel,
  sortLabel as schemaSortLabel,
  toggleMember,
  type DiscoverFilters,
  type DiscoverMediaType,
} from '@/features/discover/discover.schema'
import {
  serializeValues,
  type DiscoverPatch,
} from '@/features/discover/discover'
import {
  MOVIE_SORT_OPTIONS,
  TV_SORT_OPTIONS,
  type MonetizationType,
} from '@/types/tmdb'
import type { Genre } from '@/types/tmdb'

type Option = { value: string | number; label: string }

type FilterGroupProps = {
  group: string
  title: string
  summary?: string | null
  children: React.ReactNode
}

function FilterGroup({ group, title, summary, children }: FilterGroupProps) {
  return (
    <AccordionItem value={group}>
      <AccordionTrigger>
        <span className="flex flex-col gap-0.5">
          <span>{title}</span>
          {summary && (
            <span className="text-xs font-normal text-muted-foreground">
              {summary}
            </span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  )
}

type CheckboxRowProps = {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function CheckboxRow({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxRowProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next === true)}
      />
      <FieldLabel htmlFor={id} className="min-h-9 font-normal">
        {label}
      </FieldLabel>
    </Field>
  )
}

type OptionListProps = {
  options: readonly Option[]
  selected: readonly (string | number)[]
  idPrefix: string
  onToggle: (value: string | number) => void
}

function OptionList({
  options,
  selected,
  idPrefix,
  onToggle,
}: OptionListProps) {
  return (
    <div className="grid gap-1">
      {options.map((option) => (
        <CheckboxRow
          key={option.value}
          id={`${idPrefix}-${option.value}`}
          label={option.label}
          checked={selected.includes(option.value)}
          onCheckedChange={() => onToggle(option.value)}
        />
      ))}
    </div>
  )
}

type OptionSelectProps = {
  value: string | null
  placeholder: string
  label: string
  triggerClassName?: string
  options: readonly Option[]
  onChange: (value: string) => void
}

function OptionSelect({
  value,
  placeholder,
  label,
  triggerClassName,
  options,
  onChange,
}: OptionSelectProps) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <span id={id} className="text-xs text-muted-foreground">
        {label}
      </span>
      <Select
        value={value ?? ANY_OPTION}
        onValueChange={(next) =>
          onChange(next === ANY_OPTION ? '' : String(next))
        }>
        <SelectTrigger
          aria-labelledby={id}
          className={triggerClassName ?? 'w-full justify-between'}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY_OPTION}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type RangeSliderProps = {
  label: string
  min: number
  max: number
  step: number
  from: number | null
  to: number | null
  format: (value: number | null) => string
  onCommit: (from: number, to: number) => void
}

/** The root's value type collapses to `number | number[]` once it is not generic. */
function thumbValues(value: number | readonly number[]): number[] {
  return typeof value === 'number' ? [value] : [...value]
}

/**
 * The slider is uncontrolled between commits so a drag never writes to the URL,
 * and is remounted by `signature` whenever the URL value moves from elsewhere.
 */
function RangeSlider({
  label,
  min,
  max,
  step,
  from,
  to,
  format,
  onCommit,
}: RangeSliderProps) {
  const signature = `${from ?? min}:${to ?? max}`
  return (
    <div className="grid gap-2 pt-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-foreground" aria-live="polite">
          {format(from)} – {format(to)}
        </span>
      </div>
      <Slider
        key={signature}
        aria-label={label}
        defaultValue={[from ?? min, to ?? max]}
        min={min}
        max={max}
        step={step}
        onValueCommitted={(next) => {
          const [low, high] = thumbValues(next)
          onCommit(low, high)
        }}
      />
    </div>
  )
}

type SingleSliderProps = {
  label: string
  min: number
  max: number
  step: number
  value: number | null
  format: (value: number | null) => string
  onCommit: (value: number) => void
}

function SingleSlider({
  label,
  min,
  max,
  step,
  value,
  format,
  onCommit,
}: SingleSliderProps) {
  return (
    <div className="grid gap-2 pt-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-foreground" aria-live="polite">
          {format(value)}
        </span>
      </div>
      <Slider
        key={`${value ?? min}`}
        aria-label={label}
        defaultValue={[value ?? min]}
        min={min}
        max={max}
        step={step}
        onValueCommitted={(next) => onCommit(thumbValues(next)[0])}
      />
    </div>
  )
}

function commitRange(
  from: number,
  to: number,
  min: number,
  max: number,
): [string | null, string | null] {
  return [from <= min ? null : String(from), to >= max ? null : String(to)]
}

function commitFloor(value: number, min: number, step: number): string | null {
  const rounded = Math.round(value / step) * step
  return rounded <= min ? null : String(rounded)
}

export type DiscoverFilterPanelProps = {
  mediaType: DiscoverMediaType
  filters: DiscoverFilters
  genres: Genre[]
  certifications: readonly string[]
  idPrefix: string
  onPatch: (patch: DiscoverPatch) => void
}

/**
 * The single definition of the discover controls. The desktop rail and the mobile
 * sheet both render this, so `idPrefix` keeps the duplicated label/input pairs
 * associated with each other rather than with the other copy.
 */
export function DiscoverFilterPanel({
  mediaType,
  filters,
  genres,
  certifications,
  idPrefix,
  onPatch,
}: DiscoverFilterPanelProps) {
  const [genreMode, setGenreMode] = useState<'include' | 'exclude'>('include')
  const isTv = mediaType === 'tv'
  const id = (name: string) => `${idPrefix}-${name}`
  const patch = (changes: DiscoverPatch) => onPatch(changes)
  const sortOptions = isTv ? TV_SORT_OPTIONS : MOVIE_SORT_OPTIONS
  const genreSelection =
    genreMode === 'include' ? filters.genres : filters.withoutGenres
  const genreKey = genreMode === 'include' ? 'with_genres' : 'without_genres'

  return (
    <Accordion
      multiple
      defaultValue={isTv ? ['genres', 'status'] : ['genres', 'year']}
      className="border-0">
      <FilterGroup
        group="sort"
        title="Sort"
        summary={filters.sortBy ? sortLabel(isTv, filters.sortBy) : null}>
        <div className="pt-1">
          <OptionSelect
            value={filters.sortBy}
            label="Sort by"
            placeholder="Most popular"
            triggerClassName="w-full justify-between"
            options={sortOptions.map((value) => ({
              value,
              label: sortLabel(isTv, value),
            }))}
            onChange={(value) => patch({ sort_by: value })}
          />
        </div>
      </FilterGroup>

      <FilterGroup
        group="genres"
        title="Genre"
        summary={
          genreSelection.length > 0
            ? `${genreSelection.length} ${genreMode === 'include' ? 'included' : 'excluded'}`
            : null
        }>
        <div className="grid gap-3 pt-1">
          <div
            role="group"
            aria-label="Genre selection mode"
            className="grid grid-cols-2 gap-1 rounded-3xl bg-muted p-1">
            {(['include', 'exclude'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={genreMode === mode}
                onClick={() => setGenreMode(mode)}
                className="min-h-9 rounded-3xl text-sm font-medium capitalize transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none aria-pressed:bg-card aria-pressed:text-foreground text-muted-foreground hover:text-foreground">
                {mode === 'include' ? 'Include' : 'Exclude'}
              </button>
            ))}
          </div>
          {genres.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              TMDB has no genres to list for this media type.
            </p>
          ) : (
            <OptionList
              options={genres.map((genre) => ({
                value: genre.id,
                label: genre.name,
              }))}
              selected={genreSelection}
              idPrefix={id(genreMode)}
              onToggle={(value) =>
                patch({
                  [genreKey]: serializeValues(
                    toggleMember(genreSelection, value as number).sort(
                      (left, right) => left - right,
                    ),
                  ),
                })
              }
            />
          )}
        </div>
      </FilterGroup>

      <FilterGroup
        group="year"
        title={isTv ? 'First air year' : 'Release year'}
        summary={rangeSummary(filters.yearFrom, filters.yearTo)}>
        <RangeSlider
          label={isTv ? 'First air year' : 'Release year'}
          min={YEAR_MIN}
          max={YEAR_MAX}
          step={1}
          from={filters.yearFrom}
          to={filters.yearTo}
          format={(value) => (value === null ? 'Any' : String(value))}
          onCommit={(from, to) => {
            const [low, high] = commitRange(from, to, YEAR_MIN, YEAR_MAX)
            patch({ year_gte: low, year_lte: high })
          }}
        />
      </FilterGroup>

      <FilterGroup
        group="runtime"
        title="Runtime"
        summary={runtimeSummary(filters.runtimeFrom, filters.runtimeTo)}>
        <RangeSlider
          label="Runtime in minutes"
          min={RUNTIME_MIN}
          max={RUNTIME_MAX}
          step={RUNTIME_STEP}
          from={filters.runtimeFrom}
          to={filters.runtimeTo}
          format={(value) => (value === null ? 'Any' : `${value} min`)}
          onCommit={(from, to) => {
            const [low, high] = commitRange(from, to, RUNTIME_MIN, RUNTIME_MAX)
            patch({ runtime_gte: low, runtime_lte: high })
          }}
        />
      </FilterGroup>

      <FilterGroup
        group="rating"
        title="Rating"
        summary={
          filters.voteAverageFrom === null && filters.voteCountFrom === null
            ? null
            : [
                filters.voteAverageFrom !== null
                  ? `from ${filters.voteAverageFrom.toFixed(1)}`
                  : null,
                filters.voteCountFrom !== null
                  ? `${filters.voteCountFrom}+ votes`
                  : null,
              ]
                .filter(Boolean)
                .join(', ')
        }>
        <div className="grid gap-3 pt-1">
          <SingleSlider
            label="Average score"
            min={0}
            max={VOTE_AVERAGE_MAX}
            step={VOTE_AVERAGE_STEP}
            value={filters.voteAverageFrom}
            format={(value) =>
              value === null ? 'Any score' : `${value.toFixed(1)} and up`
            }
            onCommit={(value) =>
              patch({
                vote_average_gte: commitFloor(value, 0, VOTE_AVERAGE_STEP),
              })
            }
          />
          <SingleSlider
            label="Vote count"
            min={0}
            max={VOTE_COUNT_MAX}
            step={VOTE_COUNT_STEP}
            value={filters.voteCountFrom}
            format={(value) =>
              value === null ? 'Any votes' : `${value}+ votes`
            }
            onCommit={(value) =>
              patch({
                vote_count_gte: commitFloor(value, 0, VOTE_COUNT_STEP),
              })
            }
          />
        </div>
      </FilterGroup>

      <FilterGroup
        group="certification"
        title="Certification"
        summary={
          filters.certification
            ? `${filters.certification} in ${
                filters.certificationCountry ?? 'your market'
              }`
            : null
        }>
        <div className="grid gap-3 pt-1">
          <OptionSelect
            value={filters.certificationCountry}
            label="Market"
            placeholder="Any market"
            triggerClassName="w-full justify-between"
            options={REGIONS.map((region) => ({
              value: region.code,
              label: region.label,
            }))}
            onChange={(value) =>
              patch({
                certification_country: value,
                with_certification: value === '' ? null : filters.certification,
              })
            }
          />
          <OptionSelect
            value={filters.certification}
            label="Rating"
            placeholder="Any rating"
            triggerClassName="w-full justify-between"
            options={certifications.map((code) => ({
              value: code,
              label: code,
            }))}
            onChange={(value) => patch({ with_certification: value })}
          />
          {filters.certificationCountry && certifications.length === 0 && (
            <p className="text-xs text-muted-foreground">
              {regionLabel(filters.certificationCountry)} has no ratings on
              TMDB.
            </p>
          )}
        </div>
      </FilterGroup>

      <FilterGroup
        group="monetization"
        title="Availability"
        summary={
          filters.monetization.length > 0
            ? filters.monetization
                .map((type) => labelForOption(MONETIZATION_OPTIONS, type))
                .join(', ')
            : null
        }>
        <div className="pt-1">
          <OptionList
            options={MONETIZATION_OPTIONS}
            selected={filters.monetization}
            idPrefix={id('money')}
            onToggle={(value) =>
              patch({
                with_watch_monetization_types: serializeValues(
                  toggleMember(filters.monetization, value as MonetizationType),
                ),
              })
            }
          />
        </div>
      </FilterGroup>

      <FilterGroup
        group="language"
        title="Original language"
        summary={languageLabel(filters.originalLanguage) || null}>
        <div className="pt-1">
          <OptionSelect
            value={filters.originalLanguage}
            label="Original language"
            placeholder="Any language"
            triggerClassName="w-full justify-between"
            options={ORIGINAL_LANGUAGE_OPTIONS.map((option) => ({
              value: option.code,
              label: option.label,
            }))}
            onChange={(value) => patch({ with_original_language: value })}
          />
        </div>
      </FilterGroup>

      {isTv ? (
        <>
          <FilterGroup
            group="status"
            title="Status"
            summary={countSummary(filters.statuses.length)}>
            <div className="pt-1">
              <OptionList
                options={TV_STATUS_OPTIONS}
                selected={filters.statuses}
                idPrefix={id('status')}
                onToggle={(value) =>
                  patch({
                    with_status: serializeValues(
                      toggleMember(filters.statuses, value as number).sort(
                        (left, right) => left - right,
                      ),
                    ),
                  })
                }
              />
            </div>
          </FilterGroup>
          <FilterGroup
            group="type"
            title="Series type"
            summary={countSummary(filters.types.length)}>
            <div className="pt-1">
              <OptionList
                options={TV_TYPE_OPTIONS}
                selected={filters.types}
                idPrefix={id('type')}
                onToggle={(value) =>
                  patch({
                    with_type: serializeValues(
                      toggleMember(filters.types, value as number).sort(
                        (left, right) => left - right,
                      ),
                    ),
                  })
                }
              />
            </div>
          </FilterGroup>
        </>
      ) : (
        <FilterGroup
          group="release"
          title="Release type"
          summary={countSummary(filters.releaseTypes.length)}>
          <div className="pt-1">
            <OptionList
              options={RELEASE_TYPE_OPTIONS}
              selected={filters.releaseTypes}
              idPrefix={id('release')}
              onToggle={(value) =>
                patch({
                  with_release_type: serializeValues(
                    toggleMember(filters.releaseTypes, value as number).sort(
                      (left, right) => left - right,
                    ),
                  ),
                })
              }
            />
          </div>
        </FilterGroup>
      )}
    </Accordion>
  )
}

function sortLabel(isTv: boolean, value: string): string {
  return schemaSortLabel(value, isTv)
}

function countSummary(count: number): string | null {
  if (count === 0) return null
  return `${count} selected`
}

function rangeSummary(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null
  if (from === null) return `Up to ${to}`
  if (to === null) return `From ${from}`
  return `${from} – ${to}`
}

function runtimeSummary(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null
  if (from === null) return `Under ${to} min`
  if (to === null) return `${from} min and up`
  return `${from} – ${to} min`
}
