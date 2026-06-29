---
id: FlexRenderCell
title: FlexRenderCell
---

# Interface: FlexRenderCell

Defined in: [packages/vue-table/src/FlexRender.ts:4](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L4)

## Properties

### column

```ts
column: object;
```

Defined in: [packages/vue-table/src/FlexRender.ts:5](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L5)

#### columnDef

```ts
columnDef: object;
```

##### columnDef.aggregatedCell?

```ts
optional aggregatedCell: any;
```

##### columnDef.cell?

```ts
optional cell: any;
```

***

### getContext()

```ts
getContext: () => any;
```

Defined in: [packages/vue-table/src/FlexRender.ts:11](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L11)

#### Returns

`any`

***

### getIsAggregated()?

```ts
optional getIsAggregated: () => boolean;
```

Defined in: [packages/vue-table/src/FlexRender.ts:12](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L12)

#### Returns

`boolean`

***

### getIsPlaceholder()?

```ts
optional getIsPlaceholder: () => boolean;
```

Defined in: [packages/vue-table/src/FlexRender.ts:13](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L13)

#### Returns

`boolean`
