import {type SparkBurstProps} from './SparkBurst.shared'

/**
 * Sparkable ships on the web only, so the burst lives in SparkBurst.web.tsx.
 * This version keeps the iOS and Android type checks passing.
 */
export function SparkBurst({children}: SparkBurstProps) {
  return <>{children}</>
}
