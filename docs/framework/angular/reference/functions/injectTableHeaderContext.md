---
id: injectTableHeaderContext
title: injectTableHeaderContext
---

# Function: injectTableHeaderContext()

```ts
function injectTableHeaderContext<TFeatures, TData, TValue>(): Signal<Header<TFeatures, TData, TValue>>;
```

Defined in: [helpers/header.ts:93](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/header.ts#L93)

Injects the current TanStack Table header signal.

Available when:
- there is a nearest `[tanStackTableHeader]` directive in the DI tree, or
- the caller is rendered via `*flexRender` with render props containing `header`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `unknown`

## Returns

`Signal`\<`Header`\<`TFeatures`, `TData`, `TValue`\>\>
