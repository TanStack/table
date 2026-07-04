export interface VirtualItem {
  index: number
  start: number
  size: number
  end: number
}

export interface VirtualizerOptions {
  count: number
  getScrollElement: () => HTMLElement | null
  estimateSize: (index: number) => number
  overscan?: number
  onChange?: (virtualizer: Virtualizer) => void
}

export class Virtualizer {
  private options: VirtualizerOptions
  private scrollTop = 0
  private clientHeight = 0
  private scrollElement: HTMLElement | null = null
  private cleanupListener: (() => void) | null = null

  constructor(options: VirtualizerOptions) {
    this.options = { overscan: 5, ...options }
    this.init()
  }

  private init() {
    const bindScroll = () => {
      const el = this.options.getScrollElement()
      if (!el) return false
      this.scrollElement = el
      this.scrollTop = el.scrollTop
      this.clientHeight = el.clientHeight

      const handleScroll = () => {
        if (!this.scrollElement) return
        const currentScrollTop = this.scrollElement.scrollTop
        const currentClientHeight = this.scrollElement.clientHeight
        if (
          currentScrollTop !== this.scrollTop ||
          currentClientHeight !== this.clientHeight
        ) {
          this.scrollTop = currentScrollTop
          this.clientHeight = currentClientHeight
          if (this.options.onChange) {
            this.options.onChange(this)
          }
        }
      }

      el.addEventListener('scroll', handleScroll, { passive: true })

      const ro = new ResizeObserver(() => {
        handleScroll()
      })
      ro.observe(el)

      this.cleanupListener = () => {
        el.removeEventListener('scroll', handleScroll)
        ro.disconnect()
      }
      return true
    }

    if (!bindScroll()) {
      const interval = setInterval(() => {
        if (bindScroll()) {
          clearInterval(interval)
        }
      }, 50)

      setTimeout(() => clearInterval(interval), 5000)
    }
  }

  public updateOptions(newOptions: Partial<VirtualizerOptions>) {
    this.options = { ...this.options, ...newOptions }
    const el = this.options.getScrollElement()
    if (el && el !== this.scrollElement) {
      this.destroy()
      this.init()
    }
  }

  public destroy() {
    if (this.cleanupListener) {
      this.cleanupListener()
      this.cleanupListener = null
    }
    this.scrollElement = null
  }

  private getOffsets(): Array<number> {
    const offsets: Array<number> = []
    let currentOffset = 0
    for (let i = 0; i < this.options.count; i++) {
      offsets.push(currentOffset)
      currentOffset += this.options.estimateSize(i)
    }
    return offsets
  }

  public getTotalSize(): number {
    let total = 0
    for (let i = 0; i < this.options.count; i++) {
      total += this.options.estimateSize(i)
    }
    return total
  }

  public getVirtualItems(): Array<VirtualItem> {
    const count = this.options.count
    if (count === 0) return []

    const overscan = this.options.overscan ?? 5
    const offsets = this.getOffsets()

    let startIndex = 0
    let endIndex = 0

    let low = 0
    let high = count - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const start = offsets[mid]
      const end = start + this.options.estimateSize(mid)

      if (start <= this.scrollTop && end >= this.scrollTop) {
        startIndex = mid
        break
      } else if (start > this.scrollTop) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    if (low > high) {
      startIndex = Math.max(0, Math.min(count - 1, low))
    }

    const viewBottom = this.scrollTop + this.clientHeight
    low = startIndex
    high = count - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const start = offsets[mid]
      const end = start + this.options.estimateSize(mid)

      if (start <= viewBottom && end >= viewBottom) {
        endIndex = mid
        break
      } else if (start > viewBottom) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    if (low > high) {
      endIndex = Math.max(startIndex, Math.min(count - 1, high))
    }

    const activeStart = Math.max(0, startIndex - overscan)
    const activeEnd = Math.min(count - 1, endIndex + overscan)

    const items: Array<VirtualItem> = []
    for (let i = activeStart; i <= activeEnd; i++) {
      items.push({
        index: i,
        start: offsets[i],
        size: this.options.estimateSize(i),
        end: offsets[i] + this.options.estimateSize(i),
      })
    }

    return items
  }
}
