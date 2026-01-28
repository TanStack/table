---
id: FlexRenderComponent
title: FlexRenderComponent
---

# Interface: FlexRenderComponent\<TComponent\>

Defined in: [flex-render/flexRenderComponent.ts:205](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L205)

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

### allowedInputNames

```ts
readonly allowedInputNames: string[];
```

Defined in: [flex-render/flexRenderComponent.ts:217](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L217)

List of allowed input names.

***

### allowedOutputNames

```ts
readonly allowedOutputNames: string[];
```

Defined in: [flex-render/flexRenderComponent.ts:221](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L221)

List of allowed output names.

***

### bindings?

```ts
optional bindings: Binding[];
```

Defined in: [flex-render/flexRenderComponent.ts:245](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L245)

Bindings to apply to the root component

#### See

FlexRenderOptions#bindings

***

### component

```ts
readonly component: Type<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:209](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L209)

The component type

***

### directives?

```ts
optional directives: (Type<unknown> | DirectiveWithBindings<unknown>)[];
```

Defined in: [flex-render/flexRenderComponent.ts:251](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L251)

Directives that should be applied to the component.

#### See

***

### injector?

```ts
readonly optional injector: Injector;
```

Defined in: [flex-render/flexRenderComponent.ts:239](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L239)

Optional Injector that will be used when rendering the component.

#### See

FlexRenderOptions#injector

***

### inputs?

```ts
readonly optional inputs: Inputs<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:233](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L233)

Component instance inputs. Set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput))

#### See

FlexRenderOptions#inputs

***

### mirror

```ts
readonly mirror: ComponentMirror<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:213](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L213)

Reflected metadata about the component.

***

### outputs?

```ts
readonly optional outputs: Outputs<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:227](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L227)

Component instance outputs. Subscribed via OutputEmitterRef#subscribe

#### See

FlexRenderOptions#outputs
