/** Keyword addresses: one for the index search, one for a keyword's films. */

export const MAX_KEYWORD_PAGE = 500

export function keywordSearchHref(query: string, page: number): string {
  const search = new URLSearchParams()
  if (query.trim() !== '') search.set('q', query)
  if (page > 1) search.set('page', String(page))
  const params = search.toString()
  return params === '' ? '/keyword' : `/keyword?${params}`
}

export function keywordHref(id: number, page: number): string {
  return page > 1 ? `/keyword/${id}?page=${page}` : `/keyword/${id}`
}
