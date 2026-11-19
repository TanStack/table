// @vitest-environment jsdom

import { afterEach, expect, test } from 'vitest'
import { cleanup, render } from '@solidjs/testing-library'
import { Loading, createMemo, createSignal, flush } from 'solid-js'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import type { ColumnDef } from '@tanstack/table-core'

afterEach(() => cleanup())

type Data = { id: string; name: string }
const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
  { id: 'name', accessorKey: 'name', cell: ({ getValue }) => `${getValue()}` },
]

test('waits under Loading for async data instead of throwing', async () => {
  let resolve!: (rows: Array<Data>) => void
  const [trigger] = createSignal(0)
  function App() {
    const rows = createMemo(() => {
      trigger()
      return new Promise<Array<Data>>((r) => (resolve = r))
    })
    const table = createTable({
      get data() {
        return rows()
      },
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    // `<table.Subscribe>` is read in the component body, before the table
    // is built.
    return (
      <table.Subscribe>
        {() => (
          <ul>
            {table.getRowModel().rows.map((row) => (
              <li>{row.original.name}</li>
            ))}
          </ul>
        )}
      </table.Subscribe>
    )
  }
  const { container } = render(() => (
    <Loading fallback={<p>loading</p>}>
      <App />
    </Loading>
  ))
  expect(container.textContent).toBe('loading')
  resolve([{ id: '1', name: 'Ada' }])
  await new Promise((r) => setTimeout(r, 0))
  flush()
  expect(container.textContent).toBe('Ada')
})

test('waits under Loading for async controlled state', async () => {
  let resolve!: (rows: Array<Data>) => void
  const [trigger] = createSignal(0)
  function App() {
    const rows = createMemo(() => {
      trigger()
      return new Promise<Array<Data>>((r) => (resolve = r))
    })
    const table = createTable({
      data: [{ id: '1', name: 'Ada' }],
      get state() {
        return { sorting: rows().length ? [] : [] }
      },
      columns,
      features: stockFeatures,
      getRowId: (row) => row.id,
    })
    // `<table.Subscribe>` is read in the component body, before the table
    // is built.
    return (
      <table.Subscribe>
        {() => (
          <ul>
            {table.getRowModel().rows.map((row) => (
              <li>{row.original.name}</li>
            ))}
          </ul>
        )}
      </table.Subscribe>
    )
  }
  const { container } = render(() => (
    <Loading fallback={<p>loading</p>}>
      <App />
    </Loading>
  ))
  expect(container.textContent).toBe('loading')
  resolve([{ id: '1', name: 'Ada' }])
  await new Promise((r) => setTimeout(r, 0))
  flush()
  expect(container.textContent).toBe('Ada')
})
