import { useMemo, useState } from 'react'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, currentPage, pageSize])

  const goTo = (target: number) => {
    setPage(Math.min(Math.max(1, target), totalPages))
  }

  return {
    page: currentPage,
    totalPages,
    pageItems,
    goTo,
    next: () => goTo(currentPage + 1),
    prev: () => goTo(currentPage - 1),
    reset: () => setPage(1),
  }
}
