import {
  createRoot,
  delegateEvents,
  drainPassiveEffects,
  flushSync,
} from 'octane'
import type { ComponentBody, Root } from 'octane'

delegateEvents(['click', 'input', 'change'])

interface MountResult {
  container: HTMLElement
  root: Root
  unmount: () => void
  click: (selector: string) => void
  find: (selector: string) => Element
  findAll: (selector: string) => Array<Element>
}

export function mount<TProps = undefined>(
  body: ComponentBody<TProps>,
  props?: TProps,
): MountResult {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  try {
    root.render(body, props)
    flushSync(() => {})
  } catch (error) {
    try {
      root.unmount()
    } finally {
      container.remove()
    }
    throw error
  }

  return {
    container,
    root,
    unmount() {
      root.unmount()
      container.remove()
    },
    click(selector) {
      const element = container.querySelector(selector)
      if (!element) throw new Error(`No element matching ${selector}`)
      flushSync(() => {
        if (typeof (element as HTMLElement).click === 'function') {
          ;(element as HTMLElement).click()
        } else {
          element.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true }),
          )
        }
      })
    },
    find(selector) {
      const element = container.querySelector(selector)
      if (!element) throw new Error(`No element matching ${selector}`)
      return element
    },
    findAll(selector) {
      return Array.from(container.querySelectorAll(selector))
    },
  }
}

export function nextPaint(): Promise<void> {
  drainPassiveEffects()
  return Promise.resolve()
}
