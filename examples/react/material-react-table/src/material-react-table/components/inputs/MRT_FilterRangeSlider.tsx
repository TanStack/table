import { useEffect, useRef, useState } from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { SliderProps } from '@mui/material/Slider'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_FilterRangeSliderProps<
  TData extends MRT_RowData,
> extends SliderProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_FilterRangeSlider = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization, muiFilterSliderProps },
    refs: { filterInputRefs },
  } = table
  const { column } = header
  const { columnDef } = column

  const currentFilterOption = columnDef._filterFn

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false

  const sliderProps = {
    ...parseFromValuesOrFunc(muiFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.muiFilterSliderProps, { column, table }),
    ...rest,
  }

  let [min, max] =
    sliderProps.min !== undefined && sliderProps.max !== undefined
      ? [sliderProps.min, sliderProps.max]
      : (column.getFacetedMinMaxValues() ?? [0, 1])

  // fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0]
  if (Array.isArray(max)) max = max[0]
  if (min === null) min = 0
  if (max === null) max = 1

  const [filterValues, setFilterValues] = useState([min, max])
  const columnFilterValue = column.getFilterValue()

  const isMounted = useRef(false)

  // prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation()
    }
  }

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max])
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue)
      }
    }
    isMounted.current = true
  }, [columnFilterValue, min, max])

  return (
    <Stack>
      <Slider
        disableSwap
        max={max}
        min={min}
        onChange={(_event, values) => {
          setFilterValues(values as [number, number])
        }}
        onChangeCommitted={(_event, value) => {
          if (Array.isArray(value)) {
            if (value[0] <= min && value[1] >= max) {
              // if the user has selected the entire range, remove the filter
              column.setFilterValue(undefined)
            } else {
              column.setFilterValue(value)
            }
          }
        }}
        onKeyDown={handleKeyDown}
        value={filterValues}
        valueLabelDisplay="auto"
        {...sliderProps}
        slotProps={{
          input: {
            ref: (node) => {
              if (node) {
                filterInputRefs.current![`${column.id}-0`] = node
                // @ts-expect-error
                if (sliderProps?.slotProps?.input?.ref) {
                  // @ts-expect-error
                  sliderProps.slotProps.input.ref = node
                }
              }
            },
          },
        }}
        sx={(theme) => ({
          m: 'auto',
          minWidth: `${column.getSize() - 50}px`,
          mt: !showChangeModeButton ? '10px' : '6px',
          px: '4px',
          width: 'calc(100% - 8px)',
          ...(parseFromValuesOrFunc(sliderProps?.sx, theme) as any),
        })}
      />
      {showChangeModeButton ? (
        <FormHelperText
          sx={{
            fontSize: '0.75rem',
            lineHeight: '0.8rem',
            m: '-3px -6px',
            whiteSpace: 'nowrap',
          }}
        >
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ],
          )}
        </FormHelperText>
      ) : null}
    </Stack>
  )
}
