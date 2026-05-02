import clsx from 'clsx'


import {
  ActionIcon,
  Box,
  Group,
  Pagination,
  
  Select,
  Text
} from '@mantine/core'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MRT_TablePagination.module.css'
import type {PaginationProps} from '@mantine/core';

import type {MRT_RowData, MRT_TableInstance} from '../../types';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100].map((x) =>
  x.toString(),
)

interface Props<TData extends MRT_RowData> extends Partial<PaginationProps> {
  position?: 'bottom' | 'top'
  table: MRT_TableInstance<TData>
}

export const MRT_TablePagination = <TData extends MRT_RowData>({
  position = 'bottom',
  table,
  ...props
}: Props<TData>) => {
  const {
    getPrePaginatedRowModel,
    state,
    options: {
      enableToolbarInternalActions,
      icons: {
        IconChevronLeft,
        IconChevronLeftPipe,
        IconChevronRight,
        IconChevronRightPipe,
      },
      localization,
      mantinePaginationProps,
      paginationDisplayMode,
      rowCount,
    },
    setPageIndex,
    setPageSize,
  } = table
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
    showGlobalFilter,
  } = state

  const paginationProps = {
    ...parseFromValuesOrFunc(mantinePaginationProps, {
      table,
    }),
    ...props,
  }

  const totalRowCount = rowCount ?? getPrePaginatedRowModel().rows.length
  const numberOfPages = Math.ceil(totalRowCount / pageSize)
  const showFirstLastPageButtons = numberOfPages > 2
  const firstRowIndex = pageIndex * pageSize
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount)

  const {
    rowsPerPageOptions = defaultRowsPerPage,
    showRowsPerPage = true,
    withEdges = showFirstLastPageButtons,
    ...rest
  } = paginationProps ?? {}

  const needsTopMargin =
    position === 'top' && enableToolbarInternalActions && !showGlobalFilter

  return (
    <Box
      className={clsx(
        'mrt-table-pagination',
        classes.root,
        needsTopMargin && classes['with-top-margin'],
      )}
    >
      {paginationProps?.showRowsPerPage !== false && (
        <Group gap="xs">
          <Text id="rpp-label">{localization.rowsPerPage}</Text>
          <Select
            allowDeselect={false}
            aria-labelledby="rpp-label"
            className={classes.pagesize}
            data={paginationProps?.rowsPerPageOptions ?? defaultRowsPerPage}
            onChange={(value: null | string) => setPageSize(+(value as string))}
            value={pageSize.toString()}
          />
        </Group>
      )}
      {paginationDisplayMode === 'pages' ? (
        <Pagination
          firstIcon={IconChevronLeftPipe}
          lastIcon={IconChevronRightPipe}
          nextIcon={IconChevronRight}
          onChange={(newPageIndex) => setPageIndex(newPageIndex - 1)}
          previousIcon={IconChevronLeft}
          total={numberOfPages}
          value={pageIndex + 1}
          withEdges={withEdges}
          {...rest}
        />
      ) : paginationDisplayMode === 'default' ? (
        <>
          <Text>{`${
            lastRowIndex === 0 ? 0 : (firstRowIndex + 1).toLocaleString()
          }-${lastRowIndex.toLocaleString()} ${
            localization.of
          } ${totalRowCount.toLocaleString()}`}</Text>
          <Group gap={6}>
            {withEdges && (
              <ActionIcon
                aria-label={localization.goToFirstPage}
                color="gray"
                disabled={pageIndex <= 0}
                onClick={() => setPageIndex(0)}
                variant="subtle"
              >
                <IconChevronLeftPipe />
              </ActionIcon>
            )}
            <ActionIcon
              aria-label={localization.goToPreviousPage}
              color="gray"
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              variant="subtle"
            >
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              aria-label={localization.goToNextPage}
              color="gray"
              disabled={lastRowIndex >= totalRowCount}
              onClick={() => setPageIndex(pageIndex + 1)}
              variant="subtle"
            >
              <IconChevronRight />
            </ActionIcon>
            {withEdges && (
              <ActionIcon
                aria-label={localization.goToLastPage}
                color="gray"
                disabled={lastRowIndex >= totalRowCount}
                onClick={() => setPageIndex(numberOfPages - 1)}
                variant="subtle"
              >
                <IconChevronRightPipe />
              </ActionIcon>
            )}
          </Group>
        </>
      ) : null}
    </Box>
  )
}
