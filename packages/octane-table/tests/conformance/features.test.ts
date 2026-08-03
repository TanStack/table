/**
 * Feature smokes — every table-core feature row model wired through the
 * octane render path: filtering (column + global + faceting), pagination,
 * row selection (incl. the enableRowSelection predicate, per upstream
 * RowSelection.test.tsx), column visibility (per upstream Visibility.test.tsx,
 * plus group-header colSpan), expanding (with keyed-row DOM identity), and
 * grouping/aggregation.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, nextPaint } from '../_helpers'
import {
  FilterTable,
  PaginationTable,
  SelectionTable,
  VisibilityTable,
  ExpandTable,
  GroupTable,
  captured,
} from '../_fixtures/features.tsrx'

async function flush() {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0))
    await nextPaint()
  }
}

function input(r: ReturnType<typeof mount>, selector: string, value: string) {
  const el = r.find(selector) as HTMLInputElement
  const proto = Object.getPrototypeOf(el)
  Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

beforeEach(() => {
  captured.table = undefined
})

describe('filtering + faceting', () => {
  it('column filter narrows and restores via onInput', async () => {
    const r = mount(FilterTable, {})
    await flush()
    expect(r.findAll('.f-row').length).toBe(5)

    input(r, '#flt', 'an') // tanner, ryan
    await flush()
    expect(r.findAll('.f-row').map((li) => li.textContent)).toEqual([
      'tanner',
      'ryan',
    ])

    input(r, '#flt', '')
    await flush()
    expect(r.findAll('.f-row').length).toBe(5)
    r.unmount()
  })

  it('global filter matches across columns', async () => {
    const r = mount(FilterTable, { global: true })
    await flush()

    input(r, '#gflt', 'complicated')
    await flush()
    expect(r.findAll('.f-row').map((li) => li.textContent)).toEqual([
      'derek',
      'ryan',
    ])
    r.unmount()
  })

  it('faceted unique values reflect the column data', async () => {
    const r = mount(FilterTable, {})
    await flush()
    const facets = captured.table.getColumn('status')!.getFacetedUniqueValues()
    expect(facets.get('single')).toBe(3)
    expect(facets.get('complicated')).toBe(2)
    r.unmount()
  })
})

describe('pagination', () => {
  it('windows rows, pages with buttons, and tracks canPrev/canNext', async () => {
    const r = mount(PaginationTable, {})
    await flush()
    expect(r.find('#pi').textContent).toBe('0/3') // 25 rows / pageSize 10
    expect(r.findAll('.p-row').length).toBe(10)
    expect(r.findAll('.p-row')[0].textContent).toBe('p00')
    expect((r.find('#prev') as HTMLButtonElement).disabled).toBe(true)

    r.click('#next')
    await flush()
    expect(r.find('#pi').textContent).toBe('1/3')
    expect(r.findAll('.p-row')[0].textContent).toBe('p10')
    expect((r.find('#prev') as HTMLButtonElement).disabled).toBe(false)

    r.click('#next')
    await flush()
    expect(r.find('#pi').textContent).toBe('2/3')
    expect(r.findAll('.p-row').length).toBe(5) // last partial page
    expect((r.find('#next') as HTMLButtonElement).disabled).toBe(true)

    r.click('#prev')
    await flush()
    expect(r.find('#pi').textContent).toBe('1/3')
    r.unmount()
  })

  it('setPageSize re-windows and updates the page count', async () => {
    const r = mount(PaginationTable, {})
    await flush()

    r.click('#ps-5')
    await flush()
    expect(r.find('#pi').textContent).toBe('0/5')
    expect(r.findAll('.p-row').length).toBe(5)
    r.unmount()
  })
})

describe('row selection (ports of upstream RowSelection.test.tsx behaviors)', () => {
  it('selects and clears a single row', async () => {
    const r = mount(SelectionTable, {})
    await flush()
    expect(r.find('#sel-n').textContent).toBe('0')

    r.click('#cb-1')
    await flush()
    expect(r.find('#sel-n').textContent).toBe('1')
    expect(captured.table.getRow('1').getIsSelected()).toBe(true)
    expect(r.findAll('.sel-row')[1].getAttribute('data-selected')).toBe('1')

    r.click('#cb-1')
    await flush()
    expect(r.find('#sel-n').textContent).toBe('0')
    expect(captured.table.getRow('1').getIsSelected()).toBe(false)
    r.unmount()
  })

  it('select-all only selects rows the enableRowSelection predicate allows', async () => {
    // Per upstream "Select all do not select rows which are not available".
    const r = mount(SelectionTable, { predicated: true })
    await flush()

    r.click('#cb-all')
    await flush()
    // Only derek (45) and joe (42) pass age > 40.
    expect(r.find('#sel-n').textContent).toBe('2')
    expect(
      r.findAll('.sel-row').map((li) => li.getAttribute('data-selected')),
    ).toEqual(['0', '1', '1', '0', '0'])
    // table-core counts only SELECTABLE rows for "all" (verified against the
    // real core): every predicate-eligible row is selected → isAll true, and
    // 2 of 5 flat rows → isSome (indeterminate) true.
    expect(captured.table.getIsAllRowsSelected()).toBe(true)
    expect(captured.table.getIsSomeRowsSelected()).toBe(true)

    r.click('#cb-all')
    await flush()
    expect(r.find('#sel-n').textContent).toBe('0')
    expect(captured.table.getIsSomeRowsSelected()).toBe(false)
    r.unmount()
  })

  it('ineligible rows render disabled checkboxes', async () => {
    const r = mount(SelectionTable, { predicated: true })
    await flush()
    expect((r.find('#cb-0') as HTMLInputElement).disabled).toBe(true) // tanner, 29
    expect((r.find('#cb-1') as HTMLInputElement).disabled).toBe(false) // derek, 45
    r.unmount()
  })
})

describe('column visibility (ports upstream Visibility.test.tsx behavior)', () => {
  it('toggling a leaf column shrinks the group header colSpan and the row cells', async () => {
    const r = mount(VisibilityTable, {})
    await flush()
    // The group header is the first th of the FIRST header row (grouped
    // header ids are depth-mangled — `1_name_firstName` — so query
    // structurally, not by id).
    const groupTh = () =>
      r.findAll('thead tr')[0].querySelector('th') as HTMLTableCellElement
    expect(groupTh().textContent).toBe('Name')
    expect(groupTh().colSpan).toBe(2)
    expect(r.findAll('.v-row')[0].querySelectorAll('td').length).toBe(3)

    r.click('#vis-firstName')
    await flush()
    expect(groupTh().colSpan).toBe(1)
    expect(r.findAll('.v-row')[0].querySelectorAll('td').length).toBe(2)

    r.click('#vis-firstName')
    await flush()
    expect(groupTh().colSpan).toBe(2)
    expect(r.findAll('.v-row')[0].querySelectorAll('td').length).toBe(3)
    r.unmount()
  })
})

describe('expanding', () => {
  it('expands and collapses nested subRows, keeping parent row DOM identity', async () => {
    const r = mount(ExpandTable, {})
    await flush()
    expect(r.findAll('.e-row').length).toBe(2)
    const rootA = r.find('[data-rid="0"]')

    r.click('[data-for="0"]')
    await flush()
    expect(
      r.findAll('.e-row').map((li) => li.getAttribute('data-rid')),
    ).toEqual(['0', '0.0', '0.1', '1'])
    expect(r.find('[data-rid="0.1"]').getAttribute('data-depth')).toBe('1')
    // Keyed @for reuses the parent row's DOM node across the expand.
    expect(r.find('[data-rid="0"]')).toBe(rootA)

    r.click('[data-for="0.1"]') // nested expand
    await flush()
    expect(r.findAll('.e-row').length).toBe(5)
    expect(r.find('[data-rid="0.1.0"]').getAttribute('data-depth')).toBe('2')

    r.click('[data-for="0"]') // collapse parent (child expansion retained in state)
    await flush()
    expect(r.findAll('.e-row').length).toBe(2)
    r.unmount()
  })
})

describe('grouping + aggregation', () => {
  it('renders grouped rows with aggregated cells through flexRender', async () => {
    const r = mount(GroupTable, {})
    await flush()
    const grouped = r.findAll('.g-row[data-grouped="1"]')
    expect(grouped.length).toBe(2) // single, complicated
    // Aggregated age sums: single = 29+42+27, complicated = 45+38.
    const texts = grouped.map((li) => li.textContent)
    expect(texts[0]).toContain('single')
    expect(texts[0]).toContain('sum:98')
    expect(texts[1]).toContain('complicated')
    expect(texts[1]).toContain('sum:83')
    // Leaf rows render underneath (expanded: true).
    expect(r.findAll('.g-row').length).toBe(7) // 2 group rows + 5 leaves
    r.unmount()
  })
})
