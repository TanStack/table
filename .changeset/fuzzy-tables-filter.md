---
'@tanstack/table-core': patch
---

Fix hierarchical filtered row models so `flatRows` lists parents before descendants in both filtering modes, preserves filter metadata on cloned rows, and round-trips nested data correctly through worker-backed row models.
