/**
 * @tanstack/octane-table core conformance — `useTable`'s state wiring through
 * octane's render path, against the REAL @tanstack/table-core.
 * Ports the behaviors of upstream react-table's tests/core/core.test.tsx
 * (markup render, stable api, rowModel) and adds the state-wiring matrix the
 * upstream suite doesn't cover.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, nextPaint } from '../_helpers'
import {
  BasicTable,
  SwapApp,
  SortingTable,
  ControlledSortingTable,
  SelectorTable,
  renders,
  captured,
  defaultData,
  altData,
} from '../_fixtures/table-basic.tsrx'

async function flush() {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0))
    await nextPaint()
  }
}

beforeEach(() => {
  renders.basic = 0
  renders.sorting = 0
  renders.controlled = 0
  renders.selected = 0
  captured.table = undefined
  captured.tables.length = 0
  captured.sortingStates.length = 0
  captured.selectedStates.length = 0
})

describe('core (ports of upstream core.test.tsx)', () => {
  it('renders a table with markup (thead/tbody/tfoot via flexRender)', async () => {
    // Per react-table tests/core/core.test.tsx "renders a table with markup".
    const r = mount(BasicTable, {})
    await flush()
    const headers = r.findAll('thead th')
    expect(headers.map((h) => h.textContent)).toEqual([
      'First Name',
      'Last Name',
      'Age',
    ])
    expect(r.findAll('tbody tr').length).toBe(3)
    const firstRow = r.findAll('tbody tr')[0]
    expect(
      Array.from(firstRow.querySelectorAll('td')).map((c) => c.textContent),
    ).toEqual(['tanner', 'linsley', '29'])
    expect(r.findAll('tfoot th')[0].textContent).toBe('fn-footer')
    r.unmount()
  })

  it('keeps one underlying table instance across re-renders', async () => {
    // Per react-table tests/core/core.test.tsx "has a stable api", adapted to
    // v9: `useTable` returns a FRESH wrapper object each render (it re-binds
    // `state` and `options` to the values read during that render), so the
    // stable thing is the underlying instance — its store and its state atoms,
    // which is what actually must survive for state to persist.
    const r = mount(SwapApp, {})
    await flush()
    expect(captured.tables.length).toBeGreaterThan(0)
    const first = captured.tables[0] as any

    r.click('#bump') // unrelated parent state
    await flush()
    expect(captured.tables.length).toBeGreaterThan(1)
    for (const t of captured.tables as Array<any>) {
      expect(t.store).toBe(first.store)
      expect(t.baseAtoms).toBe(first.baseAtoms)
    }
    r.unmount()
  })

  it('can return the rowModel', async () => {
    // Per react-table tests/core/core.test.tsx "can return the rowModel".
    const r = mount(BasicTable, {})
    await flush()
    const table = captured.table as any
    const model = table.getRowModel()
    expect(model.rows.length).toBe(3)
    expect(model.flatRows.length).toBe(3)
    expect(model.rowsById['0'].original).toBe(defaultData[0])
    r.unmount()
  })

  it('propagates a data swap through the render-phase setOptions', async () => {
    const r = mount(SwapApp, {})
    await flush()

    r.click('#swap-data')
    await flush()
    expect(r.findAll('tbody tr').length).toBe(2)
    expect(r.findAll('tbody td')[0].textContent).toBe('kevin')
    expect((captured.table as any).getRowModel().rows[0].original).toBe(
      altData[0],
    )

    r.click('#swap-data')
    await flush()
    expect(r.findAll('tbody tr').length).toBe(3)
    r.unmount()
  })

  it('propagates a columns swap', async () => {
    const r = mount(SwapApp, {})
    await flush()

    r.click('#swap-cols')
    await flush()
    const headers = r.findAll('thead th')
    expect(headers.map((h) => h.textContent)).toEqual(['Only Age'])
    expect(r.findAll('tbody tr')[0].querySelectorAll('td').length).toBe(1)
    r.unmount()
  })
})

describe('state wiring', () => {
  const firstNames = (r: ReturnType<typeof mount>) =>
    r.findAll('tbody tr').map((tr) => tr.querySelector('td')!.textContent)

  it('uncontrolled sorting toggles asc → desc → cleared', async () => {
    const r = mount(SortingTable, {})
    await flush()
    expect(firstNames(r)).toEqual(['tanner', 'derek', 'joe']) // natural order

    r.click('#s-th-firstName')
    await flush()
    expect(firstNames(r)).toEqual(['derek', 'joe', 'tanner']) // asc
    expect(r.find('#s-th-firstName').textContent).toBe('First Name A')

    r.click('#s-th-firstName')
    await flush()
    expect(firstNames(r)).toEqual(['tanner', 'joe', 'derek']) // desc
    expect(r.find('#s-th-firstName').textContent).toBe('First Name D')

    r.click('#s-th-firstName')
    await flush()
    expect(firstNames(r)).toEqual(['tanner', 'derek', 'joe']) // cleared (sortRemoval)
    expect(r.find('#s-th-firstName').textContent).toBe('First Name')
    r.unmount()
  })

  it('partially-controlled sorting flows through the parent state', async () => {
    const r = mount(ControlledSortingTable, {})
    await flush()

    r.click('#c-th-firstName')
    await flush()
    const last = captured.sortingStates[captured.sortingStates.length - 1]
    expect(last).toEqual([{ id: 'firstName', desc: false }])
    expect(r.findAll('.c-cell')[0].textContent).toBe('derek') // DOM reordered too
    r.unmount()
  })

  it('exposes only the selected projection on table.state', async () => {
    // v9's `useTable` takes a selector as its 2nd argument; `table.state` is
    // that projection, not the full TableState. Re-renders are driven by the
    // selected value (shallow-compared), so sorting must move it.
    const r = mount(SelectorTable, {})
    await flush()
    expect(r.find('#sel-state').textContent).toBe('n=0')
    expect(Object.keys(captured.selectedStates[0] as object)).toEqual([
      'sortCount',
    ])

    r.click('#sel-sort')
    await flush()
    expect(r.find('#sel-state').textContent).toBe('n=1')
    r.unmount()
  })

  it('one state update re-renders exactly once (render-phase setOptions is loop-free)', async () => {
    const r = mount(SortingTable, {})
    await flush()
    const base = renders.sorting

    r.click('#s-th-firstName')
    await flush()
    expect(renders.sorting).toBe(base + 1)
    r.unmount()
  })
})
