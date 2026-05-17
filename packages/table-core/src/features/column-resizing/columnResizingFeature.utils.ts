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
 * Creates the default transient column resizing state.
 *
 * The feature default represents no active drag interaction. Reset APIs use
 * this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const resizeInfo = getDefaultColumnResizingState()
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
 * Checks whether this column can start a resize interaction.
 *
 * Both `columnDef.enableResizing` and table `enableColumnResizing` default to
 * `true`.
 *
 * @example
 * ```ts
 * const canResize = column_getCanResize(column)
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
 * Checks whether this column is the active column resize target.
 *
 * The value is read from `state.columnResizing.isResizingColumn`.
 *
 * @example
 * ```ts
 * const isResizing = column_getIsResizing(column)
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
 * Creates the pointer/touch start handler for resizing a header.
 *
 * The handler records starting sizes for all leaf headers, tracks drag deltas,
 * writes transient resize info, and commits column sizes on change or drag end
 * depending on `columnResizeMode`.
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
 * Routes a transient column resizing updater through the table's resize handler.
 *
 * This state tracks the active drag interaction; committed widths live in
 * `columnSizing`.
 *
 * @example
 * ```ts
 * table_setColumnResizing(table, (old) => ({ ...old, deltaOffset: 12 }))
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
 * Resets `columnResizing` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnResizing` when
 * it exists. Passing `true` ignores initial state and resets to the no-drag
 * default state.
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
 * Column resizing uses this to register pointer and touch listeners with
 * `passive: false` only when the environment understands passive options.
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
 * Narrows an unknown event to a `touchstart` event.
 *
 * Column resizing uses this before reading touch coordinates and installing
 * touch-specific listeners.
 *
 * @example
 * ```ts
 * const isTouch = isTouchStartEvent(event)
 * ```
 */
export function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === 'touchstart'
}
