// @vitest-environment jsdom

import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { stockFeatures } from '@tanstack/table-core'
import { renderComponent } from '../src/render-component'
import ContextFailure from './fixtures/ContextFailure.svelte'
import FlexRenderHarness from './fixtures/FlexRenderHarness.svelte'
import HookHarness from './fixtures/HookHarness.svelte'
import RenderBadge from './fixtures/RenderBadge.svelte'
import { hook } from './fixtures/hook-fixture'
import type { AppSvelteTable } from '../src/createTableHook.svelte'

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent
}

function createCell(
  renderer: (context: { value: string }) => unknown,
  value: string,
  modes: {
    aggregatedRenderer?: (context: { value: string }) => unknown
    aggregated?: boolean
    placeholder?: boolean
  } = {},
) {
  return {
    column: {
      columnDef: {
        cell: renderer,
        aggregatedCell: modes.aggregatedRenderer,
      },
    },
    getContext: () => ({ value }),
    getIsAggregated: () => modes.aggregated ?? false,
    getIsPlaceholder: () => modes.placeholder ?? false,
  }
}

describe('FlexRender', () => {
  test('supports cell modes, header/footer shorthand, legacy props, and components', () => {
    const normalRenderer = vi.fn(
      (context: { value: string }) => `cell:${context.value}`,
    )
    const aggregatedRenderer = vi.fn(
      (context: { value: string }) => `aggregate:${context.value}`,
    )
    const placeholderRenderer = vi.fn(() => 'should-not-render')
    const headerRenderer = vi.fn(
      (context: { value: string }) => `header:${context.value}`,
    )
    const footerRenderer = vi.fn(
      (context: { value: string }) => `footer:${context.value}`,
    )
    const legacyContent = vi.fn(
      (context: { value: string }) => `legacy:${context.value}`,
    )
    const componentRenderer = vi.fn((context: { value: string }) =>
      renderComponent(RenderBadge, {
        label: `component:${context.value}`,
      }),
    )
    const normalCell = createCell(normalRenderer, 'Ada')
    const aggregatedCell = createCell(normalRenderer, 'Ada', {
      aggregated: true,
      aggregatedRenderer,
    })
    const placeholderCell = createCell(placeholderRenderer, 'Ada', {
      placeholder: true,
    })
    const header = {
      column: { columnDef: { header: headerRenderer } },
      getContext: () => ({ value: 'Name' }),
    }
    const footer = {
      column: { columnDef: { footer: footerRenderer } },
      getContext: () => ({ value: 'Total' }),
    }
    const componentCell = createCell(componentRenderer, 'Ada')

    render(FlexRenderHarness, {
      normalCell,
      aggregatedCell,
      placeholderCell,
      header,
      footer,
      legacyContent,
      componentCell,
      reactiveCell: normalCell,
    })

    expect(outputText('Normal cell')).toBe('cell:Ada')
    expect(outputText('Aggregated cell')).toBe('aggregate:Ada')
    expect(outputText('Placeholder cell')).toBe('')
    expect(outputText('Header')).toBe('header:Name')
    expect(outputText('Footer')).toBe('footer:Total')
    expect(outputText('Static header')).toBe('Static header')
    expect(outputText('Legacy render')).toBe('legacy:Legacy')
    expect(outputText('Component render')).toBe('component:Ada')
    expect(outputText('Snippet render')).toBe('snippet:Ada')
    expect(normalRenderer).toHaveBeenCalled()
    expect(aggregatedRenderer).toHaveBeenCalledWith({ value: 'Ada' })
    expect(placeholderRenderer).not.toHaveBeenCalled()
    expect(headerRenderer).toHaveBeenCalledWith({ value: 'Name' })
    expect(footerRenderer).toHaveBeenCalledWith({ value: 'Total' })
    expect(legacyContent).toHaveBeenCalledWith({ value: 'Legacy' })
  })

  test('reacts when a stable cell changes grouping mode', async () => {
    const cell = createCell(() => '', '')
    const header = {
      column: { columnDef: { header: '' } },
      getContext: () => ({}),
    }
    const footer = {
      column: { columnDef: { footer: '' } },
      getContext: () => ({}),
    }
    render(FlexRenderHarness, {
      normalCell: cell,
      aggregatedCell: cell,
      placeholderCell: cell,
      header,
      footer,
      legacyContent: () => '',
      componentCell: cell,
      reactiveCell: cell,
    })

    expect(outputText('Grouping cell')).toBe('cell:Grouped')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show aggregate cell' }),
    )
    expect(outputText('Grouping cell')).toBe('aggregate:Grouped')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show placeholder cell' }),
    )
    expect(outputText('Grouping cell')).toBe('')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show normal cell' }),
    )
    expect(outputText('Grouping cell')).toBe('cell:Grouped')
  })

  test('updates when a truthy cell prop is replaced', async () => {
    const cell = createCell(() => '', '')
    const header = {
      column: { columnDef: { header: '' } },
      getContext: () => ({}),
    }
    const footer = {
      column: { columnDef: { footer: '' } },
      getContext: () => ({}),
    }
    const reactiveCell = createCell((context) => `cell:${context.value}`, 'Ada')
    const { rerender } = render(FlexRenderHarness, {
      normalCell: cell,
      aggregatedCell: cell,
      placeholderCell: cell,
      header,
      footer,
      legacyContent: () => '',
      componentCell: cell,
      reactiveCell,
    })

    expect(outputText('Reactive cell')).toBe('cell:Ada')

    await rerender({
      reactiveCell: createCell((context) => `cell:${context.value}`, 'Grace'),
    })

    expect(outputText('Reactive cell')).toBe('cell:Grace')
  })
})

describe('createTableHook', () => {
  test('binds defaults, wrapper components, contexts, and render helpers', () => {
    const tableCaptor =
      vi.fn<(table: AppSvelteTable<any, any, any, any, any, any>) => void>()
    render(HookHarness, { tableCaptor })

    const table = tableCaptor.mock.lastCall?.[0]

    expect(hook.appFeatures).toBe(stockFeatures)
    expect(table?.getRowModel().rows[0]?.id).toBe('row-1')
    expect(table?.TableBadge).toEqual(expect.any(Function))
    expect(table?.AppTable).toEqual(expect.any(Function))
    expect(table?.AppCell).toEqual(expect.any(Function))
    expect(table?.AppHeader).toEqual(expect.any(Function))
    expect(table?.AppFooter).toEqual(expect.any(Function))
    expect(table?.FlexRender).toEqual(expect.any(Function))
    expect(outputText('Hook row can be selected')).toBe('true')
    expect(screen.getByText('table-component:row-1').textContent).toBe(
      'table-component:row-1',
    )
    expect(screen.getByText('cell-component:First').textContent).toBe(
      'cell-component:First',
    )
    expect(screen.getByText('header-component:title').textContent).toBe(
      'header-component:title',
    )
    expect(outputText('Hook cell')).toBe('cell:First')
    expect(outputText('Hook header')).toBe('header:title')
    expect(outputText('Hook footer')).toBe('footer:title')
  })

  test.each([
    ['useTableContext', () => hook.useTableContext()],
    ['useCellContext', () => hook.useCellContext()],
    ['useHeaderContext', () => hook.useHeaderContext()],
  ])('%s throws a focused error outside its provider', (name, readContext) => {
    expect(() => render(ContextFailure, { readContext })).toThrowError(
      new RegExp(`\\\`${name}\\\` must be used within`),
    )
  })
})
