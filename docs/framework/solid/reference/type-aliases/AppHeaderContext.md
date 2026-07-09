---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [createTableHook.tsx:59](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L59)

Enhanced HeaderContext with pre-bound header components.
The `header` property includes the registered headerComponents.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:65](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L65)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [createTableHook.tsx:66](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L66)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => JSXElement;
```

###### Returns

`JSXElement`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:68](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L68)
