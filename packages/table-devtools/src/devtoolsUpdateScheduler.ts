import { batch } from 'solid-js'

const UPDATE_DELAY_MS = 32
const IDLE_TIMEOUT_MS = 100

type ScheduledUpdate = () => void

const pendingUpdates = new Set<ScheduledUpdate>()

let delayHandle: ReturnType<typeof setTimeout> | undefined
let idleHandle: number | undefined

function flushUpdates() {
  delayHandle = undefined
  idleHandle = undefined

  const updates = Array.from(pendingUpdates)
  pendingUpdates.clear()

  batch(() => {
    for (const update of updates) {
      update()
    }
  })
}

function cancelScheduledFlush() {
  if (delayHandle !== undefined) {
    clearTimeout(delayHandle)
    delayHandle = undefined
  }

  if (
    idleHandle !== undefined &&
    typeof globalThis.cancelIdleCallback === 'function'
  ) {
    globalThis.cancelIdleCallback(idleHandle)
    idleHandle = undefined
  }
}

function requestFlush() {
  if (delayHandle !== undefined || idleHandle !== undefined) {
    return
  }

  delayHandle = setTimeout(() => {
    delayHandle = undefined

    if (typeof globalThis.requestIdleCallback === 'function') {
      idleHandle = globalThis.requestIdleCallback(flushUpdates, {
        timeout: IDLE_TIMEOUT_MS,
      })
      return
    }

    delayHandle = setTimeout(flushUpdates, 0)
  }, UPDATE_DELAY_MS)
}

/**
 * Coalesces devtools-only reactive work and yields to the inspected app before
 * flushing it. The returned function removes this update if its owner unmounts
 * or its source changes before the queue is flushed.
 */
export function scheduleDevtoolsUpdate(update: ScheduledUpdate) {
  pendingUpdates.add(update)
  requestFlush()

  return () => {
    pendingUpdates.delete(update)

    if (pendingUpdates.size === 0) {
      cancelScheduledFlush()
    }
  }
}
