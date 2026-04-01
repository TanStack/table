---
'@tanstack/table-core': patch
---

fix: prevent `onPaginationChange` from firing when pagination state has not changed

When a parent React Server Component re-renders (e.g., due to URL changes), the `data` prop reference changes even if values are identical. This caused `_autoResetPageIndex` to trigger `onPaginationChange` with the same pagination state, leading to unnecessary callback invocations and potential infinite loops when pagination state is persisted to URL search params.

`setPagination` now performs a shallow equality check before invoking `onPaginationChange`, skipping the callback when the resolved pagination state is identical to the current state.
