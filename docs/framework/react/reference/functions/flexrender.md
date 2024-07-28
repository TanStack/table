---
id: FlexRender
title: FlexRender
---

# Function: FlexRender()

```ts
function FlexRender<TProps>(__namedParameters): ReactNode | Element
```

Component version of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.

## Type Parameters

• **TProps** *extends* `object`

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.Component**: [`Renderable`](../type-aliases/renderable.md)\<`TProps`\>

• **\_\_namedParameters.props**: `TProps`

## Returns

`ReactNode` \| `Element`

## Example

```ts
<FlexRender Component={cell.column.columnDef.cell} props={cell.getContext()} />
```

## Defined in

[react-table/src/FlexRender.tsx:52](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/react-table/src/FlexRender.tsx#L52)
