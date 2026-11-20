import {type SparkReaction} from './SparkReactionPicker'

export type SparkBurstProps = {
  /**
   * Whether the viewer has sparked the post.
   */
  sparked: boolean
  /**
   * The reaction this button itself just set, not the one loaded from the
   * server, so a post's existing reaction never plays the burst on load.
   * `null` means a plain Spark.
   */
  reaction: SparkReaction | null | undefined
  /**
   * Whether the viewer has tapped this button, as for `AnimatedLikeIcon`. It
   * keeps other copies of the same post (sharing its cached state) quiet.
   */
  hasBeenToggled: boolean
  children: React.ReactNode
}

/**
 * The burst always uses these brand colors, whatever was tapped. The ring is
 * the first; confetti pieces cycle through all three.
 */
export const SPARK_BURST_COLORS = ['#4153f5', '#fa7ac4', '#cdf971'] as const

export const SPARK_BURST_RING_MS = 500
export const SPARK_BURST_PIECE_MS = 850
export const SPARK_BURST_PIECE_EASING = 'cubic-bezier(.2,.7,.4,1)'
export const SPARK_BURST_ICON_MS = 680

/**
 * Removes the burst once every piece has finished. The longest piece is its
 * 80ms delay plus 850ms.
 */
export const SPARK_BURST_TOTAL_MS = 950

/**
 * Ten confetti pieces: strips are 4x8px, dots 5x5px. Each flies 15-45px up and
 * sideways (`dx`, `dy`), spins `rotate` degrees, then drifts 38px down.
 */
export const SPARK_BURST_PIECES: {
  shape: 'strip' | 'dot'
  dx: number
  dy: number
  rotate: number
  delay: number
}[] = [
  {shape: 'strip', dx: -30, dy: -34, rotate: -160, delay: 0},
  {shape: 'dot', dx: -14, dy: -44, rotate: 120, delay: 30},
  {shape: 'strip', dx: 4, dy: -45, rotate: 140, delay: 50},
  {shape: 'dot', dx: 20, dy: -40, rotate: -100, delay: 20},
  {shape: 'strip', dx: 34, dy: -26, rotate: 200, delay: 60},
  {shape: 'dot', dx: -38, dy: -15, rotate: 150, delay: 40},
  {shape: 'strip', dx: 40, dy: -15, rotate: -120, delay: 10},
  {shape: 'strip', dx: -22, dy: -26, rotate: 90, delay: 70},
  {shape: 'dot', dx: 12, dy: -30, rotate: -90, delay: 80},
  {shape: 'strip', dx: 26, dy: -44, rotate: -200, delay: 30},
]

type BurstState = Pick<SparkBurstProps, 'sparked' | 'reaction'>

/**
 * Decides whether a change to the button should play the burst, and with
 * which reaction icon. Returns undefined for no burst.
 *
 * - A new Spark plays it, but only after the viewer tapped this button.
 * - Picking a reaction on a sparked post plays it with that reaction's icon.
 * - Removing a Spark, or clearing a reaction, never plays it.
 */
export function getSparkBurst(
  previous: BurstState,
  next: BurstState,
  hasBeenToggled: boolean,
): {reaction: SparkReaction | undefined} | undefined {
  if (!next.sparked) return undefined
  if (!previous.sparked) {
    return hasBeenToggled ? {reaction: next.reaction ?? undefined} : undefined
  }
  if (next.reaction && next.reaction !== previous.reaction) {
    return {reaction: next.reaction}
  }
  return undefined
}
