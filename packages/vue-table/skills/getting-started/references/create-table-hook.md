# Reusable Vue table hooks

Use this reference when multiple Vue tables share features, defaults, or registered components. Keep one-off tables on `useTable`. For controlled state or subscription changes, read [table state](../../table-state/SKILL.md).

## Setup

```ts
import {
  createTableHook,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/vue-table'
import type { RowData, VueTable } from '@tanstack/vue-table'

const features = tableFeatures({ rowSortingFeature })
const hook = createTableHook({ features })
export const useAppTable = hook.useAppTable
export const createAppColumnHelper = hook.createAppColumnHelper
export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof features,
  TData
> = hook.useTableContext
```

The explicit exported context-hook types are important when registered components import the hook module that also imports those components.

## Core patterns

### Keep per-table values reactive

```ts
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
const table = useAppTable({ columns, data })
```

Pass refs/computed options through unchanged.

### Wrap registered component context

Render through `table.AppTable`, `table.AppCell`, or `table.AppHeader`; inside registered components call the corresponding typed context hook instead of prop drilling.

## Common mistakes

### HIGH Creating circular inferred exports

Wrong:

```ts
export const { useAppTable, useTableContext } = createTableHook({
  tableComponents: { Pager },
})
```

Correct:

```ts
const hook = createTableHook({ features, tableComponents: { Pager } })
export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof features,
  TData
> = hook.useTableContext
```

When `Pager` imports `useTableContext`, inferred destructured exports can form a circular inference/import chain.

Source: `docs/framework/vue/guide/composable-tables.md`

### HIGH Flattening reactive table options

Wrong:

```ts
useAppTable({ columns, data: data.value })
```

Correct:

```ts
useAppTable({ columns, data })
```

The app hook preserves the adapter’s `MaybeRef` option contract.

Source: `packages/vue-table/src/createTableHook.ts`

### HIGH Using context without App wrappers

Wrong:

```ts
const table = useTableContext()
```

Correct:

```vue
<component :is="table.AppTable"><Pager /></component>
```

The typed context exists only below the corresponding dynamic wrapper.

Source: `packages/vue-table/src/createTableHook.ts`

### MEDIUM Treating Subscribe children as slots

Wrong:

```tsx
<table.Subscribe>
  {(atoms) => <Pager page={atoms.pagination.get()} />}
</table.Subscribe>
```

Correct:

```tsx
<table.Subscribe
  children={(atoms) => <Pager page={atoms.pagination.get()} />}
/>
```

Vue’s adapter expects an explicit `children` prop in JSX.

Source: `packages/vue-table/src/useTable.ts`

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/createTableHook.d.ts` for the returned helpers, wrapper props, registry types, and context contracts.

## Sources

- `TanStack/table:docs/framework/vue/guide/composable-tables.md`
- `TanStack/table:examples/vue/composable-tables`
- `TanStack/table:packages/vue-table/src/createTableHook.ts`
