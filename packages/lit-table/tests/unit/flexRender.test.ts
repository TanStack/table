import { describe, expect, test, vi } from 'vitest'
import { html, nothing } from 'lit'
import { flexRender } from '../../src/flexRender'

describe('flexRender', () => {
  test('handles empty, static, template, and callback renderers', () => {
    const props = { value: 'Ada' }
    const callback = vi.fn(
      (context: typeof props) => html`<strong>${context.value}</strong>`,
    )
    const existingTemplate = html`<span>Existing</span>`

    expect(flexRender(undefined, props)).toBeNull()
    expect(flexRender(null, props)).toBeNull()
    expect(flexRender('', props)).toBe('')
    expect(flexRender(0, props)).toBe(0)
    expect(flexRender(false, props)).toBe(false)
    expect(flexRender(nothing, props)).toBe(nothing)
    expect(flexRender(['Ada', 0], props)).toEqual(['Ada', 0])
    expect(flexRender('Plain text', props)).toBe('Plain text')
    expect(flexRender(existingTemplate, props)).toBe(existingTemplate)
    expect(flexRender(callback, props)).toEqual(
      html`<strong>${props.value}</strong>`,
    )
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(props)
    expect(flexRender(() => 0, props)).toBe(0)
  })
})
