---
id: TanStackTableHeaderContext
title: TanStackTableHeaderContext
---

# Interface: TanStackTableHeaderContext\<TFeatures, TData, TValue\>

Defined in: [helpers/header.ts:11](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/header.ts#L11)

DI context shape for a TanStack Table header.

This exists to make the current `Header` injectable by any nested component/directive
without passing it through inputs/props.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

## Properties

### header

```ts
header: Signal<Header<TFeatures, TData, TValue>>;
```

Defined in: [helpers/header.ts:17](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/header.ts#L17)

Signal that returns the current header instance.
