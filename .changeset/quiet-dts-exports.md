---
'@tanstack/table-core': patch
---

Keep private declarations out of the emitted `.d.ts` files, so consumers emitting declarations no longer fail with TS2883 (e.g. on `RangeValue`)
