import { useEffect } from 'react'
import { markBenchmarkAction } from './benchmark-monitor'
import type { ScrollStressMode } from './benchmark-monitor'
import type { TradingBenchmarkController } from './trading-benchmark-controller'

export function useTableBenchmark(
  controller: TradingBenchmarkController,
  scrollStressMode: ScrollStressMode,
): void {
  'use no memo'
  useEffect(() => {
    const tableBody = document.querySelector(
      '.market-panel [data-trading-table] tbody',
    )
    if (!tableBody) {
      return
    }

    controller.monitor.resetDomMutations()
    const observer = new MutationObserver((records) => {
      controller.monitor.recordDomMutations(records.length)
    })
    observer.observe(tableBody, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [controller])

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '.market-panel [data-trading-table]',
    )
    if (!scrollContainer) {
      return
    }

    if (scrollStressMode === 'off') {
      scrollContainer.scrollTop = 0
      scrollContainer.scrollLeft = 0
      return
    }

    markBenchmarkAction('scroll-start', {
      mode: scrollStressMode,
    })
    const runtime = {
      animationFrameId: 0,
      previousFrameAt: performance.now(),
      verticalDirection: 1,
      horizontalDirection: 1,
    }
    const scrollFrame = (now: number): void => {
      const rawElapsed = now - runtime.previousFrameAt
      const elapsed = Math.min(rawElapsed, 50)
      runtime.previousFrameAt = now
      const previousTop = scrollContainer.scrollTop
      const previousLeft = scrollContainer.scrollLeft

      if (scrollStressMode === 'vertical' || scrollStressMode === 'both') {
        const maxTop =
          scrollContainer.scrollHeight - scrollContainer.clientHeight
        const candidateTop =
          scrollContainer.scrollTop +
          (runtime.verticalDirection * (700 * elapsed)) / 1_000
        const nextTop = Math.max(0, Math.min(maxTop, candidateTop))
        if (maxTop > 0) {
          scrollContainer.scrollTop = nextTop
          if (candidateTop >= maxTop || candidateTop <= 0) {
            runtime.verticalDirection *= -1
          }
        }
      }

      if (scrollStressMode === 'horizontal' || scrollStressMode === 'both') {
        const maxLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        const candidateLeft =
          scrollContainer.scrollLeft +
          (runtime.horizontalDirection * (420 * elapsed)) / 1_000
        const nextLeft = Math.max(0, Math.min(maxLeft, candidateLeft))
        if (maxLeft > 0) {
          scrollContainer.scrollLeft = nextLeft
          if (candidateLeft >= maxLeft || candidateLeft <= 0) {
            runtime.horizontalDirection *= -1
          }
        }
      }

      const distance =
        Math.abs(scrollContainer.scrollTop - previousTop) +
        Math.abs(scrollContainer.scrollLeft - previousLeft)
      controller.monitor.recordScrollFrame(distance, rawElapsed > 34)
      runtime.animationFrameId = requestAnimationFrame(scrollFrame)
    }

    runtime.animationFrameId = requestAnimationFrame(scrollFrame)
    return () => cancelAnimationFrame(runtime.animationFrameId)
  }, [controller, scrollStressMode])
}
