---
'@tanstack/octane-table': minor
---

Require octane `>=0.12.0` and depend on `@tanstack/octane-store` `^0.13.0`. `AppTable`, `AppCell` and `AppHeader` now render their contexts directly as providers, since octane removed `Context.Provider`.
