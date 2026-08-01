/**
 * createTableHook conformance — the composition layer on top of `useTable`:
 * App* wrappers provide the table/cell/header through octane context, and the
 * registered component maps are attached to the instances handed to children.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, nextPaint } from '../_helpers'
import {
  AppTableFixture,
  AppTableWithSelector,
  OrphanTableConsumer,
  captured,
} from '../_fixtures/app-table.tsrx'

async function flush() {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0))
    await nextPaint()
  }
}

beforeEach(() => {
  captured.table = undefined
  captured.cellCtx.length = 0
})

describe('createTableHook', () => {
  it('renders registered cell/header/table components bound to their context', async () => {
    const r = mount(AppTableFixture, {})
    await flush()

    // tableComponents are attached to the table instance itself.
    expect(r.find('#row-count').textContent).toBe('rows=3')

    // cellComponents resolve the cell through cellContext.
    expect(r.findAll('.txt').map((n) => n.textContent)).toEqual([
      't:tanner',
      't:29',
      't:derek',
      't:45',
      't:joe',
      't:42',
    ])

    // headerComponents resolve the header through headerContext, and the
    // context-bound FlexRender renders columnDef.header.
    expect(r.find('#a-th-firstName').textContent).toBe('Firstnone')
    expect(r.findAll('.sort').map((n) => n.textContent)).toEqual([
      'none',
      'none',
    ])

    // AppFooter's context-bound FlexRender renders columnDef.footer, not header.
    expect(r.findAll('.a-foot').map((n) => n.textContent)).toEqual([
      'f-first',
      'f-age',
    ])
    r.unmount()
  })

  it('passes the real cell instance (not a copy) to cellComponents', async () => {
    const r = mount(AppTableFixture, {})
    await flush()
    const table = captured.table
    const firstCell = table.getRowModel().rows[0].getAllCells()[0]
    expect(captured.cellCtx[0]).toBe(firstCell)
    r.unmount()
  })

  it('re-renders a table.Subscribe child when its selected slice changes', async () => {
    const r = mount(AppTableFixture, {})
    await flush()
    expect(r.find('#sort-n').textContent).toBe('n=0')

    r.click('#a-th-firstName') // sort asc
    await flush()
    expect(r.find('#sort-n').textContent).toBe('n=1')
    expect(r.find('#a-th-firstName').textContent).toBe('Firstasc')
    // The sorted order reached the DOM through the AppCell children.
    expect(r.findAll('.txt')[0].textContent).toBe('t:derek')
    r.unmount()
  })

  it('AppTable with a selector renders children as a render prop', async () => {
    const r = mount(AppTableWithSelector, {})
    await flush()
    expect(r.find('#sel-out').textContent).toBe('sorted=0')
    r.unmount()
  })

  it('throws a helpful error when a table component is used outside AppTable', () => {
    expect(() => mount(OrphanTableConsumer, {})).toThrow(
      /must be used within an `AppTable`/,
    )
  })
})
