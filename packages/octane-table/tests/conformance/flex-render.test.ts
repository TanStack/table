/**
 * flexRender conformance — every renderer shape a columnDef can carry, through
 * octane's value-position rendering: string, render-fn, component (props
 * arrive), pre-created descriptor passthrough, undefined, octane memo()
 * (a plain function — the branch upstream needed exotic-component sniffing
 * for), and the upstream falsy quirk pinned as-is.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { flexRender } from '@tanstack/octane-table'
import { mount, nextPaint } from '../_helpers'
import { FlexTable, cellProps } from '../_fixtures/flex-render.tsrx'

async function flush() {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0))
    await nextPaint()
  }
}

beforeEach(() => {
  cellProps.length = 0
})

describe('flexRender through the octane render path', () => {
  it('renders a string header as text', async () => {
    const r = mount(FlexTable, {})
    await flush()
    expect(r.find('#f-th-firstName').textContent).toBe('First Name')
    r.unmount()
  })

  it('renders a render-fn header with its context', async () => {
    const r = mount(FlexTable, {})
    await flush()
    expect(r.find('#f-th-lastName').textContent).toBe('hdr:lastName')
    r.unmount()
  })

  it('renders a component cell and passes the full cell context as props', async () => {
    const r = mount(FlexTable, {})
    await flush()
    const cells = r.findAll('.name-cell')
    expect(cells.map((c) => c.textContent)).toEqual(['nc:tanner', 'nc:derek'])
    expect(cellProps.length).toBeGreaterThan(0)
    const props = cellProps[0] as Record<string, unknown>
    for (const key of [
      'getValue',
      'renderValue',
      'row',
      'column',
      'table',
      'cell',
    ]) {
      expect(
        props,
        `cell component missing context prop ${key}`,
      ).toHaveProperty(key)
    }
    r.unmount()
  })

  it('renders nothing (no crash) for an undefined renderer', async () => {
    const r = mount(FlexTable, {})
    await flush()
    expect(r.find('#f-th-age').textContent).toBe('')
    r.unmount()
  })

  it('passes a pre-created element descriptor through the non-component branch', async () => {
    const r = mount(FlexTable, {})
    await flush()
    const statics = r.findAll('.static-cell')
    expect(statics.length).toBe(2) // one per row, same descriptor value
    expect(statics[0].textContent).toBe('static')
    r.unmount()
  })

  it('renders an octane memo()-wrapped component cell (plain function, no exotic sniffing)', async () => {
    const r = mount(FlexTable, {})
    await flush()
    const cells = r.findAll('.age-cell')
    expect(cells.map((c) => c.textContent)).toEqual(['mc:29', 'mc:40'])
    r.unmount()
  })

  it('treats only null and undefined as empty renderers', () => {
    expect(flexRender(undefined, {})).toBe(null)
    expect(flexRender(null, {})).toBe(null)
    expect(flexRender('' as never, {})).toBe('')
    expect(flexRender(0 as never, {})).toBe(0)
    expect(flexRender('x', {})).toBe('x')
    expect(flexRender(42 as never, {})).toBe(42)
  })
})
