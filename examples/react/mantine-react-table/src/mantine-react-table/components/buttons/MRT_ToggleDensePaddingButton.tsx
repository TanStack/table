import { ActionIcon, Tooltip } from '@mantine/core'
import type { ActionIconProps } from '@mantine/core'

import type {
  HTMLPropsRef,
  MRT_DensityState,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'

interface Props<TData extends MRT_RowData>
  extends ActionIconProps, HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>
}

type TogglableDensityState = Exclude<MRT_DensityState, 'lg' | 'sm'>

const next: Record<TogglableDensityState, TogglableDensityState> = {
  md: 'xs',
  xl: 'md',
  xs: 'xl',
}

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
  table: {
    state,
    options: {
      icons: {
        IconBaselineDensityLarge,
        IconBaselineDensityMedium,
        IconBaselineDensitySmall,
      },
      localization: { toggleDensity },
    },
    setDensity,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { density } = state

  return (
    <Tooltip label={title ?? toggleDensity} withinPortal>
      <ActionIcon
        aria-label={title ?? toggleDensity}
        color="gray"
        onClick={() =>
          setDensity((current) => next[current as TogglableDensityState])
        }
        size="lg"
        variant="subtle"
        {...rest}
      >
        {density === 'xs' ? (
          <IconBaselineDensitySmall />
        ) : density === 'md' ? (
          <IconBaselineDensityMedium />
        ) : (
          <IconBaselineDensityLarge />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
