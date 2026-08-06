import { useEffect, useRef } from 'react'
import { TradingBenchmarkController } from './trading-benchmark-controller'

export function useTradingBenchmarkController() {
  'use no memo'
  const controllerRef = useRef<TradingBenchmarkController | null>(null)
  controllerRef.current ??= new TradingBenchmarkController()
  const controller = controllerRef.current

  useEffect(() => controller.start(), [controller])

  return controller
}

export type { TradingBenchmarkController } from './trading-benchmark-controller'
