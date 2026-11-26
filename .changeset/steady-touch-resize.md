---
'@tanstack/table-core': patch
---

Track the initiating touch during column resizing so additional fingers cannot move or end the resize. Commit the ending touch's own position and preserve cleanup on cancellation.
