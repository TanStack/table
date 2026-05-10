import {
  column_getSize,
  header_getSize,
  table_setColumnSizing,
} from '../column-sizing/columnSizingFeature.utils'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import { cloneState } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'
import type { ColumnSizingState } from '../column-sizing/columnSizingFeature.types'
import type { columnResizingState } from './columnResizingFeature.types'

/**
 * Returns the default column resizing state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnResizingState()
 * ```
 */
export function getDefaultColumnResizingState(): columnResizingState {
  return {
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: [],
  }
}

/**
 * Returns whether a column can use resize.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanResize(column)
 * ```
 */
export function column_getCanResize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableResizing ?? true) &&
    (column.table.options.enableColumnResizing ?? true)
  )
}

/**
 * Returns is resizing for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsResizing(column)
 * ```
 */
export function column_getIsResizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    column.table.atoms.columnResizing?.get()?.isResizingColumn === column.id
  )
}

/**
 * Returns resize handler for a header.
 *
 * This is the static implementation behind the matching header instance API and can account for nested header groups.
 *
 * @example
 * ```ts
 * const onMouseDown = header_getResizeHandler(header)
 * ```
 */
export function header_getResizeHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>, _contextDocument?: Document) {
  const column = table_getColumn(header.column.table, header.column.id)!
  const canResize = column_getCanResize(column)

  return (event: unknown) => {
    if (!canResize) {
      return
    }

    ;(event as any).persist?.()

    if (isTouchStartEvent(event)) {
      // lets not respond to multiple touches (e.g. 2 or 3 fingers)
      if (event.touches.length > 1) {
        return
      }
    }

    const startSize = header_getSize(header)

    const columnSizingStart: Array<[string, number]> = header
      .getLeafHeaders()
      .map((leafHeader) => [
        leafHeader.column.id,
        column_getSize(leafHeader.column),
      ])

    const clientX = isTouchStartEvent(event)
      ? Math.round(event.touches[0]!.clientX)
      : (event as MouseEvent).clientX

    const newColumnSizing: ColumnSizingState = {}

    const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
      if (typeof clientXPos !== 'number') {
        return
      }

      table_setColumnResizing(column.table, (old) => {
        const deltaDirection =
          column.table.options.columnResizeDirection === 'rtl' ? -1 : 1
        const deltaOffset =
          (clientXPos - (old.startOffset ?? 0)) * deltaDirection
        const startSize = old.startSize ?? 0
        const deltaPercentage = Math.max(
          startSize > 0 ? deltaOffset / startSize : 0,
          -0.999999,
        )

        old.columnSizingStart.forEach(([columnId, headerSize]) => {
          newColumnSizing[columnId] =
            Math.round(
              Math.max(
                headerSize > 0
                  ? headerSize + headerSize * deltaPercentage
                  : deltaOffset / old.columnSizingStart.length,
                0,
              ) * 100,
            ) / 100
        })

        return {
          ...old,
          deltaOffset,
          deltaPercentage,
        }
      })

      if (
        column.table.options.columnResizeMode === 'onChange' ||
        eventType === 'end'
      ) {
        table_setColumnSizing(column.table, (old) => ({
          ...old,
          ...newColumnSizing,
        }))
      }
    }

    const onMove = (clientXPos?: number) => updateOffset('move', clientXPos)

    const onEnd = (clientXPos?: number) => {
      updateOffset('end', clientXPos)

      table_setColumnResizing(column.table, (old) => ({
        ...old,
        isResizingColumn: false,
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        columnSizingStart: [],
      }))
    }

    const contextDocument =
      _contextDocument || typeof document !== 'undefined' ? document : null

    const mouseEvents = {
      moveHandler: (e: MouseEvent) => onMove(e.clientX),
      upHandler: (e: MouseEvent) => {
        contextDocument?.removeEventListener(
          'mousemove',
          mouseEvents.moveHandler,
        )
        contextDocument?.removeEventListener('mouseup', mouseEvents.upHandler)
        onEnd(e.clientX)
      },
    }

    const touchEvents = {
      moveHandler: (touchEvent: TouchEvent) => {
        if (touchEvent.cancelable) {
          touchEvent.preventDefault()
          touchEvent.stopPropagation()
        }
        onMove(touchEvent.touches[0]!.clientX)
        return false
      },
      upHandler: (e: TouchEvent) => {
        contextDocument?.removeEventListener(
          'touchmove',
          touchEvents.moveHandler,
        )
        contextDocument?.removeEventListener('touchend', touchEvents.upHandler)
        if (e.cancelable) {
          e.preventDefault()
          e.stopPropagation()
        }
        onEnd(e.touches[0]?.clientX)
      },
    }

    const passiveIfSupported = passiveEventSupported()
      ? { passive: false }
      : false

    if (isTouchStartEvent(event)) {
      contextDocument?.addEventListener(
        'touchmove',
        touchEvents.moveHandler,
        passiveIfSupported,
      )
      contextDocument?.addEventListener(
        'touchend',
        touchEvents.upHandler,
        passiveIfSupported,
      )
    } else {
      contextDocument?.addEventListener(
        'mousemove',
        mouseEvents.moveHandler,
        passiveIfSupported,
      )
      contextDocument?.addEventListener(
        'mouseup',
        mouseEvents.upHandler,
        passiveIfSupported,
      )
    }

    table_setColumnResizing(column.table, (old) => ({
      ...old,
      startOffset: clientX,
      startSize,
      deltaOffset: 0,
      deltaPercentage: 0,
      columnSizingStart,
      isResizingColumn: column.id,
    }))
  }
}

/**
 * Updates the table's column resizing state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnResizing(table, (old) => old)
 * ```
 */
export function table_setColumnResizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<columnResizingState>,
) {
  table.options.onColumnResizingChange?.(updater)
}

/**
 * Resets the table's header size info state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetHeaderSizeInfo(table)
 * table_resetHeaderSizeInfo(table, true)
 * ```
 */
export function table_resetHeaderSizeInfo<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnResizing(
    table,
    defaultState
      ? getDefaultColumnResizingState()
      : cloneState(
          table.initialState.columnResizing ?? getDefaultColumnResizingState(),
        ),
  )
}

/**
 * Detects whether the current environment supports passive event listeners.
 *
 * Column resizing uses this to register pointer and touch listeners with the safest available options.
 *
 * @example
 * ```ts
 * const canUsePassiveListeners = passiveEventSupported()
 * ```
 */
export function passiveEventSupported() {
  let passiveSupported: boolean | null = null

  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    const noop = () => {}

    window.addEventListener('test', noop, options)
    window.removeEventListener('test', noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}

/**
 * Returns whether an event is a touch-start event.
 *
 * Column resizing uses this to normalize mouse and touch resize interactions.
 *
 * @example
 * ```ts
 * const isTouch = isTouchStartEvent(event)
 * ```
 */
export function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === 'touchstart'
}
