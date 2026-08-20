import { getRouteApi } from '@tanstack/react-router'
import { cleanEmptyParams } from '../utils/cleanEmptyParams'
import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'

export function useFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(
  routeId: T,
) {
  const routeApi = getRouteApi<T>(routeId)
  const navigate = routeApi.useNavigate()
  const filters = routeApi.useSearch()

  const setFilters = (partialFilters: Partial<typeof filters>) =>
    navigate({
      search: (prev) => cleanEmptyParams({ ...prev, ...partialFilters }),
      replace: true,
    } as Parameters<typeof navigate>[0])

  const resetFilters = () => {
    navigate({
      search: {},
      replace: true,
    } as Parameters<typeof navigate>[0])
  }

  return { filters, setFilters, resetFilters }
}
