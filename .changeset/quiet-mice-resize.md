---
'@tanstack/table-core': patch
---

End a column resize when its `mouseup` was missed. Dragging a resize handle installs `mousemove` and `mouseup` listeners on the document, and a release that never reaches the page — switching tabs, taking a screenshot, any focus steal — left those listeners attached with the dragged column still active, so the handle followed the pointer with no button held. The next `mousemove` reports `buttons === 0`, which says the gesture is over; the resize now commits and cleans up there, matching what the touch path already does on `touchcancel`.

`buttons` is a bitmask, so a nonzero value alone does not prove the drag is alive: the button that started the resize can be released while a different one stays down. The gesture now ends when the initiating button's bit is clear, so a move that reports another button no longer keeps the handle attached.
