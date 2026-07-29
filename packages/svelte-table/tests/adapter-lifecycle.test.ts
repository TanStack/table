// @vitest-environment jsdom

import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/svelte'
import { createAtom } from '@tanstack/svelte-store'
import CallbackHarness from './fixtures/CallbackHarness.svelte'
import PaginationHarness from './fixtures/PaginationHarness.svelte'
import ReactivityHarness from './fixtures/ReactivityHarness.svelte'
import SelectorHarness from './fixtures/SelectorHarness.svelte'
import type { OnChangeFn, RowSelectionState } from '@tanstack/table-core'

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent
}

describe('Svelte adapter lifecycle and reactive options', () => {
  test('unmount unsubscribes external atoms and stops later reactions', async () => {
    const externalRowSelection = createAtom<RowSelectionState>({ 2: true })
    const subscribeSpy = vi.spyOn(externalRowSelection, 'subscribe')
    const selectionCaptor = vi.fn<(selection: RowSelectionState) => void>()
    const selectionStoreCaptor =
      vi.fn<(store: { readonly current: RowSelectionState }) => void>()
    const { unmount } = render(ReactivityHarness, {
      externalRowSelection,
      selectionCaptor,
      selectionStoreCaptor,
    })

    await act()

    expect(outputText('Selected rows')).toBe('{"2":true}')
    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }]])
    expect(subscribeSpy).toHaveBeenCalled()

    await act(() => externalRowSelection.set({ 1: true }))

    expect(outputText('Selected rows')).toBe('{"1":true}')
    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }], [{ 1: true }]])
    expect(selectionStoreCaptor).toHaveBeenCalledOnce()

    unmount()

    await act(() => externalRowSelection.set({ 2: true }))

    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }], [{ 1: true }]])
    expect(selectionStoreCaptor.mock.lastCall?.[0].current).toEqual({
      1: true,
    })
  })

  test('controlled state can release and reacquire ownership without losing the latest value', async () => {
    render(ReactivityHarness)

    expect(outputText('Selected rows')).toBe('{"1":true}')
    expect(outputText('Selected count')).toBe('1')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Release selection ownership' }),
    )
    expect(outputText('Selected rows')).toBe('{"1":true}')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select second row' }),
    )
    expect(outputText('Selected rows')).toBe('{"2":true}')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Control both rows' }),
    )
    expect(outputText('Selected rows')).toBe('{"1":true,"2":true}')
    expect(outputText('Selected count')).toBe('2')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Clear selection through table' }),
    )
    expect(outputText('Selected rows')).toBe('{"1":true,"2":true}')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Release selection ownership' }),
    )
    expect(outputText('Selected rows')).toBe('{}')
    expect(outputText('Selected count')).toBe('0')
  })

  test('external atoms take precedence over controlled state and receive table updates', async () => {
    const externalRowSelection = createAtom<RowSelectionState>({ 2: true })
    render(ReactivityHarness, { externalRowSelection })

    expect(outputText('Selected rows')).toBe('{"2":true}')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Control both rows' }),
    )
    expect(outputText('Selected rows')).toBe('{"2":true}')

    await act(() => externalRowSelection.set({ 1: true }))
    expect(outputText('Selected rows')).toBe('{"1":true}')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select second row' }),
    )
    expect(externalRowSelection.get()).toEqual({ 2: true })
    expect(outputText('Selected rows')).toBe('{"2":true}')
  })

  test('rapid updates publish only the final data, columns, and option values', async () => {
    const snapshotCaptor = vi.fn()
    render(ReactivityHarness, { snapshotCaptor })

    await act()

    expect(snapshotCaptor.mock.calls).toEqual([
      [
        {
          canSelect: true,
          columnIds: ['id'],
          rowIds: ['1', '2'],
          values: ['1'],
        },
      ],
    ])

    await fireEvent.click(
      screen.getByRole('button', { name: 'Publish rapid option updates' }),
    )

    expect(outputText('Row ids')).toBe('4')
    expect(outputText('Column ids')).toBe('title')
    expect(outputText('First row values')).toBe('Final')
    expect(outputText('First row can be selected')).toBe('false')
    expect(snapshotCaptor.mock.calls).toEqual([
      [
        {
          canSelect: true,
          columnIds: ['id'],
          rowIds: ['1', '2'],
          values: ['1'],
        },
      ],
      [
        {
          canSelect: false,
          columnIds: ['title'],
          rowIds: ['4'],
          values: ['Final'],
        },
      ],
    ])
  })

  test('table APIs use the latest rune-backed option callback', async () => {
    const firstHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const secondHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    render(CallbackHarness, { firstHandler, secondHandler })

    await fireEvent.click(
      screen.getByRole('button', { name: 'Toggle all rows selected' }),
    )
    expect(firstHandler).toHaveBeenCalledOnce()
    expect(secondHandler).not.toHaveBeenCalled()

    await fireEvent.click(
      screen.getByRole('button', { name: 'Use second selection handler' }),
    )
    await fireEvent.click(
      screen.getByRole('button', { name: 'Toggle all rows selected' }),
    )

    expect(firstHandler).toHaveBeenCalledOnce()
    expect(secondHandler).toHaveBeenCalledOnce()
  })

  test('row models react to createTableState-controlled pagination', async () => {
    render(PaginationHarness)

    expect(outputText('Paginated row ids')).toBe('0,1,2,3,4')

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show three rows' }),
    )

    expect(outputText('Paginated row ids')).toBe('0,1,2')
  })

  test('selector subscriptions only rerun for their selected dependency', async () => {
    const selectedRowCaptor = vi.fn<(selected: boolean) => void>()
    const wholeSelectionCaptor = vi.fn<(selection: RowSelectionState) => void>()

    render(SelectorHarness, { selectedRowCaptor, wholeSelectionCaptor })
    await act()

    expect(outputText('Selected first row')).toBe('false')
    expect(outputText('Whole row selection')).toBe('{}')
    expect(selectedRowCaptor.mock.calls).toEqual([[false]])
    expect(wholeSelectionCaptor.mock.calls).toEqual([[{}]])

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select first row' }),
    )

    expect(selectedRowCaptor.mock.calls).toEqual([[false], [true]])
    expect(wholeSelectionCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select second row too' }),
    )

    expect(outputText('Selected first row')).toBe('true')
    expect(outputText('Whole row selection')).toBe('{"1":true,"2":true}')
    expect(selectedRowCaptor).toHaveBeenCalledTimes(2)
    expect(wholeSelectionCaptor.mock.calls).toEqual([
      [{}],
      [{ 1: true }],
      [{ 1: true, 2: true }],
    ])

    await fireEvent.click(
      screen.getByRole('button', { name: 'Set unrelated page size' }),
    )
    await fireEvent.click(
      screen.getByRole('button', { name: 'Select second row too' }),
    )

    expect(selectedRowCaptor).toHaveBeenCalledTimes(2)
    expect(wholeSelectionCaptor).toHaveBeenCalledTimes(3)
  })
})
