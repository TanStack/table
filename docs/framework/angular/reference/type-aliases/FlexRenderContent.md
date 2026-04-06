---
id: FlexRenderContent
title: FlexRenderContent
---

# Type Alias: FlexRenderContent\<TProps\>

```ts
type FlexRenderContent<TProps> = 
  | string
  | number
  | Type<TProps>
  | FlexRenderComponent<TProps>
  | TemplateRef<{
  $implicit: TProps;
}>
  | null
  | Record<any, any>
  | undefined;
```

Defined in: [flex-render/renderer.ts:44](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/renderer.ts#L44)

Content supported by the `flexRender` directive when declaring
a table column header/cell.

## Type Parameters

### TProps

`TProps` *extends* `NonNullable`\<`unknown`\>
