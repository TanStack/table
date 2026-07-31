import { flushSync } from 'octane'
import { beforeEach, describe, expect, it } from 'vitest'
import { mount, nextPaint } from '../_helpers'
import {
  ExternalAtomHarness,
  OwnershipHarness,
  PhaseHarness,
  SourceSwitchHarness,
  SuspenseHarness,
  externalCapture,
  externalSelectionAtom,
  ownershipCapture,
  phaseCapture,
  sourceA,
  sourceB,
  sourceCapture,
  suspendedCapture,
} from '../_fixtures/adapter-reactivity.tsrx'

async function flush() {
  for (let index = 0; index < 3; index++) {
    await Promise.resolve()
    await nextPaint()
  }
}

beforeEach(() => {
  phaseCapture.table = undefined
  phaseCapture.rendering = false
  phaseCapture.renders = 0
  phaseCapture.notifications.length = 0
  externalCapture.table = undefined
  externalSelectionAtom.set({ external: true })
  sourceA.set({ value: 'A0' })
  sourceB.set({ value: 'B0' })
  sourceCapture.renders = 0
  suspendedCapture.table = undefined
  suspendedCapture.setPagination = undefined
  ownershipCapture.table = undefined
})

describe('render-phase state publication', () => {
  it('commits owner and isolated controlled updates in the discrete event', () => {
    const view = mount(PhaseHarness, {})

    ;(view.find('#phase-next') as HTMLButtonElement).click()

    expect(view.find('#phase-page').textContent).toBe('1')
    expect(view.find('#phase-island').textContent).toBe('1')
    view.unmount()
  })

  it('publishes controlled state only after render and avoids a redundant owner render', async () => {
    const view = mount(PhaseHarness, {})
    await flush()
    const table = phaseCapture.table!
    const initialRenders = phaseCapture.renders
    const subscription = table.store.subscribe((state) => {
      phaseCapture.notifications.push({
        duringRender: phaseCapture.rendering,
        pageIndex: state.pagination.pageIndex,
      })
    })

    view.click('#phase-next')
    await flush()

    expect(view.find('#phase-page').textContent).toBe('1')
    expect(view.find('#phase-island').textContent).toBe('1')
    expect(phaseCapture.renders).toBe(initialRenders + 1)
    expect(phaseCapture.notifications.length).toBeGreaterThan(0)
    expect(phaseCapture.notifications.at(-1)).toEqual({
      duringRender: false,
      pageIndex: 1,
    })
    expect(
      phaseCapture.notifications.every((event) => !event.duringRender),
    ).toBe(true)

    subscription.unsubscribe()
    view.unmount()
  })

  it('does not publish controlled state from suspended abandoned work', async () => {
    const view = mount(SuspenseHarness, {})
    await flush()
    const table = suspendedCapture.table!
    const notifications: Array<number> = []
    const subscription = table.store.subscribe((state) => {
      notifications.push(state.pagination.pageIndex)
    })

    flushSync(() => {
      suspendedCapture.setPagination!({ pageIndex: 1, pageSize: 1 })
    })
    await flush()

    expect(view.find('#suspended').textContent).toBe('Suspended')
    // Live readonly facades may expose the staged speculative options, but the
    // owned base atom is the publication boundary and must remain committed.
    expect(table.store.get().pagination.pageIndex).toBe(1)
    expect(table.baseAtoms.pagination.get().pageIndex).toBe(0)
    expect(notifications).toEqual([])

    subscription.unsubscribe()
    view.unmount()
  })
})

describe('ownership and isolated subscriptions', () => {
  it('gives external atoms precedence and routes table writes to them', async () => {
    const view = mount(ExternalAtomHarness, {})
    await flush()

    expect(view.find('#external-selection').textContent).toBe(
      '{"external":true}',
    )
    view.click('#external-write')
    await flush()

    expect(externalSelectionAtom.get()).toEqual({ written: true })
    expect(view.find('#external-selection').textContent).toBe(
      '{"written":true}',
    )
    view.unmount()
  })

  it('releases and reacquires ownership of a controlled slice', async () => {
    const view = mount(OwnershipHarness, {})
    await flush()
    expect(view.find('#ownership-page').textContent).toBe('2')

    view.click('#release')
    await flush()
    view.click('#set-internal')
    await flush()
    expect(view.find('#ownership-page').textContent).toBe('4')

    view.click('#reacquire')
    await flush()
    expect(view.find('#ownership-page').textContent).toBe('2')
    view.unmount()
  })

  it('moves a Subscribe instance when its source identity changes', async () => {
    const view = mount(SourceSwitchHarness, {})
    await flush()
    expect(view.find('#source-value').textContent).toBe('A0')

    flushSync(() => sourceA.set({ value: 'A1' }))
    await flush()
    expect(view.find('#source-value').textContent).toBe('A1')

    view.click('#switch-source')
    await flush()
    expect(view.find('#source-value').textContent).toBe('B0')
    const rendersAfterSwitch = sourceCapture.renders

    flushSync(() => sourceA.set({ value: 'A2' }))
    await flush()
    expect(view.find('#source-value').textContent).toBe('B0')
    expect(sourceCapture.renders).toBe(rendersAfterSwitch)

    flushSync(() => sourceB.set({ value: 'B1' }))
    await flush()
    expect(view.find('#source-value').textContent).toBe('B1')
    view.unmount()
  })

  it('removes isolated subscriptions on unmount', async () => {
    const view = mount(SourceSwitchHarness, {})
    await flush()
    const rendersBeforeUnmount = sourceCapture.renders
    view.unmount()

    flushSync(() => sourceA.set({ value: 'after' }))
    await flush()
    expect(sourceCapture.renders).toBe(rendersBeforeUnmount)
  })
})
