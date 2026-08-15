import { useEffect, useRef } from 'react'
import { MarketFeedController } from './market-feed-controller'

export function useMarketFeedController(): MarketFeedController {
  'use no memo'
  const controllerRef = useRef<MarketFeedController | null>(null)
  controllerRef.current ??= new MarketFeedController()
  const controller = controllerRef.current

  useEffect(() => controller.start(), [controller])

  return controller
}

