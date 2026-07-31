import { describe, expect, test, vi } from 'vitest'
import { computed, effectScope, isRef, nextTick, ref, watchEffect } from 'vue'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { useTable } from '../../src/useTable'
import type {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
} from '@tanstack/table-core'

describe('Vue adapter lifecycle and reactive options', () => {
  type Data = { id: string; title: string }

  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    { id: 'id', accessorKey: 'id' },
    { id: 'title', accessorKey: 'title' },
  ]

  test('scope disposal cleans up external atoms and stops later reactions', async () => {
    const data = ref<ReadonlyArray<Data>>([{ id: '1', title: 'First' }])
    const externalRowSelection = createAtom<RowSelectionState>({})
    const subscribeSpy = vi.spyOn(externalRowSelection, 'subscribe')

    const rowIdsCaptor = vi.fn<(ids: Array<string>) => void>()
    const selectionCaptor = vi.fn<(state: RowSelectionState) => void>()
    const scope = effectScope()
    const table = scope.run(() => {
      const table = useTable<typeof stockFeatures, Data>({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        atoms: {
          rowSelection: externalRowSelection,
        },
      })

      watchEffect(
        () => rowIdsCaptor(table.getRowModel().rows.map((row) => row.id)),
        { flush: 'sync' },
      )
      watchEffect(() => selectionCaptor(table.atoms.rowSelection.get()), {
        flush: 'sync',
      })

      return table
    })!

    data.value = [
      { id: '1', title: 'First' },
      { id: '2', title: 'Second' },
    ]
    externalRowSelection.set({ 1: true })
    await nextTick()

    expect(rowIdsCaptor.mock.calls).toEqual([[['1']], [['1', '2']]])
    expect(selectionCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    expect(subscribeSpy).toHaveBeenCalledTimes(1)

    const subscription = subscribeSpy.mock.results[0]!.value
    const unsubscribeSpy = vi.spyOn(subscription, 'unsubscribe')

    scope.stop()

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)

    data.value = [{ id: '3', title: 'Third' }]
    externalRowSelection.set({ 2: true })
    await nextTick()

    expect(rowIdsCaptor.mock.calls).toEqual([[['1']], [['1', '2']]])
    expect(selectionCaptor.mock.calls).toEqual([[{}], [{ 1: true }]])
    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1', '2'])
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    table.toggleAllRowsSelected(true)

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true, 2: true })
    expect(externalRowSelection.get()).toEqual({ 2: true })
  })

  test('controlled state can release and regain ownership of a slice', async () => {
    const state = ref<{ rowSelection?: RowSelectionState }>({
      rowSelection: { 1: true },
    })
    const scope = effectScope()
    const table = scope.run(() =>
      useTable<typeof stockFeatures, Data>({
        data: [{ id: '1', title: 'First' }],
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        state,
      }),
    )!

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    table.toggleAllRowsSelected(false)
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    state.value = {}
    await nextTick()
    expect(table.atoms.rowSelection.get()).toEqual({})

    table.toggleAllRowsSelected(true)
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    state.value = { rowSelection: {} }
    await nextTick()
    expect(table.atoms.rowSelection.get()).toEqual({})

    scope.stop()
  })

  test('external atoms take precedence over controlled state and receive table updates', async () => {
    const state = ref<{ rowSelection: RowSelectionState }>({
      rowSelection: { 2: true },
    })
    const externalRowSelection = createAtom<RowSelectionState>({ 1: true })
    const isSelectedCaptor = vi.fn<(selected: boolean) => void>()
    const scope = effectScope()
    const table = scope.run(() => {
      const table = useTable<typeof stockFeatures, Data>({
        data: [
          { id: '1', title: 'First' },
          { id: '2', title: 'Second' },
        ],
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        state,
        atoms: {
          rowSelection: externalRowSelection,
        },
      })

      const isSelected = computed(() => table.getRow('1').getIsSelected())
      watchEffect(() => isSelectedCaptor(isSelected.value), {
        flush: 'sync',
      })

      return table
    })!

    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    state.value = { rowSelection: { 1: true, 2: true } }
    await nextTick()
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true })

    externalRowSelection.set({ 2: true })
    expect(table.atoms.rowSelection.get()).toEqual({ 2: true })

    table.toggleAllRowsSelected(true)
    expect(externalRowSelection.get()).toEqual({ 1: true, 2: true })
    expect(table.atoms.rowSelection.get()).toEqual({ 1: true, 2: true })
    expect(isSelectedCaptor.mock.calls).toEqual([[true], [false], [true]])

    scope.stop()
  })

  test('rapid ref updates publish only the final option snapshot', async () => {
    const data = ref<ReadonlyArray<Data>>([{ id: '1', title: 'First' }])
    const rowIdsCaptor = vi.fn<(ids: Array<string>) => void>()
    const scope = effectScope()

    scope.run(() => {
      const table = useTable<typeof stockFeatures, Data>({
        data,
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })

      watchEffect(
        () => {
          rowIdsCaptor(table.getRowModel().rows.map((row) => row.id))
        },
        { flush: 'sync' },
      )
    })

    data.value = [{ id: '1', title: 'One' }]
    data.value = [
      { id: '1', title: 'One' },
      { id: '2', title: 'Two' },
    ]
    data.value = [
      { id: '1', title: 'One' },
      { id: '2', title: 'Two' },
      { id: '3', title: 'Three' },
    ]
    await nextTick()

    expect(rowIdsCaptor.mock.calls).toEqual([[['1']], [['1', '2', '3']]])

    scope.stop()
  })

  test('dynamic columns and option callbacks use their latest refs', async () => {
    const reactiveColumns = ref<Array<ColumnDef<typeof stockFeatures, Data>>>([
      { id: 'id', accessorKey: 'id' },
    ])
    const firstSelectionHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const secondSelectionHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const onRowSelectionChange = ref<OnChangeFn<RowSelectionState>>(
      firstSelectionHandler,
    )
    const scope = effectScope()
    const table = scope.run(() =>
      useTable<typeof stockFeatures, Data>({
        data: [{ id: '1', title: 'First' }],
        columns: reactiveColumns,
        features: stockFeatures,
        getRowId: (row) => row.id,
        onRowSelectionChange,
      }),
    )!

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual(['id'])

    table.toggleAllRowsSelected(true)
    expect(firstSelectionHandler).toHaveBeenCalledTimes(1)
    expect(secondSelectionHandler).not.toHaveBeenCalled()

    reactiveColumns.value = [{ id: 'title', accessorKey: 'title' }]
    onRowSelectionChange.value = secondSelectionHandler
    await nextTick()

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      'title',
    ])
    expect(table.getRowModel().rows[0]!.getValue('title')).toBe('First')

    table.toggleAllRowsSelected(true)
    expect(firstSelectionHandler).toHaveBeenCalledTimes(1)
    expect(secondSelectionHandler).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  test('an existing ref-backed option can be cleared without leaking the Ref', async () => {
    const firstHandler = vi.fn<OnChangeFn<RowSelectionState>>()
    const onRowSelectionChange = ref<OnChangeFn<RowSelectionState> | undefined>(
      firstHandler,
    )
    const customOption = ref('first')
    const customSymbol = Symbol('custom-option')
    const prototype = { inheritedOption: 'from-prototype' }
    const options = Object.create(
      prototype,
      Object.getOwnPropertyDescriptors({
        data: [{ id: '1', title: 'First' }],
        columns,
        features: stockFeatures,
        getRowId: (row: Data) => row.id,
        onRowSelectionChange,
        value: 'custom-value',
        [customSymbol]: 'symbol-value',
        get customOption() {
          return customOption.value
        },
      }),
    )
    const scope = effectScope()
    const table = scope.run(() =>
      useTable<typeof stockFeatures, Data>(options),
    )!

    expect(table.options.onRowSelectionChange).toBe(firstHandler)
    expect(isRef(table.options.onRowSelectionChange)).toBe(false)
    expect((table.options as any).value).toBe('custom-value')
    expect((table.options as any)[customSymbol]).toBe('symbol-value')
    expect((table.options as any).customOption).toBe('first')
    expect(
      Object.getOwnPropertyDescriptor(table.options, 'customOption'),
    ).toMatchObject({
      value: 'first',
      writable: false,
    })

    onRowSelectionChange.value = undefined
    customOption.value = 'second'
    await nextTick()

    expect(table.options.onRowSelectionChange).toBeUndefined()
    expect(table.optionAtoms.onRowSelectionChange!.get()).toBeUndefined()
    expect(isRef(table.options.onRowSelectionChange)).toBe(false)
    expect((table.options as any).customOption).toBe('second')

    table.toggleAllRowsSelected(true)
    expect(firstHandler).not.toHaveBeenCalled()

    scope.stop()
  })
})
