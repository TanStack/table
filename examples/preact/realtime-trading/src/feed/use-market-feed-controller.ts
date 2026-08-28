import { useEffect, useState } from 'preact/hooks'
import { MarketFeedController } from './market-feed-controller'

export function useMarketFeedController(): MarketFeedController {
  const [controller] = useState(() => new MarketFeedController())

  useEffect(() => controller.start(), [controller])

  return controller
}
