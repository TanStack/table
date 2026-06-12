---
id: ColumnDefTemplate
title: ColumnDefTemplate
---

# Type Alias: ColumnDefTemplate\<TProps\>

```ts
type ColumnDefTemplate<TProps> = string | (props) => any;
```

Defined in: [types/ColumnDef.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L60)

A renderable column template value.

Strings render directly; functions receive the relevant cell/header context
and can return framework-specific render output.

## Type Parameters

### TProps

`TProps` *extends* `object`
