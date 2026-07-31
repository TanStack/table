---
id: LitRenderable
title: LitRenderable
---

# Type Alias: LitRenderable

```ts
type LitRenderable = 
  | TemplateResult
  | DirectiveResult
  | Node
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | typeof nothing
  | typeof noChange
| Iterable<LitRenderable>;
```

Defined in: [packages/lit-table/src/flexRender.ts:11](https://github.com/TanStack/table/blob/main/packages/lit-table/src/flexRender.ts#L11)
