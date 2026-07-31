import { createSignal } from 'solid-js'
import { useStyles } from '../styles/use-styles'
import type { JSX } from 'solid-js'

const DEFAULT_LEFT_PERCENT = 50
const MIN_PANEL_PERCENT = 15
const MAX_PANEL_PERCENT = 85

interface ResizableSplitProps {
  left: JSX.Element
  right: JSX.Element
}

export function ResizableSplit(props: ResizableSplitProps) {
  const styles = useStyles()
  const [leftPercent, setLeftPercent] = createSignal(DEFAULT_LEFT_PERCENT)

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()

    const onMouseMove = (moveEvent: MouseEvent) => {
      const container = (e.target as HTMLElement).parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = moveEvent.clientX - rect.left
      const percent = Math.max(
        MIN_PANEL_PERCENT,
        Math.min(MAX_PANEL_PERCENT, (x / rect.width) * 100),
      )
      setLeftPercent(percent)
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
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPercent()}
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
