---
id: AngularTableComputed
title: AngularTableComputed
---

# Interface: AngularTableComputed()\<TFeatures\>

Defined in: [injectTable.ts:40](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L40)

Store mode: pass `selector` (required) to project from full table state.
Source mode: pass `source` (atom or store); omit `selector` for the whole value
(identity), or pass `selector` to project. Split overloads match React `Subscribe`
inference.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

## Call Signature

```ts
AngularTableComputed<TSourceValue>(props): Signal<Readonly<TSourceValue>>;
```

Defined in: [injectTable.ts:41](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L41)

Store mode: pass `selector` (required) to project from full table state.
Source mode: pass `source` (atom or store); omit `selector` for the whole value
(identity), or pass `selector` to project. Split overloads match React `Subscribe`
inference.

### Type Parameters

#### TSourceValue

`TSourceValue`

### Parameters

#### props

##### equal?

`ValueEqualityFn`\<`TSourceValue`\>

##### selector?

`undefined`

##### source

[`SubscribeSource`](../type-aliases/SubscribeSource.md)\<`TSourceValue`\>

### Returns

`Signal`\<`Readonly`\<`TSourceValue`\>\>

## Call Signature

```ts
AngularTableComputed<TSourceValue, TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:46](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L46)

Store mode: pass `selector` (required) to project from full table state.
Source mode: pass `source` (atom or store); omit `selector` for the whole value
(identity), or pass `selector` to project. Split overloads match React `Subscribe`
inference.

### Type Parameters

#### TSourceValue

`TSourceValue`

#### TSubSelected

`TSubSelected`

### Parameters

#### props

##### equal?

`ValueEqualityFn`\<`TSubSelected`\>

##### selector

(`state`) => `TSubSelected`

##### source

[`SubscribeSource`](../type-aliases/SubscribeSource.md)\<`TSourceValue`\>

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>

## Call Signature

```ts
AngularTableComputed<TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:51](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L51)

Store mode: pass `selector` (required) to project from full table state.
Source mode: pass `source` (atom or store); omit `selector` for the whole value
(identity), or pass `selector` to project. Split overloads match React `Subscribe`
inference.

### Type Parameters

#### TSubSelected

`TSubSelected`

### Parameters

#### props

##### equal?

`ValueEqualityFn`\<`TSubSelected`\>

##### selector

(`state`) => `TSubSelected`

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>
