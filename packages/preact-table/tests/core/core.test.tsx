/** @jsxImportSource preact */

import { describe, expect, it } from 'vitest'
import { render } from 'preact'
import { act } from 'preact/test-utils'
import { useReducer } from 'preact/hooks'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  usePreactTable,
} from '../../src'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const defaultData: Person[] = [
  { firstName: 'tanner', lastName: 'linsley', age: 29 },
  { firstName: 'joe', lastName: 'bergevin', age: 45 },
]

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: (info) => info.getValue(),
  },
]

function makeContainer() {
  const container = document.createElement('div')
  document.body.append(container)
  return container
}

describe('preact-table core', () => {
  it('flexRender handles null, primitives, and component renderables', () => {
    const container = makeContainer()

    expect(flexRender<{}>(null as any, {})).toBeNull()
    expect(flexRender<any>('static', {} as any)).toEqual('static')

    const Greeting = ({ name }: { name: string }) => <span>Hello {name}</span>
    const node = flexRender(Greeting, { name: 'Preact' })

    act(() => {
      render(<div>{node}</div>, container)
    })

    expect(container.textContent).toContain('Hello Preact')

    act(() => {
      render(null, container)
    })
    container.remove()
  })

  it('keeps a stable table instance across re-renders', () => {
    const container = makeContainer()
    let tableRef: ReturnType<typeof usePreactTable<Person>> | undefined
    let triggerRerender: (() => void) | undefined

    function App() {
      const [, rerender] = useReducer((x: number) => x + 1, 0)
      const table = usePreactTable({
        data: defaultData,
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
      })

      tableRef = table
      triggerRerender = () => rerender(Math.random())

      return null
    }

    act(() => {
      render(<App />, container)
    })

    const prev = tableRef

    act(() => {
      triggerRerender?.()
    })

    const next = tableRef

    expect(prev).toBeDefined()
    expect(next).toBeDefined()
    expect(prev).toStrictEqual(next)

    act(() => {
      render(null, container)
    })
    container.remove()
  })

  it('updates internal state and calls onStateChange', () => {
    const container = makeContainer()
    let tableRef: ReturnType<typeof usePreactTable<Person>> | undefined
    let onStateChangeCount = 0

    function App() {
      const table = usePreactTable({
        data: defaultData,
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
        onStateChange: () => {
          onStateChangeCount++
        },
      })

      tableRef = table
      return null
    }

    act(() => {
      render(<App />, container)
    })

    act(() => {
      tableRef?.setColumnVisibility({ firstName: false })
    })

    expect(tableRef?.getState().columnVisibility).toEqual({ firstName: false })
    expect(onStateChangeCount).toBeGreaterThan(0)

    act(() => {
      render(null, container)
    })
    container.remove()
  })
})
