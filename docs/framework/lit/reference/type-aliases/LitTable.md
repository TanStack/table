---
id: LitTable
title: LitTable
---

# Type Alias: LitTable\<TFeatures, TData, TSelected\>

```ts
type LitTable<TFeatures, TData, TSelected> = Omit<Table<TFeatures, TData>, "store"> & object;
```

Defined in: [packages/lit-table/src/TableController.ts:21](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L21)

The extended table type returned by the Lit adapter.
Includes a `Subscribe` method for fine-grained state subscriptions
and a `state` property with the selected state.

## Type Declaration

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender function attached to the table instance.
Renders cell, header, or footer content from column definitions.

#### Example

```ts
${table.FlexRender({ header })}
${table.FlexRender({ cell })}
${table.FlexRender({ footer: header })}
```

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of
the full table state because it is selected by the selector function that
you pass as the 2nd argument to `controller.table()`.

#### Example

```ts
const table = this.tableController.table(options, (state) => ({
  globalFilter: state.globalFilter,
}))

console.log(table.state.globalFilter)
```

### ~~store~~

```ts
readonly store: Table<TFeatures, TData>["store"];
```

#### Deprecated

Prefer `table.state` for render reads,
`table.atoms.<slice>.get()` for slice snapshots, or `table.subscribe` for
explicit subscriptions. `table.store.state` is a current-value snapshot and
is easy to misuse in render code.

### subscribe

```ts
subscribe: typeof subscribe;
```

Subscribes to the table's underlying state store within a Lit template.
Re-renders only the targeted template slice when the observed state changes.

#### Example

```ts
// 1. Subscribe to a specific state slice (re-renders ONLY when rowSelection changes)
html`
<div>
${table.subscribe(
table.store,
(state) => state.rowSelection,
(rowSelection) => html`<span>Selected: ${JSON.stringify(rowSelection)}</span>`
)}
</div>
`

// 2. Subscribe to the full state (re-renders on any state mutation)
html`
<div>
${table.subscribe(
table.store,
(state) => html`<span>Total rows: ${state.rowModel.rows.length}</span>`
)}
</div>
`
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
