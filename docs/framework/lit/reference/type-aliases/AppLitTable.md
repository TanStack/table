---
id: AppLitTable
title: AppLitTable
---

# Type Alias: AppLitTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppLitTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = LitTable<TFeatures, TData, TSelected> & NoInfer<TTableComponents> & object;
```

Defined in: [createTableHook.ts:282](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L282)

Extended table API returned by useAppTable with all App wrapper functions

## Type Declaration

### AppCell()

```ts
AppCell: <TValue>(cell, renderFn) => TemplateResult | string;
```

Wraps a cell and provides cell context with pre-bound cellComponents.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### cell

`Cell`\<`TFeatures`, `TData`, `TValue`\>

##### renderFn

(`cell`) => `TemplateResult` \| `string`

#### Returns

`TemplateResult` \| `string`

#### Example

```ts
${table.AppCell(cell, (c) => html`<td>${c.FlexRender()}</td>`)}
```

### AppFooter()

```ts
AppFooter: <TValue>(header, renderFn) => TemplateResult | string;
```

Wraps a footer and provides header context with pre-bound headerComponents.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### header

`Header`\<`TFeatures`, `TData`, `TValue`\>

##### renderFn

(`header`) => `TemplateResult` \| `string`

#### Returns

`TemplateResult` \| `string`

#### Example

```ts
${table.AppFooter(footer, (f) => html`<td>${f.FlexRender()}</td>`)}
```

### AppHeader()

```ts
AppHeader: <TValue>(header, renderFn) => TemplateResult | string;
```

Wraps a header and provides header context with pre-bound headerComponents.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### header

`Header`\<`TFeatures`, `TData`, `TValue`\>

##### renderFn

(`header`) => `TemplateResult` \| `string`

#### Returns

`TemplateResult` \| `string`

#### Example

```ts
${table.AppHeader(header, (h) => html`<th>${h.FlexRender()}</th>`)}
```

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

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
