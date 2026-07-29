import { describe, expect, test, vi } from 'vitest'
import { createRoot } from 'solid-js'
import { flexRender } from '../../src/FlexRender'

describe('flexRender', () => {
  test('handles empty, static, and component templates', () => {
    createRoot((dispose) => {
      expect(flexRender(undefined, { value: 'unused' })).toBeNull()
      expect(flexRender('static', { value: 'unused' })).toBe('static')

      const Component = vi.fn((props: { value: string }) => {
        return `component:${props.value}`
      })

      expect(flexRender(Component, { value: 'rendered' })).toBe(
        'component:rendered',
      )
      expect(Component).toHaveBeenCalledWith({ value: 'rendered' })
      dispose()
    })
  })
})
