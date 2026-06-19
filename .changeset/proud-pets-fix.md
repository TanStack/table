---
'@tanstack/table-core': patch
---

fix prototype-named column ids (e.g. `hasOwnProperty`, `toString`) crashing filtering/sorting

Row value caches (`_valuesCache`, `_uniqueValuesCache`, `_groupingValuesCache`) were plain objects probed with `cache.hasOwnProperty(columnId)`. A column whose id collided with an `Object.prototype` member shadowed the inherited method on write, so the next probe invoked a cached value as a function and threw `TypeError`. Caches are now created with `Object.create(null)` and read via `Object.prototype.hasOwnProperty.call`, and `_getAllCellsByColumnId` is likewise null-prototyped so prototype-named ids resolve correctly.
