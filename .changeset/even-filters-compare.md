---
'@tanstack/table-core': patch
---

Make `filterFn_greaterThanOrEqualTo` and `filterFn_lessThan` (and the endpoints of `filterFn_between` / `filterFn_betweenInclusive`) treat values as equal using the same normalization as `filterFn_greaterThan`, so `30` equals `'30'`, two `Date`s with the same time are equal, and strings that differ only in case are equal.
