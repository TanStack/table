---
'@tanstack/table-core': patch
---

Skip `NaN` in the `min`, `max` and `extent` aggregations, as v8 did, so a group whose first value is `NaN` no longer aggregates to `NaN`
