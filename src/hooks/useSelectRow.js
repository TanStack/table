import { useMemo, useState, useEffect, useCallback } from 'react'

export const useSelectRow = props => {
  const { rows, data } = props
  const [selected, setSelected] = useState([])

  useEffect(() => {
    setSelected([])
  }, [data])

  const toggleSelectAll = forcedState => {
    return setSelected(state => {
      if (state.length === rows.length || forcedState === false) {
        return []
      }

      return rows.map(row => row.index)
    })
  }

  const toggleSelected = useCallback(
    index => {
      return setSelected(state => {
        const isSelected = selected.includes(index)

        if (isSelected) {
          return selected.filter(selectedIndex => selectedIndex !== index)
        }

        return [...state, index]
      })
    },
    [selected]
  )

  const mutatedRows = useMemo(() => {
    rows.forEach(row => {
      row.isSelected = selected.includes(row.index)
      row.toggleSelected = () => toggleSelected(row.index)
    })

    return rows
  }, [rows, selected, toggleSelected])

  const getSelectRowToggleProps = () => ({
    onChange: toggleSelectAll,
    checked: selected.length === rows.length
  })

  return {
    ...props,
    rows: mutatedRows,
    getSelectRowToggleProps,
    toggleSelectAll
  }
}
