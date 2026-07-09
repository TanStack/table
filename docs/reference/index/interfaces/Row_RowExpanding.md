---
id: Row_RowExpanding
title: Row_RowExpanding
---

# Interface: Row\_RowExpanding

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L13)

## Properties

### getCanExpand()

```ts
getCanExpand: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L17)

Checks whether this row can be expanded.

#### Returns

`boolean`

***

### getIsAllParentsExpanded()

```ts
getIsAllParentsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L21)

Checks whether every ancestor of this row is expanded.

#### Returns

`boolean`

***

### getIsExpanded()

```ts
getIsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L25)

Checks whether this row is currently expanded.

#### Returns

`boolean`

***

### getToggleExpandedHandler()

```ts
getToggleExpandedHandler: () => () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L29)

Creates a handler that toggles this row's expanded state.

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L33)

Toggles the expanded state (or sets it if `expanded` is provided) for the row.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
