---
id: Row_RowExpanding
title: Row_RowExpanding
---

# Interface: Row\_RowExpanding

## Properties

### getCanExpand()

```ts
getCanExpand: () => boolean;
```

Returns whether the row can be expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getcanexpand)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:19](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L19)

***

### getIsAllParentsExpanded()

```ts
getIsAllParentsExpanded: () => boolean;
```

Returns whether all parent rows of the row are expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisallparentsexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:25](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L25)

***

### getIsExpanded()

```ts
getIsExpanded: () => boolean;
```

Returns whether the row is expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:31](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L31)

***

### getToggleExpandedHandler()

```ts
getToggleExpandedHandler: () => () => void;
```

Returns a function that can be used to toggle the expanded state of the row. This function can be used to bind to an event handler to a button.

#### Returns

`Function`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#gettoggleexpandedhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:37](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L37)

***

### toggleExpanded()

```ts
toggleExpanded: (expanded?) => void;
```

Toggles the expanded state (or sets it if `expanded` is provided) for the row.

#### Parameters

• **expanded?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#toggleexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:43](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L43)
