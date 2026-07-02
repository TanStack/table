# Kitchen Sink — TanStack Start (SSR)

The [kitchen-sink](../kitchen-sink) example converted to a server-side rendered
[TanStack Start](https://tanstack.com/start) app, for verifying that every
table feature renders and hydrates cleanly under SSR.

The root route installs a console probe before hydration: any console
error/warning (including React hydration mismatches) is captured into
`window.__consoleLog`, so an empty array after load means a clean hydration.

Differences from the SPA version:

- Data is generated only on the server (`createServerFn` called from the route
  `loader`) and serialized to the client, so hydration sees the same rows
  (faker in `useState` would mismatch on every cell).
- CSS is linked in the root route `head` instead of imported in `main.tsx`.
- Devtools are mounted in `__root.tsx`.
- `DndContext` gets a stable `id` so dnd-kit's generated `aria-describedby`
  ids match between server and client.

## Run

```bash
pnpm install # from the repo root
pnpm dev     # from this directory (http://localhost:3000)
```

`pnpm build` produces the SSR build; `pnpm start` serves it.
