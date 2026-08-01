import { afterEach } from 'vitest'
import { drainPassiveEffects } from 'octane'

afterEach(() => {
  drainPassiveEffects()
  document.body.replaceChildren()
})
