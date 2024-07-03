import { Column, Header, RowData, Table, Updater } from '../../types'
import { ColumnSizingState } from '../column-sizing/ColumnSizing.types'
import { ColumnResizingInfoState } from './ColumnResizing.types'

export function column_getCanResize<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>
) {
  return (
    (column.columnDef.enableResizing ?? true) &&
    (table.options.enableColumnResizing ?? true)
  )
}

export function column_getIsResizing<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>
) {
  return table.getState().columnSizingInfo.isResizingColumn === column.id
}

export function header_getResizeHandler<TData extends RowData, TValue>(
  header: Header<TData, TValue>,
  table: Table<TData>,
  _contextDocument?: Document
) {
  const column = table.getColumn(header.column.id)
  const canResize = column?.getCanResize()

  return (e: unknown) => {
    if (!column || !canResize) {
      return
    }

    ;(e as any).persist?.()

    if (isTouchStartEvent(e)) {
      // lets not respond to multiple touches (e.g. 2 or 3 fingers)
      if (e.touches && e.touches.length > 1) {
        return
      }
    }

    const startSize = header.getSize()

    const columnSizingStart: [string, number][] = header
      ? header.getLeafHeaders().map(d => [d.column.id, d.column.getSize()])
      : [[column.id, column.getSize()]]

    const clientX = isTouchStartEvent(e)
      ? Math.round(e.touches[0]!.clientX)
      : (e as MouseEvent).clientX

    const newColumnSizing: ColumnSizingState = {}

    const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
      if (typeof clientXPos !== 'number') {
        return
      }

      table.setColumnSizingInfo(old => {
        const deltaDirection =
          table.options.columnResizeDirection === 'rtl' ? -1 : 1
        const deltaOffset =
          (clientXPos - (old?.startOffset ?? 0)) * deltaDirection
        const deltaPercentage = Math.max(
          deltaOffset / (old?.startSize ?? 0),
          -0.999999
        )

        old.columnSizingStart.forEach(([columnId, headerSize]) => {
          newColumnSizing[columnId] =
            Math.round(
              Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
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
        table.setColumnSizing(old => ({
          ...old,
          ...newColumnSizing,
        }))
      }
    }

    const onMove = (clientXPos?: number) => updateOffset('move', clientXPos)

    const onEnd = (clientXPos?: number) => {
      updateOffset('end', clientXPos)

      table.setColumnSizingInfo(old => ({
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
          mouseEvents.moveHandler
        )
        contextDocument?.removeEventListener('mouseup', mouseEvents.upHandler)
        onEnd(e.clientX)
      },
    }

    const touchEvents = {
      moveHandler: (e: TouchEvent) => {
        if (e.cancelable) {
          e.preventDefault()
          e.stopPropagation()
        }
        onMove(e.touches[0]!.clientX)
        return false
      },
      upHandler: (e: TouchEvent) => {
        contextDocument?.removeEventListener(
          'touchmove',
          touchEvents.moveHandler
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

    if (isTouchStartEvent(e)) {
      contextDocument?.addEventListener(
        'touchmove',
        touchEvents.moveHandler,
        passiveIfSupported
      )
      contextDocument?.addEventListener(
        'touchend',
        touchEvents.upHandler,
        passiveIfSupported
      )
    } else {
      contextDocument?.addEventListener(
        'mousemove',
        mouseEvents.moveHandler,
        passiveIfSupported
      )
      contextDocument?.addEventListener(
        'mouseup',
        mouseEvents.upHandler,
        passiveIfSupported
      )
    }

    table.setColumnSizingInfo(old => ({
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
  updater: Updater<ColumnResizingInfoState>
) {
  table.options.onColumnSizingInfoChange?.(updater)
}

export function table_resetHeaderSizeInfo<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean
) {
  table.setColumnSizingInfo(
    defaultState
      ? getDefaultColumnSizingInfoState()
      : table.initialState.columnSizingInfo ?? getDefaultColumnSizingInfoState()
  )
}

export const getDefaultColumnSizingInfoState = (): ColumnResizingInfoState => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
})

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
