import { describe, expect, it } from 'vitest'
import {
  resolveDevtoolsPanelProps,
  resolveDevtoolsTheme,
  seedDevtoolsFontStyle,
} from '../src/panelProps'

describe('resolveDevtoolsTheme', () => {
  it('keeps light and dark values', () => {
    expect(resolveDevtoolsTheme('light')).toBe('light')
    expect(resolveDevtoolsTheme('dark')).toBe('dark')
  })

  it('unwraps the nested props object vue-devtools 0.2.24 passes as theme', () => {
    expect(resolveDevtoolsTheme({ theme: 'light', devtoolsOpen: true })).toBe(
      'light',
    )
  })

  it('defaults unknown values to a concrete light or dark theme', () => {
    expect(resolveDevtoolsTheme(undefined)).toBe('dark')
    expect(['light', 'dark']).toContain(resolveDevtoolsTheme('system'))
  })
})

describe('resolveDevtoolsPanelProps', () => {
  it('defaults a standalone panel to dark and open', () => {
    expect(resolveDevtoolsPanelProps()).toEqual({
      theme: 'dark',
      devtoolsOpen: true,
    })
  })

  it('flattens nested plugin props', () => {
    expect(
      resolveDevtoolsPanelProps({
        theme: { theme: 'light', devtoolsOpen: false },
      }),
    ).toEqual({
      theme: 'light',
      devtoolsOpen: false,
    })
  })
})

describe('seedDevtoolsFontStyle', () => {
  it('inserts a placeholder so devtools-ui skips broken font URLs', () => {
    document.getElementById('tanstack-devtools-fonts')?.remove()
    seedDevtoolsFontStyle()
    const style = document.getElementById('tanstack-devtools-fonts')
    expect(style).toBeInstanceOf(HTMLStyleElement)
    expect(style?.textContent).toBe('')
    seedDevtoolsFontStyle()
    expect(document.querySelectorAll('#tanstack-devtools-fonts')).toHaveLength(
      1,
    )
  })

  it('clears broken @font-face urls if the shell already injected them', () => {
    document.getElementById('tanstack-devtools-fonts')?.remove()
    const style = document.createElement('style')
    style.id = 'tanstack-devtools-fonts'
    style.textContent = '@font-face { src: url("/assets/missing.ttf"); }'
    document.head.append(style)

    seedDevtoolsFontStyle()

    expect(style.textContent).toBe('')
    expect(document.querySelectorAll('#tanstack-devtools-fonts')).toHaveLength(
      1,
    )
  })
})
