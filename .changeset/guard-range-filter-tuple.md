---
'@tanstack/table-core': patch
---

Guard `resolveFilterValue` in `inNumberRange` and `inDateRange` against filter values that are not arrays. Previously a string was destructured per character (`'30'` became the range `[0, 3]`, filtering silently wrong) and a number, boolean or `Date` threw `TypeError: val is not iterable`. Such values now leave the range fully open and warn in development.
