---
id: AlpineTable
title: AlpineTable
---

# Type Alias: AlpineTable\<TFeatures, TData\>

```ts
type AlpineTable<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [createTable.ts:14](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/createTable.ts#L14)

## Type Declaration

### flexRender

```ts
flexRender: typeof flexRender;
```

A lower-level helper to render the content of a cell, header, or footer from a render function and its context.

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

A convenience helper to render a cell, header, or footer object. Call from `x-html`, e.g. `FlexRender({ header })`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
