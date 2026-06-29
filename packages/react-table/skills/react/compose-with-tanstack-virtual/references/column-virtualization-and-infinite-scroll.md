# Column virtualization and infinite scroll — React + TanStack Virtual

Extended composition patterns extracted from `SKILL.md`. The primary row-virtualization pattern and the experimental ref-mutation variant remain inline in the SKILL; this file covers column virtualization and the `useInfiniteQuery` integration.

## Column virtualization

Same shape as row virtualization with `horizontal: true` and left/right placeholder cells so unrendered columns still take up scroll width:

```tsx
const columnVirtualizer = useVirtualizer({
  count: table.getVisibleLeafColumns().length,
  estimateSize: (i) => table.getVisibleLeafColumns()[i].getSize(),
  getScrollElement: () => tableContainerRef.current,
  horizontal: true,
  overscan: 3,
})

const virtualColumns = columnVirtualizer.getVirtualItems()
const virtualPaddingLeft  = virtualColumns[0]?.start ?? 0
const virtualPaddingRight =
  columnVirtualizer.getTotalSize() -
  (virtualColumns[virtualColumns.length - 1]?.end ?? 0)

// In each row:
<tr>
  {virtualPaddingLeft  > 0 ? <td style={{ width: virtualPaddingLeft  }} /> : null}
  {virtualColumns.map((vc) => {
    const cell = row.getVisibleCells()[vc.index]
    return <td key={cell.id}><table.FlexRender cell={cell} /></td>
  })}
  {virtualPaddingRight > 0 ? <td style={{ width: virtualPaddingRight }} /> : null}
</tr>
```

Source: `examples/react/virtualized-columns/src/main.tsx`.

## Infinite scroll — Virtual + `useInfiniteQuery`

```tsx
const dataQuery = useInfiniteQuery({
  queryKey: ['people', sorting],
  queryFn: ({ pageParam = 0 }) => fetchPage(pageParam, sorting),
  getNextPageParam: (lastPage, allPages) => allPages.length,
  placeholderData: keepPreviousData,
})

const flatRows = React.useMemo(
  () => dataQuery.data?.pages.flatMap((p) => p.rows) ?? [],
  [dataQuery.data],
)

const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    // no sortedRowModel — server sorts each page
  }),
  columns,
  data: flatRows,
  manualSorting: true,
  // ...
})

// Inside TableBody, scroll handler:
React.useEffect(() => {
  const el = tableContainerRef.current
  if (!el) return
  const onScroll = () => {
    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < 500 &&
      !dataQuery.isFetching
    ) {
      dataQuery.fetchNextPage()
    }
  }
  el.addEventListener('scroll', onScroll)
  return () => el.removeEventListener('scroll', onScroll)
}, [dataQuery])
```

Source: `examples/react/virtualized-infinite-scrolling/src/main.tsx`.

## Common Mistakes (column virt + infinite scroll)

### HIGH For column virtualization: missing padding placeholder cells

Wrong:

```tsx
<tr>
  {virtualColumns.map((vc) => (
    <td key={vc.index}>...</td>
  ))}
</tr>
// Unrendered columns aren't taking up scroll space → visible columns slide left.
```

Correct:

```tsx
<tr>
  {virtualPaddingLeft > 0 ? <td style={{ width: virtualPaddingLeft }} /> : null}
  {virtualColumns.map((vc) => (
    <td key={vc.index}>...</td>
  ))}
  {virtualPaddingRight > 0 ? (
    <td style={{ width: virtualPaddingRight }} />
  ) : null}
</tr>
```

Source: `examples/react/virtualized-columns/src/main.tsx`.

### HIGH Infinite scroll without `manualSorting`

Wrong:

```tsx
const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  data: flatRows,
})
// Each new page arrives → table re-sorts everything → row order scrambles between pages.
```

Correct:

```tsx
const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    // no sortedRowModel — server sorts each page
  }),
  data: flatRows,
  manualSorting: true,
})
```

With `useInfiniteQuery`, you must fire a fresh query on sort changes (key your `queryKey` on `sorting`) and set `manualSorting: true` so the table doesn't re-sort accumulated pages.
Source: `examples/react/virtualized-infinite-scrolling/src/main.tsx`.
