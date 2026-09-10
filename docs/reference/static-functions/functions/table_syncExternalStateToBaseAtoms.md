---
id: table_syncExternalStateToBaseAtoms
title: table_syncExternalStateToBaseAtoms
---

# Function: table\_syncExternalStateToBaseAtoms()

```ts
function table_syncExternalStateToBaseAtoms<TFeatures, TData>(
   table,
   capturedState?,
   compare?): void;
```

Defined in: [core/table/coreTablesFeature.utils.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L28)

Synchronizes externally controlled state slices into the table's base atoms.

This keeps `options.state` values mirrored in the atom graph so derived
atoms, stores, and table APIs read a consistent snapshot.

Adapters that update options during their host's render phase pass the
state snapshot captured by the committed render as `capturedState` — the
shared options object may already hold values from a newer render that
never commits. Pass `null` to publish nothing (a captured "no controlled
state"); omitting the argument reads the current `table.options.state`
instead. An optional `compare` suppresses semantically unchanged slice
writes; the default remains reference equality.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### capturedState?

`Partial`\<[`TableState`](../../index/type-aliases/TableState.md)\<`TFeatures`\>\> | `null`

### compare?

(`currentState`, `externalState`) => `boolean`

## Returns

`void`

## Example

```ts
table_syncExternalStateToBaseAtoms(table)
table_syncExternalStateToBaseAtoms(table, capturedState ?? null, shallow)
```
