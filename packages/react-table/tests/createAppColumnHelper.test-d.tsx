// Type-level tests for `createAppColumnHelper`, checked by `test:types` (tsc).
// Not executed by vitest (the `.test-d.` name is excluded from its run glob).

import * as React from 'react'
import { rowAggregationFeature, tableFeatures } from '@tanstack/table-core'
import { test } from 'vitest'
import { createTableHook, createTableHookContexts } from '../src'

type Person = {
  id: string
  name: string
}

const features = tableFeatures({
  rowAggregationFeature,
})
const contexts = createTableHookContexts<typeof features, Person>()

function NameCell() {
  const cell = contexts.useCellContext<string>()

  return <span>{cell.getValue().toUpperCase()}</span>
}

const appTable = createTableHook({
  features,
  tableContext: contexts.tableContext,
  cellContext: contexts.cellContext,
  headerContext: contexts.headerContext,
  cellComponents: { NameCell },
})
const columnHelper = appTable.createAppColumnHelper<Person>()

test('aggregatedCell is bound to cellComponents like cell', () => {
  columnHelper.accessor('name', {
    id: 'name',
    // The bound `cellComponents` are available on the cell context here...
    cell: ({ cell }) => <cell.NameCell />,
    // ...and must be equally available on the aggregatedCell context.
    aggregatedCell: ({ cell }) => <cell.NameCell />,
  })

  columnHelper.display({
    id: 'display',
    cell: ({ cell }) => <cell.NameCell />,
    aggregatedCell: ({ cell }) => <cell.NameCell />,
  })

  columnHelper.group({
    id: 'group',
    aggregatedCell: ({ cell }) => <cell.NameCell />,
    columns: [],
  })

  columnHelper.accessor('name', {
    id: 'guard',
    // @ts-expect-error a component that was not registered is not bound
    aggregatedCell: ({ cell }) => <cell.NotRegistered />,
  })
})
