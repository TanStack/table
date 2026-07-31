---
id: Renderable
title: Renderable
---

# Type Alias: Renderable\<TProps\>

```ts
type Renderable<TProps> =
  | ComponentBody<TProps>
  | ElementDescriptor<any>
  | string
  | number
  | boolean
  | null
  | undefined;
```

Defined in: [types.ts:53](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L53)

Anything a `columnDef.cell`/`header`/`footer` slot may hold: an octane
component, an already-created element descriptor, or a primitive that
renders as text.

## Type Parameters

### TProps

`TProps`
