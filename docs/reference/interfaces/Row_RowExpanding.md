---
id: Row_RowExpanding
title: Row_RowExpanding
---

# Interface: Row\_RowExpanding

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L14)

## Properties

### getCanExpand()

```ts
getCanExpand: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L18)

Returns whether the row can be expanded.

#### Returns

`boolean`

***

### getIsAllParentsExpanded()

```ts
getIsAllParentsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L22)

Returns whether all parent rows of the row are expanded.

#### Returns

`boolean`

***

### getIsExpanded()

```ts
getIsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L26)

Returns whether the row is expanded.

#### Returns

`boolean`

***

### getToggleExpandedHandler()

```ts
getToggleExpandedHandler: () => () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L30)

Returns a function that can be used to toggle the expanded state of the row. This function can be used to bind to an event handler to a button.

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### toggleExpanded()

```ts
toggleExpanded: (expanded?) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L34)

Toggles the expanded state (or sets it if `expanded` is provided) for the row.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
