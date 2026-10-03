import { useEffect, useState } from 'react'

export const DEBOUNCE_DELAY = 300

export type DebouncedInput = {
  /** What the control shows, which changes on every keystroke. */
  value: string
  setValue: (next: string) => void
  /** Whether a settled change is still waiting on the debounce. */
  pending: boolean
}

type UseDebouncedInputOptions = {
  /** The settled value, normally read back out of the URL. */
  value: string
  delay?: number
  /** Called once typing settles. Must be memoised by the caller. */
  onCommit: (next: string) => void
}

/**
 * A controlled text field whose writes are debounced, for the case where the
 * committed value lives somewhere this component does not own — the URL here.
 *
 * The draft is local so the field never lags behind the keyboard, while
 * `value` stays the one source of truth for everything else on the page. An
 * incoming `value` that this input did not produce — a shared link, a tab
 * change, the back button — replaces the draft instead of racing the debounce.
 */
export function useDebouncedInput({
  value,
  delay = DEBOUNCE_DELAY,
  onCommit,
}: UseDebouncedInputOptions): DebouncedInput {
  const [draft, setDraft] = useState(value)
  const [committed, setCommitted] = useState(value)

  /**
   * React's documented pattern for adjusting state when an input changes. The
   * commit below moves `value` toward the draft, so without this a navigation
   * would leave the field showing a query the page is no longer searching for.
   */
  if (value !== committed) {
    setCommitted(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === value) return
    const timer = window.setTimeout(() => onCommit(draft), delay)
    return () => window.clearTimeout(timer)
  }, [delay, draft, onCommit, value])

  return { value: draft, setValue: setDraft, pending: draft !== value }
}
