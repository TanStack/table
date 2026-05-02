import type { MantineTheme } from '@mantine/core'

import type { MantineShade } from '../types'

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_')

export const getPrimaryShade = (theme: MantineTheme): number =>
  typeof theme.primaryShade === 'number'
    ? theme.primaryShade
    : (theme.primaryShade?.dark ?? 7)

export const getPrimaryColor = (
  theme: MantineTheme,
  shade?: MantineShade,
): string => theme.colors[theme.primaryColor][shade ?? getPrimaryShade(theme)]

export function dataVariable(
  name: string,
  value: boolean | number | string | undefined,
) {
  const key = `data-${name}`
  switch (typeof value) {
    case 'boolean':
      return value ? { [key]: '' } : null
    case 'number':
      return { [key]: `${value}` }
    case 'string':
      return { [key]: value }
    default:
      return null
  }
}
