import { table_setColumnSizing } from '../column-sizing/ColumnSizing.utils'
import type { Column, Header, RowData, Table, Updater } from '../../types'
import type { ColumnSizingState } from '../column-sizing/ColumnSizing.types'
import type { ColumnResizingInfoState } from './ColumnResizing.types'

export function getDefaultColumnSizingInfoState(): ColumnResizingInfoState {
  return structuredClone({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: [],
  })
}

export function column_getCanResize<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
) {
  return (
    (column.columnDef.enableResizing ?? true) &&
    (table.options.enableColumnResizing ?? true)
  )
}

export function column_getIsResizing<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
) {
  return table.getState().columnSizingInfo.isResizingColumn === column.id
}

export function header_getResizeHandler<TData extends RowData, TValue>(
  header: Header<TData, TValue>,
  table: Table<TData>,
  _contextDocument?: Document,
) {
  const column = table.getColumn(header.column.id)!
  const canResize = column_getCanResize(table, column)

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

    const startSize = header.getSize()

    const columnSizingStart: Array<[string, number]> = header
      .getLeafHeaders()
      .map((d) => [d.column.id, d.column.getSize()])

    const clientX = isTouchStartEvent(event)
      ? Math.round(event.touches[0]!.clientX)
      : (event as MouseEvent).clientX

    const newColumnSizing: ColumnSizingState = {}

    const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
      if (typeof clientXPos !== 'number') {
        return
      }

      table_setColumnSizingInfo(table, (old) => {
        const deltaDirection =
          table.options.columnResizeDirection === 'rtl' ? -1 : 1
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
        table.options.columnResizeMode === 'onChange' ||
        eventType === 'end'
      ) {
        table_setColumnSizing(table, (old) => ({
          ...old,
          ...newColumnSizing,
        }))
      }
    }

    const onMove = (clientXPos?: number) => updateOffset('move', clientXPos)

    const onEnd = (clientXPos?: number) => {
      updateOffset('end', clientXPos)

      table_setColumnSizingInfo(table, (old) => ({
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

    table_setColumnSizingInfo(table, (old) => ({
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

export function table_setColumnSizingInfo<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnResizingInfoState>,
) {
  table.options.onColumnSizingInfoChange?.(updater)
}

export function table_resetHeaderSizeInfo<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table_setColumnSizingInfo(
    table,
    defaultState
      ? getDefaultColumnSizingInfoState()
      : table.initialState.columnSizingInfo,
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
