---
'@tanstack/table-core': patch
---

Fix keyboard navigation out of a merged cell on any page after the first. `moveCellSelection` and `extendCellSelection` now look up the starting merge by display index, as the merge bounds are stored.
