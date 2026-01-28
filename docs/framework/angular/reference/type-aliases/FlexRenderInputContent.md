---
id: FlexRenderInputContent
title: FlexRenderInputContent
---

# Type Alias: FlexRenderInputContent\<TProps\>

```ts
type FlexRenderInputContent<TProps> = 
  | number
  | string
  | (props) => FlexRenderContent<TProps>
  | null
  | undefined;
```

Defined in: [flex-render/renderer.ts:46](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/renderer.ts#L46)

## Type Parameters

### TProps

`TProps` *extends* `NonNullable`\<`unknown`\>
