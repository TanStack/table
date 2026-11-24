---
'@tanstack/table-core': patch
---

Sort digit runs longer than 15 digits, such as snowflake IDs, by value in `sortFn_alphanumeric` and `sortFn_alphanumericCaseSensitive`. They previously compared as equal once `parseInt` lost precision.
