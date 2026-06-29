# Column-layout subsystems — full API surface

Detailed reference for the five UI-state-only column features extracted from `SKILL.md`. The SKILL keeps a 2-line summary table linking here; this file documents each subsystem in detail.

## Visibility — `columnVisibilityFeature`

State: `columnVisibility: Record<columnId, boolean>` — missing or `true` means visible.

```tsx
// Visibility toggle panel
{
  table.getAllLeafColumns().map((column) => (
    <label key={column.id}>
      <input
        type="checkbox"
        checked={column.getIsVisible()}
        disabled={!column.getCanHide()}
        onChange={column.getToggleVisibilityHandler()}
      />
      {column.id}
    </label>
  ))
}

// Body — use Visible variants, NOT getAllLeafColumns / getAllCells
;<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))}
</tbody>
```

## Ordering — `columnOrderingFeature`

State: `columnOrder: string[]` of leaf column ids. Empty means definition order. **Scoped to UNPINNED columns** when pinning is active — pinned columns are sequenced inside `columnPinning.left/right`.

```ts
table.setColumnOrder(['firstName', 'lastName', 'age'])
column.getIndex('center') // ← position
column.getIsFirstColumn()
column.getIsLastColumn()
```

For drag-and-drop with `@dnd-kit/core`, see the "Common Mistakes" entry on dnd libraries in the SKILL — `DndContext` must wrap from OUTSIDE the `<table>`.

## Pinning — `columnPinningFeature`

State: `columnPinning: { left: string[]; right: string[] }`. Two render strategies:

```tsx
// Strategy A — split tables
<thead>
  {table.getLeftHeaderGroups().map(/* … */)}
</thead>
// + getCenterHeaderGroups / getRightHeaderGroups
// + row.getLeftVisibleCells / getCenterVisibleCells / getRightVisibleCells

// Strategy B — single table + sticky CSS
<th
  key={header.id}
  style={{
    position: header.column.getIsPinned() ? 'sticky' : undefined,
    left: header.column.getIsPinned() === 'left' ? `${header.column.getStart('left')}px` : undefined,
    right: header.column.getIsPinned() === 'right' ? `${header.column.getAfter('right')}px` : undefined,
  }}
>
  ...
</th>

// Toggle a pin programmatically
column.pin('left')  // or 'right' | false
```

## Sizing — `columnSizingFeature`

State: `columnSizing: Record<columnId, number>` (pixels). Defaults via `defaultColumnSizing` ({ size: 150, minSize: 20, maxSize: Number.MAX_SAFE_INTEGER }) or `tableOptions.defaultColumn` globally.

```ts
columnHelper.accessor('firstName', {
  size: 200,
  minSize: 80,
  maxSize: 400,
})

// Reads
column.getSize() // committed size (clamped)
header.getSize() // same, for groups sums children
table.getTotalSize()
table.getCenterTotalSize()
column.resetSize() // drop the override
```

## Resizing — `columnResizingFeature`

```tsx
// Wire BOTH onMouseDown AND onTouchStart on the resize handle
<div
  onDoubleClick={() => header.column.resetSize()}
  onMouseDown={header.getResizeHandler()}
  onTouchStart={header.getResizeHandler()}
  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
/>

// Modes:
// columnResizeMode: 'onEnd' (default) — commit on drag release; safer for big React tables
// columnResizeMode: 'onChange'        — commit live; needs the perf pattern in SKILL
// columnResizeDirection: 'ltr' (default) | 'rtl'
```

## Additional MEDIUM-priority failure modes

### Trying to reorder pinned columns via `columnOrder`

Wrong:

```ts
// Won't move 'actions' relative to 'firstName' while it's pinned right
const [columnPinning] = useState({
  left: ['select'],
  right: ['actions'],
})
table.setColumnOrder(['actions', 'select', 'firstName', 'lastName'])
```

Correct:

```ts
// Reorder the pinning state itself
table.setColumnPinning((old) => ({
  left: ['select'],
  right: ['summary', 'actions'], // 'summary' renders before 'actions'
}))

// columnOrder works normally for the unpinned center region
table.setColumnOrder(['firstName', 'lastName'])
```

After the pipeline's pinning split, the left/right partitions read directly from `state.columnPinning.left/right`. `columnOrder` only affects the center.

Source: docs/guide/column-ordering.md; packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts

### Using `react-dnd` / `react-beautiful-dnd` for column reorder in React 18+

Wrong:

```tsx
// react-dnd in React 18 Strict Mode — flicker and stale drags
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// or nesting DndContext inside <table>
;<table>
  <DndContext onDragEnd={handleDragEnd}>
    <thead>...</thead>
  </DndContext>
</table>
```

Correct:

```tsx
// @dnd-kit + wrap from OUTSIDE the table (DndContext renders divs)
<DndContext
  collisionDetection={closestCenter}
  modifiers={[restrictToHorizontalAxis]}
  onDragEnd={handleDragEnd}
  sensors={sensors}
>
  <table>
    <thead>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          <SortableContext
            items={table.store.state.columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {hg.headers.map((h) => (
              <DraggableHeader key={h.id} header={h} />
            ))}
          </SortableContext>
        </tr>
      ))}
    </thead>
  </table>
</DndContext>
```

`react-dnd` has Strict Mode incompatibilities; `react-beautiful-dnd` is in maintenance. dnd-kit is the v9-recommended stack.

Source: examples/react/column-dnd/src/main.tsx

### Wiring `header.getResizeHandler()` to only `onMouseDown`

Wrong:

```tsx
// Desktop only — mobile users can't resize
<div onMouseDown={header.getResizeHandler()} />
```

Correct:

```tsx
<div
  onDoubleClick={() => header.column.resetSize()}
  onMouseDown={header.getResizeHandler()}
  onTouchStart={header.getResizeHandler()}
  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
/>
```

`header_getResizeHandler` branches internally on `isTouchStartEvent`. The same handler must be installed on both DOM events.

Source: docs/guide/column-resizing.md; examples/react/column-resizing/src/main.tsx
