import clsx from 'clsx'


import { useEffect, useRef, useState } from 'react'

import {
  ActionIcon,
  Collapse,
  Menu,
  TextInput,
  
  Tooltip
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu'
import classes from './MRT_GlobalFilterTextInput.module.css'
import type {MRT_RowData, MRT_TableInstance} from '../../types';
import type {TextInputProps} from '@mantine/core';

interface Props<TData extends MRT_RowData> extends TextInputProps {
  table: MRT_TableInstance<TData>
}

export const MRT_GlobalFilterTextInput = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      enableGlobalFilterModes,
      icons: { IconSearch, IconX },
      localization,
      mantineSearchTextInputProps,
      manualFiltering,
      positionGlobalFilter,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table
  const { globalFilter, showGlobalFilter } = state

  const textFieldProps = {
    ...parseFromValuesOrFunc(mantineSearchTextInputProps, {
      table,
    }),
    ...rest,
  }

  const isMounted = useRef(false)
  const [searchValue, setSearchValue] = useState(globalFilter ?? '')

  const [debouncedSearchValue] = useDebouncedValue(
    searchValue,
    manualFiltering ? 500 : 250,
  )

  useEffect(() => {
    setGlobalFilter(debouncedSearchValue || undefined)
  }, [debouncedSearchValue])

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
    <Collapse className={classes.collapse} expanded={showGlobalFilter}>
      {enableGlobalFilterModes && (
        <Menu withinPortal>
          <Menu.Target>
            <ActionIcon
              aria-label={localization.changeSearchMode}
              color="gray"
              size="sm"
              variant="transparent"
            >
              <IconSearch />
            </ActionIcon>
          </Menu.Target>
          <MRT_FilterOptionMenu onSelect={handleClear} table={table} />
        </Menu>
      )}
      <TextInput
        leftSection={!enableGlobalFilterModes && <IconSearch />}
        mt={0}
        mx={positionGlobalFilter !== 'left' ? 'mx' : undefined}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder={localization.search}
        rightSection={
          <ActionIcon
            aria-label={localization.clearSearch}
            color="gray"
            disabled={!searchValue?.length}
            hidden={!searchValue}
            onClick={handleClear}
            size="sm"
            style={{
              visibility: !searchValue ? 'hidden' : undefined,
            }}
            variant="transparent"
          >
            <Tooltip label={localization.clearSearch} withinPortal>
              <IconX />
            </Tooltip>
          </ActionIcon>
        }
        value={searchValue ?? ''}
        variant="filled"
        {...textFieldProps}
        className={clsx(
          'mrt-global-filter-text-input',
          classes.root,
          textFieldProps?.className,
        )}
        ref={(node) => {
          if (node) {
            searchInputRef.current = node
            if (textFieldProps?.ref) {
              // @ts-ignore
              textFieldProps.ref = node
            }
          }
        }}
      />
    </Collapse>
  )
}
