---
id: AngularTableComputed
title: AngularTableComputed
---

# Interface: AngularTableComputed()\<TFeatures\>

Defined in: [injectTable.ts:32](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L32)

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

Defined in: [injectTable.ts:33](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L33)

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

`Atom`\<`TSourceValue`\> \| `ReadonlyAtom`\<`TSourceValue`\>

### Returns

`Signal`\<`Readonly`\<`TSourceValue`\>\>

## Call Signature

```ts
AngularTableComputed<TSourceValue, TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:38](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L38)

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

`Atom`\<`TSourceValue`\> \| `ReadonlyAtom`\<`TSourceValue`\>

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>

## Call Signature

```ts
AngularTableComputed<TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:43](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L43)

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
