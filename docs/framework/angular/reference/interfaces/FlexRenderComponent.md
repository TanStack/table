---
id: FlexRenderComponent
title: FlexRenderComponent
---

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:240](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L240)

Wrapper interface for a component that will be used as content for [FlexRenderDirective](../classes/FlexRenderDirective.md).
Can be created using [flexRenderComponent](../functions/flexRenderComponent.md) helper.

## Example

```ts
import {flexRenderComponent} from '@tanstack/angular-table'

// Usage in cell/header/footer definition
const columns = [
  {
    cell: ({ row }) => {
       return flexRenderComponent(MyComponent, {
         inputs: { value: mySignalValue() },
         outputs: { valueChange: (val) => {} }
         // or using angular createComponent#bindings api
         bindings: [
           inputBinding('value', mySignalValue),
           outputBinding('valueChange', value => {
             console.log("my value changed to", value)
           })
         ]
       })
    },
  },
]

import {input, output} from '@angular/core';

@Component({
 selector: 'my-component',
})
class MyComponent {
   readonly value = input(0);
   readonly valueChange = output<number>();
}

```

## Type Parameters

### TComponent

`TComponent` = `any`

## Properties

### bindings?

```ts
optional bindings?: Binding[];
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:283](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L283)

Bindings to apply to the root component

#### See

FlexRenderOptions#bindings

***

### component

```ts
readonly component: Type<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:244](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L244)

The component type

***

### directives?

```ts
optional directives?: (Type<unknown> | DirectiveWithBindings<unknown>)[];
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:289](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L289)

Directives that should be applied to the component.

#### See

***

### injector?

```ts
readonly optional injector?: Injector;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:277](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L277)

Optional Injector that will be used when rendering the component.

#### See

FlexRenderOptions#injector

***

### inputs?

```ts
readonly optional inputs?: Inputs<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:271](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L271)

Component instance inputs. Set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput))

#### See

FlexRenderOptions#inputs

***

### key?

```ts
readonly optional key?: string | number;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:251](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L251)

Optional identity used together with the component type to decide whether
an existing component instance can be reused.

#### See

FlexRenderOptions#key

***

### metadata

```ts
readonly metadata: ResolvedComponentMetadata<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:259](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L259)

Cached component metadata used by the flex renderer.

***

### mirror

```ts
readonly mirror: ComponentMirror<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:255](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L255)

Reflected metadata about the component.

***

### outputs?

```ts
readonly optional outputs?: Outputs<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:265](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L265)

Component instance outputs. Subscribed via OutputEmitterRef#subscribe

#### See

FlexRenderOptions#outputs
