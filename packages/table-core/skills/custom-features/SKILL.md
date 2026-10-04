---
name: custom-features
description:
  Implement a Table v9 plugin when built-ins and typed meta are insufficient. Covers
  FeatureMaps, runtime lifecycle hooks, prototypes, and a complete checked example.
metadata:
  type: core
  library: '@tanstack/table-core'
  library_version: 9.2.5
requires:
  - core
  - table-features
sources:
  - TanStack/table:docs/framework/react/guide/custom-features.md
  - TanStack/table:packages/table-core/src/types
  - TanStack/table:packages/table-core/src/types/TableFeatures.ts
  - TanStack/table:packages/table-core/src/utils.ts
  - TanStack/table:packages/table-core/src/features
  - TanStack/table:examples/react/custom-plugin
---

# Author a custom feature

Read [core](../core/SKILL.md) and [feature architecture](../table-features/SKILL.md) first. Use a plugin for reusable state or behavior that must augment Table objects. Built-in options and typed `tableMeta`/`columnMeta` are usually enough for renderer callbacks and application configuration.

## Implementation workflow

1. Identify the state, options, and object methods the behavior owns. If it only passes callbacks or renderer data, read [scoped meta typing](../core/references/typescript.md) and use meta instead.
2. Before declaring plugin types or writing lifecycle hooks, read the [complete plugin example](references/plugin-example.md). It enumerates all 10 public FeatureMaps, the API assignment helpers, lifecycle ordering, and the advanced row-model maps.
3. Declare the feature key in `Plugins`. Merge only FeatureMaps with matching runtime implementations; declarations alone install no behavior.
4. Preserve user state after defaults in `getInitialState`; connect state updaters in default options. Install table methods with `assignTableAPIs` and object methods with `assignPrototypeAPIs` inside the corresponding lifecycle hooks.
5. Keep the feature object and `tableFeatures({ customFeature })` result stable. Register the plugin through `tableFeatures` so inference and composition include it.
6. Verify the advertised state, options, methods, and resets on a constructed table. Each declared API must exist at runtime; reset behavior must respect the state owner.

## Lifecycle boundaries

Use `initTableInstanceData` for mutable data owned by one table and `resetTableInstanceData` for clearing its transient contents. All feature initialization finishes before any `constructTableAPIs` hook. Keep method installation separate from data allocation.

Prototype methods are shared across the table's rows, columns, cells, or headers. Read per-object values through the method's current instance, and use the supported instance-data hooks for mutable fields. Read the example's installation rules before adding memoized methods or advanced row-model/cache wiring.

## Common failures

- Types without matching runtime hooks advertise APIs that do not exist.
- Ad hoc mutation of constructed instances bypasses feature registration and inferred composition.
- Treating the density example as the only extension pattern misses column definitions and the other public FeatureMaps. Choose the maps required by the behavior; advanced row-model declarations also require runtime pipeline/cache wiring.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/types/TableFeatures.d.ts`, the exported `*_FeatureMap` interfaces in `dist/types/`, and `assignTableAPIs`/`assignPrototypeAPIs` in `dist/utils.d.ts`. Follow declarations under `dist/features/` for comparable stock lifecycle signatures.
