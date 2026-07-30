// @vitest-environment jsdom

import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/svelte'
import { createAtom } from '@tanstack/svelte-store'
import CallbackHarness from './fixtures/CallbackHarness.svelte'
import PaginationHarness from './fixtures/PaginationHarness.svelte'
import ReactivityHarness from './fixtures/ReactivityHarness.svelte'
import RuneStateHarness from './fixtures/RuneStateHarness.svelte'
import type {
  OnChangeFn,
  RowSelectionState,
  TableState,
  stockFeatures,
} from '@tanstack/table-core'

function outputText(name: string) {
  return screen.getByRole('status', { name }).textContent
}

describe('Svelte adapter lifecycle and reactive options', () => {
  test('unmount stops later external atom reactions', async () => {
    const externalRowSelection = createAtom<RowSelectionState>({ 2: true })
    const selectionCaptor = vi.fn<(selection: RowSelectionState) => void>()
    const { unmount } = render(ReactivityHarness, {
      externalRowSelection,
      selectionCaptor,
    })

    await act()

    expect(outputText('Selected rows')).toBe('{"2":true}')
    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }]])

    await act(() => externalRowSelection.set({ 1: true }))

    expect(outputText('Selected rows')).toBe('{"1":true}')
    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }], [{ 1: true }]])

    unmount()

    await act(() => externalRowSelection.set({ 2: true }))

    expect(selectionCaptor.mock.calls).toEqual([[{ 2: true }], [{ 1: true }]])
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

  test('native rune projections only rerun for their tracked dependency', async () => {
    const selectedRowCaptor = vi.fn<(selected: boolean) => void>()
    const selectionCaptor = vi.fn<(selection: RowSelectionState) => void>()
    const stateCaptor =
      vi.fn<(state: TableState<typeof stockFeatures>) => void>()

    render(RuneStateHarness, {
      selectedRowCaptor,
      selectionCaptor,
      stateCaptor,
    })
    await act()

    expect(outputText('Selected first row')).toBe('false')
    expect(outputText('Whole row selection')).toBe('{}')
    expect(selectedRowCaptor.mock.calls).toEqual([[false]])
    expect(selectionCaptor.mock.calls).toEqual([[{}]])
    expect(stateCaptor).toHaveBeenCalledTimes(1)

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select first row' }),
    )

    expect(selectedRowCaptor.mock.calls).toEqual([[false], [true]])
    expect(selectionCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    expect(stateCaptor).toHaveBeenCalledTimes(2)

    await fireEvent.click(
      screen.getByRole('button', { name: 'Select second row too' }),
    )

    expect(outputText('Selected first row')).toBe('true')
    expect(outputText('Whole row selection')).toBe('{"1":true,"2":true}')
    expect(selectedRowCaptor).toHaveBeenCalledTimes(2)
    expect(selectionCaptor.mock.calls).toEqual([
      [{}],
      [{ 1: true }],
      [{ 1: true, 2: true }],
    ])
    expect(stateCaptor).toHaveBeenCalledTimes(3)

    await fireEvent.click(
      screen.getByRole('button', { name: 'Set unrelated page size' }),
    )

    expect(selectedRowCaptor).toHaveBeenCalledTimes(2)
    expect(selectionCaptor).toHaveBeenCalledTimes(3)
    expect(stateCaptor).toHaveBeenCalledTimes(4)
    expect(stateCaptor.mock.lastCall?.[0].pagination.pageSize).toBe(20)

    await fireEvent.click(
      screen.getByRole('button', { name: 'Publish same selection' }),
    )

    expect(selectedRowCaptor).toHaveBeenCalledTimes(2)
    expect(selectionCaptor).toHaveBeenCalledTimes(3)
    expect(stateCaptor).toHaveBeenCalledTimes(4)
  })
})
