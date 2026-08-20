import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/anotherRoute')({
  validateSearch: () => ({}) as { foo: string; bar: number },
})
