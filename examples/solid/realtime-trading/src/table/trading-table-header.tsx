import { FlexRender } from '@tanstack/solid-table'
import { For, Show } from 'solid-js'
import { createColumnDrag } from './create-column-drag'
import { sortAriaValue, sortIndicator } from './table-interactions'
import type { JSX } from 'solid-js'
import type { ColumnDrag } from './create-column-drag'
import type {
  TradingHeader,
  TradingTableInstance,
} from './trading-table-features'

export interface TradingTableHeaderProps {
  table: TradingTableInstance
}

export function TradingTableHeader(props: TradingTableHeaderProps) {
  const columnDrag = createColumnDrag(props.table)

  return (
    <thead>
      <For each={props.table.getHeaderGroups()}>
        {(headerGroup) => (
          <tr>
            <For each={headerGroup.headers}>
              {(header) => (
                <TradingHeaderCell header={header} columnDrag={columnDrag} />
              )}
            </For>
          </tr>
        )}
      </For>
    </thead>
  )
}

interface TradingHeaderCellProps {
  header: TradingHeader
  columnDrag: ColumnDrag
}

function TradingHeaderCell(props: TradingHeaderCellProps) {
  const isLeaf = () => props.header.subHeaders.length === 0
  const headerCellProps = createHeaderCellProps(
    () => props.header,
    isLeaf,
    props.columnDrag,
  )

  return (
    <th {...headerCellProps}>
      <Show when={!props.header.isPlaceholder}>
        <Show when={isLeaf()} fallback={<FlexRender header={props.header} />}>
          <TradingLeafHeader
            header={props.header}
            columnDrag={props.columnDrag}
          />
        </Show>
      </Show>
    </th>
  )
}

function TradingLeafHeader(props: TradingHeaderCellProps) {
  const dropZoneProps = props.columnDrag.createDropZoneProps(
    props.header.column.id,
  )
  const dragHandleProps = props.columnDrag.createHandleProps(
    props.header.column.id,
  )
  const sortButtonProps = createSortButtonProps(() => props.header)
  const resizeHandleProps = createResizeHandleProps(() => props.header)

  return (
    <>
      <div class="leaf-header-content" {...dropZoneProps}>
        <button type="button" class="column-drag-handle" {...dragHandleProps}>
          ⋮⋮
        </button>
        <button {...sortButtonProps}>
          <span class="header-label">
            <FlexRender header={props.header} />
          </span>
          <Show when={props.header.column.getCanSort()}>
            <span
              class="sort-indicator"
              classList={{
                'is-active': !!props.header.column.getIsSorted(),
              }}
              aria-hidden="true"
            >
              {sortIndicator(props.header.column.getIsSorted())}
            </span>
          </Show>
        </button>
      </div>
      <Show when={props.header.column.getCanResize()}>
        <div {...resizeHandleProps} />
      </Show>
    </>
  )
}

function createHeaderCellProps(
  header: () => TradingHeader,
  isLeaf: () => boolean,
  columnDrag: ColumnDrag,
): JSX.IntrinsicElements['th'] {
  return {
    get colSpan() {
      return header().colSpan
    },
    get style() {
      return {
        width: `calc(var(--header-${header().id}-size) * 1px)`,
      }
    },
    get ['aria-sort']() {
      return isLeaf() ? sortAriaValue(header().column.getIsSorted()) : undefined
    },
    get classList() {
      const columnId = header().column.id
      return {
        'column-group-header': !isLeaf(),
        'numeric-header': isLeaf() && !isTextColumn(columnId),
        'is-column-dragging': columnDrag.isDragging(columnId),
        'is-column-drop-target': columnDrag.isDropTarget(columnId),
      }
    },
  }
}

function createSortButtonProps(
  header: () => TradingHeader,
): JSX.IntrinsicElements['button'] {
  return {
    type: 'button',
    class: 'sort-header-button',
    get classList() {
      return { 'is-sortable': header().column.getCanSort() }
    },
    get disabled() {
      return !header().column.getCanSort()
    },
    onClick: header().column.getToggleSortingHandler(),
  }
}

function createResizeHandleProps(
  header: () => TradingHeader,
): JSX.IntrinsicElements['div'] {
  return {
    class: 'column-resize-handle',
    get classList() {
      return { 'is-resizing': header().column.getIsResizing() }
    },
    role: 'separator',
    'aria-orientation': 'vertical',
    onDblClick: () => header().column.resetSize(),
    onMouseDown: header().getResizeHandler(),
    onTouchStart: header().getResizeHandler(),
  }
}

function isTextColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}
