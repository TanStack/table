import { useCallback, useEffect, useRef, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { debounce } from '@mui/material/utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { TextFieldProps } from '@mui/material/TextField'
import type { ChangeEvent, MouseEvent } from 'react'

export interface MRT_GlobalFilterTextFieldProps<
  TData extends MRT_RowData,
> extends TextFieldProps<'standard'> {
  table: MRT_TableInstance<TData>
}

export const MRT_GlobalFilterTextField = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    state,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      muiSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table
  const { globalFilter, showGlobalFilter } = state

  const textFieldProps = {
    ...parseFromValuesOrFunc(muiSearchTextFieldProps, {
      table,
    }),
    ...rest,
  }

  const isMounted = useRef(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [searchValue, setSearchValue] = useState(globalFilter ?? '')

  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined)
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    handleChangeDebounced(event)
  }

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClear = () => {
    setSearchValue('')
    setGlobalFilter(undefined)
  }

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear()
      } else {
        setSearchValue(globalFilter)
      }
    }
    isMounted.current = true
  }, [globalFilter])

  return (
    <Collapse
      in={showGlobalFilter}
      mountOnEnter
      orientation="horizontal"
      unmountOnExit
    >
      <TextField
        onChange={handleChange}
        placeholder={localization.search}
        size="small"
        value={searchValue ?? ''}
        variant="outlined"
        {...textFieldProps}
        slotProps={{
          ...(textFieldProps.slotProps as any),
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={localization.clearSearch ?? ''}>
                  <span>
                    <IconButton
                      aria-label={localization.clearSearch}
                      disabled={!searchValue?.length}
                      onClick={handleClear}
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
            startAdornment: enableGlobalFilterModes ? (
              <InputAdornment position="start">
                <Tooltip title={localization.changeSearchMode}>
                  <IconButton
                    aria-label={localization.changeSearchMode}
                    onClick={handleGlobalFilterMenuOpen}
                    size="small"
                    sx={{ height: '1.75rem', width: '1.75rem' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : (
              <SearchIcon style={{ marginRight: '4px' }} />
            ),
            ...(textFieldProps.slotProps as any)?.input,
            sx: (theme: any) => ({
              mb: 0,
              ...parseFromValuesOrFunc(
                (textFieldProps.slotProps as any)?.input?.sx,
                theme,
              ),
            }),
          },
          htmlInput: {
            autoComplete: 'off',
            ...(textFieldProps.slotProps as any)?.htmlInput,
          },
        }}
        inputRef={(inputRef) => {
          searchInputRef.current = inputRef
          if (textFieldProps?.inputRef) {
            ;(textFieldProps as any).inputRef = inputRef
          }
        }}
      />
      <MRT_FilterOptionMenu
        anchorEl={anchorEl}
        onSelect={handleClear}
        setAnchorEl={setAnchorEl}
        table={table}
      />
    </Collapse>
  )
}
