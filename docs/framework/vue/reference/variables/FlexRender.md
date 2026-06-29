---
id: FlexRender
title: FlexRender
---

# Variable: FlexRender

```ts
const FlexRender: DefineComponent<{
  cell?: FlexRenderCell;
  footer?: FlexRenderHeader;
  header?: FlexRenderHeader;
  props?: any;
  render?: any;
}, () => any, {
}, {
}, {
}, ComponentOptionsMixin, ComponentOptionsMixin, {
}, string, PublicProps, ToResolvedProps<{
  cell?: FlexRenderCell;
  footer?: FlexRenderHeader;
  header?: FlexRenderHeader;
  props?: any;
  render?: any;
}, {
}>, {
  cell: FlexRenderCell;
  footer: FlexRenderHeader;
  header: FlexRenderHeader;
  props: any;
  render: any;
}, {
}, {
}, {
}, string, ComponentProvideOptions, true, {
}, any>;
```

Defined in: [packages/vue-table/src/FlexRender.ts:67](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L67)

Simplified component for rendering headers, cells, or footers.

Supports both the new shorthand pattern and the legacy `:render`/`:props` pattern:

## Example

```vue
<!-- New shorthand pattern -->
<FlexRender :cell="cell" />
<FlexRender :header="header" />
<FlexRender :footer="header" />

<!-- Legacy pattern (still supported) -->
<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
```
