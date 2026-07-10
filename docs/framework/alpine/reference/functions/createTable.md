---
id: createTable
title: createTable
---

# Function: createTable()

```ts
function createTable<TFeatures, TData>(tableOptions, selector?): AlpineTable<TFeatures, TData>;
```

Defined in: [createTable.ts:46](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/createTable.ts#L46)

Creates an Alpine-reactive table instance.

Reactivity is bridged through a single version counter that every proxied
table read registers as a dependency, so by default ANY state change
re-evaluates every Alpine binding that touches the table. Pass a `selector`
to gate that: the counter then only bumps when the selected slice of state
changes (shallow compare). Use `() => ({})` to opt out of state-driven
re-evaluation entirely and handle high-frequency state (e.g. column
resizing) with explicit `table.atoms.<slice>.subscribe()` side effects.
Options changes (e.g. new `data`) always re-evaluate.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

### selector?

(`state`) => `unknown`

## Returns

[`AlpineTable`](../type-aliases/AlpineTable.md)\<`TFeatures`, `TData`\>

## Example

```ts
const table = createTable(options, (state) => ({ sorting: state.sorting }))
```
