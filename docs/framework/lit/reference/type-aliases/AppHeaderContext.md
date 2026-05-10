---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [createTableHook.ts:63](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L63)

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

Defined in: [createTableHook.ts:69](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L69)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [createTableHook.ts:70](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L70)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => TemplateResult | string | null;
```

###### Returns

`TemplateResult` \| `string` \| `null`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.ts:74](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L74)
