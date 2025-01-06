import {
  column_getSize,
  header_getSize,
  table_setColumnSizing,
} from '../column-sizing/columnSizingFeature.utils'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'
import type { ColumnSizingState } from '../column-sizing/columnSizingFeature.types'
import type { columnResizingState } from './columnResizingFeature.types'

export function getDefaultColumnResizingState(): columnResizingState {
  return structuredClone({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: [],
  })
}

export function column_getCanResize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableResizing ?? true) &&
    (column._table.options.enableColumnResizing ?? true)
  )
}

export function column_getIsResizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    column._table.options.state?.columnResizing?.isResizingColumn === column.id
  )
}

export function header_getResizeHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>, _contextDocument?: Document) {
  const column = table_getColumn(header.column._table, header.column.id)!
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

      table_setColumnResizing(column._table, (old) => {
        const deltaDirection =
          column._table.options.columnResizeDirection === 'rtl' ? -1 : 1
        const deltaOffset =
          (clientXPos - (old.startOffset ?? 0)) * deltaDirection
        const deltaPercentage = Math.max(
          deltaOffset / (old.startSize ?? 0),
          -0.999999,
        )

        old.columnSizingStart.forEach(([columnId, headerSize]) => {
          newColumnSizing[columnId] =
            Math.round(
              Math.max(headerSize + headerSize * deltaPercentage, 0) * 100,
            ) / 100
        })

        return {
          ...old,
          deltaOffset,
          deltaPercentage,
        }
      })

      if (
        column._table.options.columnResizeMode === 'onChange' ||
        eventType === 'end'
      ) {
        table_setColumnSizing(column._table, (old) => ({
          ...old,
          ...newColumnSizing,
        }))
      }
    }

    const onMove = (clientXPos?: number) => updateOffset('move', clientXPos)

    const onEnd = (clientXPos?: number) => {
      updateOffset('end', clientXPos)

      table_setColumnResizing(column._table, (old) => ({
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

    table_setColumnResizing(column._table, (old) => ({
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

export function table_setColumnResizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<columnResizingState>,
) {
  table.options.onColumnResizingChange?.(updater)
}

export function table_resetHeaderSizeInfo<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnResizing(
    table,
    defaultState
      ? getDefaultColumnResizingState()
      : (table.initialState.columnResizing ?? getDefaultColumnResizingState()),
  )
}

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

export function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === 'touchstart'
}
