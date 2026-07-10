---
id: AppFlexRender
title: AppFlexRender
---

# Variable: AppFlexRender

```ts
const AppFlexRender: DefineComponent<ExtractPropTypes<{
  cell: {
     default: undefined;
     type: PropType<FlexRenderCell>;
  };
  footer: {
     default: undefined;
     type: PropType<FlexRenderHeader>;
  };
  header: {
     default: undefined;
     type: PropType<FlexRenderHeader>;
  };
}>, () => 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | null, {
}, {
}, {
}, ComponentOptionsMixin, ComponentOptionsMixin, {
}, string, PublicProps, ToResolvedProps<ExtractPropTypes<{
  cell: {
     default: undefined;
     type: PropType<FlexRenderCell>;
  };
  footer: {
     default: undefined;
     type: PropType<FlexRenderHeader>;
  };
  header: {
     default: undefined;
     type: PropType<FlexRenderHeader>;
  };
}>, {
}>, {
  cell: FlexRenderCell;
  footer: FlexRenderHeader;
  header: FlexRenderHeader;
}, {
}, {
}, {
}, string, ComponentProvideOptions, true, {
}, any>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:296](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L296)
