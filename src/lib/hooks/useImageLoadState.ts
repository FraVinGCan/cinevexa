import { useCallback, useState } from 'react'

export type ImageLoadState = {
  loaded: boolean
  failed: boolean
  attach: (node: HTMLImageElement | null) => void
  onLoad: () => void
  onError: () => void
}

export function useImageLoadState(): ImageLoadState {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const attach = useCallback((node: HTMLImageElement | null) => {
    if (node === null || !node.complete) return
    if (node.naturalWidth > 0) setLoaded(true)
    else setFailed(true)
  }, [])

  const onLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  const onError = useCallback(() => {
    setFailed(true)
  }, [])

  return { loaded, failed, attach, onLoad, onError }
}
