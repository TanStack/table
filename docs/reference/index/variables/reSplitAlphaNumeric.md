---
id: reSplitAlphaNumeric
title: reSplitAlphaNumeric
---

# Variable: reSplitAlphaNumeric

```ts
const reSplitAlphaNumeric: RegExp;
```

Defined in: [features/row-sorting/sortFns.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/sortFns.ts#L12)

Regular expression used to split mixed text and numeric chunks.

The alphanumeric sort functions use these chunks for natural sorting of
strings like `item2` before `item10`.
