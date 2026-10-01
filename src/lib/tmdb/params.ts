export type TmdbParamValue =
  string | number | boolean | readonly (string | number)[] | null | undefined

export type TmdbParams = Record<string, TmdbParamValue>

export function serializeParam(value: TmdbParamValue): string | null {
  if (value === null || value === undefined) return null
  if (Array.isArray(value)) {
    const joined = value
      .filter(
        (entry) =>
          entry !== null && entry !== undefined && String(entry).trim() !== '',
      )
      .map(String)
      .join(',')
    return joined === '' ? null : joined
  }
  const serialized = String(value).trim()
  return serialized === '' ? null : serialized
}

export function buildParams(params: TmdbParams = {}): URLSearchParams {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const serialized = serializeParam(value)
    if (serialized !== null) search.set(key, serialized)
  }
  return search
}

export function toQueryString(params: TmdbParams = {}): string {
  return buildParams(params).toString()
}

export function withoutEmptyParams<T extends TmdbParams>(
  params: T,
): Partial<T> {
  const result: Partial<T> = {}
  for (const [key, value] of Object.entries(params)) {
    if (serializeParam(value as TmdbParamValue) !== null) {
      result[key as keyof T] = value as T[keyof T]
    }
  }
  return result
}
