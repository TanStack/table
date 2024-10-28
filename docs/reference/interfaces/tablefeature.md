---
id: TableFeature
title: TableFeature
---

# Interface: TableFeature

## Properties

### constructCellAPIs()?

```ts
optional constructCellAPIs: <TFeatures, TData, TValue>(cell) => void;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

#### Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Defined in

[types/TableFeatures.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L35)

***

### constructColumnAPIs()?

```ts
optional constructColumnAPIs: <TFeatures, TData, TValue>(column) => void;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

#### Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Defined in

[types/TableFeatures.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L42)

***

### constructHeaderAPIs()?

```ts
optional constructHeaderAPIs: <TFeatures, TData, TValue>(header) => void;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

#### Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Defined in

[types/TableFeatures.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L49)

***

### constructRowAPIs()?

```ts
optional constructRowAPIs: <TFeatures, TData>(row) => void;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

#### Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

#### Defined in

[types/TableFeatures.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L56)

***

### constructTableAPIs()?

```ts
optional constructTableAPIs: <TFeatures, TData>(table) => void;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

#### Defined in

[types/TableFeatures.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L59)

***

### getDefaultColumnDef()?

```ts
optional getDefaultColumnDef: <TFeatures, TData, TValue>() => ColumnDefBase_All<TFeatures, TData, TValue>;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

#### Returns

[`ColumnDefBase_All`](../type-aliases/columndefbase_all.md)\<`TFeatures`, `TData`, `TValue`\>

#### Defined in

[types/TableFeatures.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L62)

***

### getDefaultTableOptions()?

```ts
optional getDefaultTableOptions: <TFeatures, TData>(table) => Partial<TableOptions_All<TFeatures, TData>>;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Partial`\<[`TableOptions_All`](../type-aliases/tableoptions_all.md)\<`TFeatures`, `TData`\>\>

#### Defined in

[types/TableFeatures.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L67)

***

### getInitialState()?

```ts
optional getInitialState: <TFeatures>(initialState) => Partial<TableState<TFeatures>>;
```

#### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](tablefeature.md)\>\>

#### Parameters

• **initialState**: `Partial`\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\>

#### Returns

`Partial`\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\>

#### Defined in

[types/TableFeatures.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L73)
