---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [helpers/createTableHook.ts:66](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L66)

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

`THeaderComponents` *extends* `Record`\<`string`, `RenderableComponent`\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [helpers/createTableHook.ts:72](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L72)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [helpers/createTableHook.ts:73](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L73)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => unknown;
```

###### Returns

`unknown`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [helpers/createTableHook.ts:75](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L75)
