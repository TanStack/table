import { registerDestructor } from '@ember/destroyable'

export function registerCleanup(owner: object, cleanup: () => void): void {
  registerDestructor(owner, cleanup)
}
