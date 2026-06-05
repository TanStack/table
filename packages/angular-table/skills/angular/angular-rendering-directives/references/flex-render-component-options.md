# `flexRenderComponent` — Full Options Reference

When you need custom inputs not derived from the render context, output
callbacks, a custom injector, or Angular v20+ `bindings` / `directives`,
**wrap the component**:

```ts
import { flexRenderComponent, type ColumnDef } from '@tanstack/angular-table'
import { EditableCell } from './editable-cell'

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: ({ getValue, row, column, table }) =>
      flexRenderComponent(EditableCell, {
        inputs: {
          value: getValue(),
        },
        outputs: {
          change: (value) => {
            table.options.meta?.updateData(row.index, column.id, value)
          },
        },
      }),
  },
]
```

## How inputs/outputs are wired

- **`inputs`** → applied via `ComponentRef.setInput(key, value)` (works with
  both `input()` signals and legacy `@Input()`). Diffed per change-detection
  cycle with `KeyValueDiffers` — unchanged values are _not_ re-set, so object
  inputs are reference-checked. Keep input objects referentially stable when
  you can.
- **`outputs`** → resolved at component-instance level. The wrapper reads the
  property by name, checks it is an `OutputEmitterRef`, and subscribes. The
  subscription is cleaned up when the component is destroyed.
- **`injector`** → use when the rendered component needs to inject from a
  specific scope (e.g. a feature module / sub-injector).
- **`bindings`** (Angular v20+) → forwarded directly to
  `ViewContainerRef.createComponent` at creation time. Use this with
  `inputBinding`, `outputBinding`, `twoWayBinding` for native programmatic
  rendering semantics.
- **`directives`** (Angular v20+) → host directives forwarded the same way.

```ts
import { inputBinding, outputBinding, twoWayBinding, signal } from '@angular/core'

readonly name = signal('Ada')

cell: () =>
  flexRenderComponent(EditableNameCell, {
    bindings: [
      inputBinding('value', this.name),
      twoWayBinding('value', this.name),
      outputBinding('valueChange', (v) => console.log('changed', v)),
    ],
  })
```

> **Do not mix `bindings` with `inputs`/`outputs`** on the same component.
> `bindings` apply at creation time and participate in the initial CD cycle;
> `inputs`/`outputs` apply after. Mixing them risks double-initialization.
