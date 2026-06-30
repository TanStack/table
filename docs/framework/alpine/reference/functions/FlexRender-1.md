---
id: FlexRender
title: FlexRender
---

# Function: FlexRender()

```ts
function FlexRender<TFeatures, TData, TValue>(props): any;
```

Defined in: [flexRender.ts:76](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/flexRender.ts#L76)

Simplified wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
Only one prop (`cell`, `header`, or `footer`) may be passed.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### props

[`FlexRenderProps`](../type-aliases/FlexRenderProps.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`any`

## Example

```html
<th x-html="FlexRender({ header })"></th>
<td x-html="FlexRender({ cell })"></td>
<th x-html="FlexRender({ footer: header })"></th>
```
