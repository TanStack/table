import { createSignal } from 'solid-js'
import { useStyles } from '../styles/use-styles'
import type { JSX } from 'solid-js'

const DEFAULT_LEFT_PERCENT = 33.33
const DEFAULT_MIDDLE_PERCENT = 33.33
const MIN_PANEL_PERCENT = 10
const MAX_PANEL_PERCENT = 80

interface ThreeWayResizableSplitProps {
  left: JSX.Element
  middle: JSX.Element
  right: JSX.Element
}

export function ThreeWayResizableSplit(props: ThreeWayResizableSplitProps) {
  const styles = useStyles()
  const [leftPercent, setLeftPercent] = createSignal(DEFAULT_LEFT_PERCENT)
  const [middlePercent, setMiddlePercent] = createSignal(DEFAULT_MIDDLE_PERCENT)

  const makeDragHandler =
    (which: 'left' | 'right'): ((e: MouseEvent) => void) =>
    (e) => {
      e.preventDefault()
      const handleEl = e.currentTarget as HTMLElement
      const container = handleEl.parentElement
      if (!container) return

      const startLeft = leftPercent()
      const startMiddle = middlePercent()

      const onMouseMove = (moveEvent: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const x = moveEvent.clientX - rect.left
        const percent = (x / rect.width) * 100

        if (which === 'left') {
          // Left handle: resizes left vs middle; right stays fixed.
          const clamped = Math.max(
            MIN_PANEL_PERCENT,
            Math.min(
              startLeft + startMiddle - MIN_PANEL_PERCENT,
              Math.min(MAX_PANEL_PERCENT, percent),
            ),
          )
          setLeftPercent(clamped)
          setMiddlePercent(startLeft + startMiddle - clamped)
        } else {
          // Right handle: resizes middle vs right; left stays fixed.
          const newMiddle = Math.max(
            MIN_PANEL_PERCENT,
            Math.min(MAX_PANEL_PERCENT, percent - startLeft),
          )
          setMiddlePercent(newMiddle)
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

  return (
    <div class={styles().resizableSplitContainer}>
      <div
        class={`${styles().section} ${styles().featuresSection}`}
        style={{ flex: `0 0 ${leftPercent()}%` }}
      >
        {props.left}
      </div>
      <div
        class={styles().resizeHandle}
        onMouseDown={makeDragHandler('left')}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPercent()}
        aria-valuemin={MIN_PANEL_PERCENT}
        aria-valuemax={MAX_PANEL_PERCENT}
      />
      <div
        class={`${styles().section} ${styles().featuresSection}`}
        style={{ flex: `0 0 ${middlePercent()}%` }}
      >
        {props.middle}
      </div>
      <div
        class={styles().resizeHandle}
        onMouseDown={makeDragHandler('right')}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPercent() + middlePercent()}
        aria-valuemin={MIN_PANEL_PERCENT}
        aria-valuemax={MAX_PANEL_PERCENT}
      />
      <div
        class={`${styles().section} ${styles().featuresSection}`}
        style={{ flex: '1 1 0' }}
      >
        {props.right}
      </div>
    </div>
  )
}
