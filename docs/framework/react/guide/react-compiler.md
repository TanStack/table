---
title: React Compiler Guide
---

> [!IMPORTANT]
> **TanStack Table V9 is the first version of TanStack Table that is compatible with the React Compiler.**

The [React Compiler](https://react.dev/learn/react-compiler/introduction) automatically memoizes React components and values created during render. In Table V9, components that call `useTable` can be compiled normally. You also usually do not need `useMemo` or `useCallback` just to keep the values passed to `useTable` stable.

Most Table V9 code does not need any compiler-specific handling. The main exception is a nested component whose only props are stable Table objects, such as a core `table`, `row`, `cell`, `column`, or `header`. A method on one of these objects can return a new value even when the object itself has not changed. The compiler may then skip the nested component because its props have not changed. In that case, the component needs a `Subscribe` boundary for the state it reads.

## Is the React Compiler Worth It for Tables?

We maintain [a dedicated benchmark](https://github.com/KevinVandy/tanstack-table-benchmarks) that builds the same Table V9 example with the React Compiler enabled and disabled. It compares a table whose owner component subscribes to all table state with a table that uses `Subscribe` for smaller, targeted updates. Every interaction must also produce the expected DOM result before its timing is accepted.

The reference run used 10,000 source rows, 100 rendered rows, 4x CPU throttling, two warmups, and 20 alternating-order samples. The results are median interaction-to-layout-effect commit times in milliseconds:

| Update                  | Broad owner: off → on |              Fine-grained: off → on |
| ----------------------- | --------------------: | ----------------------------------: |
| Unrelated parent update |    3.75 → 0.50 (-87%) |                  3.50 → 0.50 (-86%) |
| Select one row          |    4.00 → 1.30 (-68%) | 0.90 → 0.95 (effectively unchanged) |
| Sort                    |    8.35 → 7.40 (-11%) |                   8.00 → 7.35 (-8%) |
| Paginate                |     8.30 → 8.35 (+1%) |                   8.00 → 8.35 (+4%) |
| Replace all data        |     8.10 → 8.55 (+6%) |                   8.30 → 8.50 (+2%) |

Our results do not show a reason to enable the React Compiler only for a data grid. Most table operations changed by a small amount, and `Subscribe` already kept fine-grained updates fast. The largest improvement came from preventing unrelated parent renders from cascading through the table. Choose whether to use the compiler based on the needs of the whole application. Table V9 supports it, although nested table components may need the explicit subscriptions described below.

## Can I Remove useMemo and useCallback?

If the React Compiler successfully compiles the component, you can usually remove memoization that exists only to keep arrays, objects, derived data, or callbacks stable for `useTable`. You also do not need `React.memo` only to prevent an unchanged child from rendering.

With the compiler, this component does not need to memoize `columns` or `visiblePeople` manually:

```tsx
function PeopleTable({ people, showInactive }) {
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
  ])

  const visiblePeople = showInactive
    ? people
    : people.filter((person) => person.status === 'active')

  const table = useTable({
    features,
    columns,
    data: visiblePeople,
  })

  // ...
}
```

Without the compiler, write those values with stable references:

```tsx
const columns = useMemo(
  () =>
    columnHelper.columns([
      // ...
    ]),
  [],
)

const visiblePeople = useMemo(
  () =>
    showInactive
      ? people
      : people.filter((person) => person.status === 'active'),
  [people, showInactive],
)
```

Stable `data` and `columns` references still matter. Table uses their identities to decide when to rebuild columns and row models. Without the compiler or manual memoization, creating new references on every render can cause unnecessary recalculation or automatic state resets.

Do not remove existing memoization without checking why it is there. Keep it when the code must also run without the compiler, another API requires a specific identity, the compiler skips the component, or profiling shows that the memoization helps.

### Why the Docs Still Use Manual Memoization

All TanStack Table React examples run through the React Compiler, but the examples and snippets still use conventional React patterns such as `useMemo`, `useCallback`, and module-scope constants. This keeps the same code correct and useful for applications that do not use the compiler. If your component is compiled, that manual memoization is not an additional Table V9 requirement.

### Dependency Arrays Still Matter

The React Compiler does not fix dependency arrays that you write yourself. Any `useEffect`, `useMemo`, or `useCallback` that remains must include all of its reactive dependencies. Follow the [`exhaustive-deps` lint](https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) to avoid stale closures.

## Passing Table Objects to Nested Components

Table V9 keeps the core table instance and its `column`, `row`, `cell`, and `header` objects stable. This is normally useful, but it means a compiled child can receive the same prop object before and after table state changes.

For example, imagine a table body renders a selection control like this:

```tsx
<SelectionCell row={row} />
```

The child reads the selection state from the `row` object:

```tsx
function SelectionCell({ row }: { row: Row<typeof features, Person> }) {
  return (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  )
}
```

Selecting the row does not replace the `row` object. Because the `row` prop is unchanged, the compiler may reuse the previous render of `SelectionCell`. If that happens, `row.getIsSelected()` is not called again and the checkbox becomes stale.

The same problem can occur whenever one of these method results changes without changing the object passed as a prop:

- `column.getIsPinned()` and `column.getIsSorted()`
- `row.getIsSelected()` and `row.getIsExpanded()`
- `cell.getIsAggregated()` and `cell.getValue()`
- `header.column.getCanSort()`

The value returned directly by `useTable` behaves differently from the core table object used by rows, cells, columns, and render contexts:

- The React-facing value returned by `useTable` changes when its options or the state selected by that Hook change.
- The core table at `row.table`, `cell.table`, or `column.table` keeps the same reference.

By default, `useTable` selects all registered table state. JSX rendered directly in that component will normally update without another subscription. A separate subscription is needed when a nested component receives only stable Table objects and reads changing state through their methods. It is also needed when the `useTable` selector leaves out state used by the rendered UI. Passing `() => null` as the selector intentionally leaves out all table state.

## Subscribe Inside the Component That Reads the State

Place `table.Subscribe` or the standalone `Subscribe` component inside the nested component that reads table state. For the selection example, subscribe to the selected row's value and render from that value:

```tsx
import { Subscribe } from '@tanstack/react-table'

function SelectionCell({ row }: { row: Row<typeof features, Person> }) {
  return (
    <Subscribe
      source={row.table.atoms.rowSelection}
      selector={(rowSelection) => rowSelection[row.id]}
    >
      {(isSelected) => (
        <input
          type="checkbox"
          checked={!!isSelected}
          onChange={row.getToggleSelectedHandler()}
        />
      )}
    </Subscribe>
  )
}
```

The subscription now tells React when this checkbox needs to update, even though the `row` prop remains the same.

Do not put `Subscribe` around `<SelectionCell row={row} />` and then ignore the selected value. The child would still receive the same `row` prop, so the compiler could still reuse it. Keep the subscription inside the child, or pass the selected value to the child as a prop and render from that prop.

The same applies to `useSelector`. Use the selected value in the component's output or pass it to a child. Calling `useSelector` only to force a render does not guarantee that the compiler will call a method on a stable Table object again.

### Choose the Narrowest Subscription That Stays Correct

Subscribe to the smallest piece of state that can change the rendered result. The selection example only needs `rowSelection[row.id]`, so changes to other rows do not need to update that checkbox.

If a component depends on several state slices, subscribe to `table.store` and return all of those slices from the selector. Keep the state-dependent Table calls inside the `Subscribe` render function:

```tsx
function TableBody({ table }) {
  return (
    <Subscribe
      source={table.store}
      selector={(state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        pagination: state.pagination,
      })}
    >
      {() => (
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              <td>{row.original.firstName}</td>
            </tr>
          ))}
        </tbody>
      )}
    </Subscribe>
  )
}
```

The selector must include every state slice that can change the result of `table.getRowModel()` for this table. That may include filtering, sorting, grouping, expansion, or pagination, depending on the features in use.

Use `table.Subscribe` when `table` is the React-facing value returned by `useTable`. In a cell or header render context, `table` is the core Table instead. Import the standalone `Subscribe` component and pass `table.store` or one of the values in `table.atoms` as its source.

Do not add a subscription to every cell by default. Add one when a nested component reads state that is not represented by its props, or when profiling shows that moving an update lower in the tree would help.

See the [Table State Guide](./table-state#optimizing-re-renders-with-selectors-and-tablesubscribe) for the complete state and selector model. The [Basic Subscribe](../examples/basic-subscribe) and [Kitchen Sink](../examples/kitchen-sink) examples show these patterns in complete tables.

## Why Table V8 Needed use no memo

Table V8's `useReactTable` returned the same table object while changing values stored inside it. This pattern is sometimes called **interior mutability**. A method such as `table.getRowModel()` could return new rows even though the `table` object itself had not changed.

The React Compiler could cache a method call or child component based on that stable table reference. When the values inside the table changed, React could then reuse an old result and leave the UI stale. React's [`incompatible-library` lint documentation](https://react.dev/reference/eslint-plugin-react-hooks/lints/incompatible-library) lists Table V8's `useReactTable` API as an example of this problem.

The workaround was to keep the component out of the compiler:

```tsx
function PeopleTable() {
  'use no memo'

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  // ...
}
```

Newer compiler tooling may recognize `useReactTable` and skip the component automatically. Either way, that component cannot benefit from compiler optimization.

Table V9 changed the React integration. `useTable` returns a React-facing value that updates with its selected state, and TanStack Store provides explicit subscriptions for nested components that read from the stable core table.
