import { getBy, setBy, getFirstDefined } from '../utils'

export default function useTableMethods ({
  debug,
  setState,
  actions,
  groupBy,
  columns,
  defaultSortDesc,
  filters,
}) {
  const toggleExpandedByPath = (path, set) =>
    setState(old => {
      const { expanded } = old
      const existing = getBy(expanded, path)
      set = getFirstDefined(set, !existing)
      return {
        ...old,
        expanded: setBy(expanded, path, set),
      }
    }, actions.toggleExpanded)

  // Updates sorting based on a columnID, desc flag and multi flag
  const toggleSortByID = (columnID, desc, multi) =>
    setState(old => {
      const { sortBy } = old

      // Find the column for this columnID
      const column = columns.find(d => d.id === columnID)
      const resolvedDefaultSortDesc = getFirstDefined(column.defaultSortDesc, defaultSortDesc)

      // Find any existing sortBy for this column
      const existingSortBy = sortBy.find(d => d.id === columnID)
      const hasDescDefined = typeof desc !== 'undefined' && desc !== null

      let newSortBy = []

      // What should we do with this filter?
      let action

      if (!multi) {
        if (sortBy.length <= 1 && existingSortBy) {
          if (existingSortBy.desc) {
            action = 'remove'
          } else {
            action = 'toggle'
          }
        } else {
          action = 'replace'
        }
      } else if (!existingSortBy) {
        action = 'add'
      } else if (hasDescDefined) {
        action = 'set'
      } else {
        action = 'toggle'
      }

      if (action === 'replace') {
        newSortBy = [
          {
            id: columnID,
            desc: hasDescDefined ? desc : resolvedDefaultSortDesc,
          },
        ]
      } else if (action === 'add') {
        newSortBy = [
          ...sortBy,
          {
            id: columnID,
            desc: hasDescDefined ? desc : resolvedDefaultSortDesc,
          },
        ]
      } else if (action === 'set') {
        newSortBy = sortBy.map(d => {
          if (d.id === columnID) {
            return {
              ...d,
              desc,
            }
          }
          return d
        })
      } else if (action === 'toggle') {
        newSortBy = sortBy.map(d => {
          if (d.id === columnID) {
            return {
              ...d,
              desc: !existingSortBy.desc,
            }
          }
          return d
        })
      } else if (action === 'remove') {
        newSortBy = []
      }

      return {
        ...old,
        sortBy: newSortBy,
      }
    }, actions.sortByChange)

  const toggleGroupBy = (id, toggle) =>
    setState(old => {
      const resolvedToggle = typeof set !== 'undefined' ? toggle : !groupBy.includes(id)
      if (resolvedToggle) {
        return {
          ...old,
          groupBy: [...groupBy, id],
        }
      }
      return {
        ...old,
        groupBy: groupBy.filter(d => d !== id),
      }
    }, actions.toggleGroupBy)

  const setFilter = (id, val) =>
    setState(old => {
      if (typeof val === 'undefined') {
        const { [id]: prev, ...rest } = filters
        return {
          ...old,
          filters: {
            ...rest,
          },
        }
      }

      return {
        ...old,
        filters: {
          ...filters,
          [id]: val,
        },
      }
    }, actions.setFilter)

  const setAllFilters = filters =>
    setState(
      old => ({
        ...old,
        filters,
      }),
      actions.setAllFilters
    )

  return {
    toggleExpandedByPath,
    toggleSortByID,
    toggleGroupBy,
    setFilter,
    setAllFilters,
  }
}
