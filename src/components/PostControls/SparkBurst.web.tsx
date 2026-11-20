import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {View} from 'react-native'
import {useReducedMotion} from 'react-native-reanimated'

import {
  getSparkBurst,
  SPARK_BURST_COLORS,
  SPARK_BURST_ICON_MS,
  SPARK_BURST_PIECE_EASING,
  SPARK_BURST_PIECE_MS,
  SPARK_BURST_PIECES,
  SPARK_BURST_RING_MS,
  SPARK_BURST_TOTAL_MS,
  type SparkBurstProps,
} from './SparkBurst.shared'
import {type SparkReaction, SparkReactionIcon} from './SparkReactionPicker'

const RING_KEYFRAMES = [
  {opacity: 0.5, transform: 'scale(0.6)'},
  {opacity: 0, transform: 'scale(2)'},
]

const ICON_KEYFRAMES = [
  {offset: 0, opacity: 0, transform: 'translate(0px, 0px) scale(0.4)'},
  {offset: 0.25, opacity: 1},
  {offset: 1, opacity: 0, transform: 'translate(0px, -36px) scale(1)'},
]

function pieceKeyframes({dx, dy, rotate}: (typeof SPARK_BURST_PIECES)[number]) {
  return [
    {
      offset: 0,
      opacity: 0,
      transform: 'translate(0px, 0px) rotate(0deg) scale(0.5)',
    },
    {offset: 0.12, opacity: 1},
    {
      offset: 0.45,
      transform: `translate(${dx}px, ${dy}px) rotate(${rotate / 2}deg) scale(1)`,
    },
    {
      offset: 1,
      opacity: 0,
      transform: `translate(${dx * 1.2}px, ${dy + 38}px) rotate(${rotate}deg) scale(0.9)`,
    },
  ]
}

/**
 * Wraps the Spark icon and pops a small burst of confetti around it when the
 * viewer sparks the post or picks a reaction. Hidden from screen readers,
 * never blocks taps, and skipped entirely when reduced motion is on.
 */
export function SparkBurst({
  sparked,
  reaction,
  hasBeenToggled,
  children,
}: SparkBurstProps) {
  const reducedMotion = useReducedMotion()
  const previous = useRef({sparked, reaction})
  const burstCount = useRef(0)
  const [burst, setBurst] = useState<{
    id: number
    reaction: SparkReaction | undefined
  }>()

  useEffect(() => {
    const next = getSparkBurst(
      previous.current,
      {sparked, reaction},
      hasBeenToggled,
    )
    previous.current = {sparked, reaction}
    if (!next || reducedMotion) return
    burstCount.current += 1
    setBurst({id: burstCount.current, reaction: next.reaction})
  }, [sparked, reaction, hasBeenToggled, reducedMotion])

  useEffect(() => {
    if (!burst) return
    const timeout = setTimeout(() => setBurst(undefined), SPARK_BURST_TOTAL_MS)
    return () => clearTimeout(timeout)
  }, [burst])

  return (
    <View>
      {children}
      {burst && <BurstLayer key={burst.id} reaction={burst.reaction} />}
    </View>
  )
}

/**
 * Mounted only while a burst plays, so idle posts carry no extra elements. A
 * new burst remounts it, restarting every animation cleanly.
 */
function BurstLayer({reaction}: {reaction: SparkReaction | undefined}) {
  const ringRef = useRef<HTMLDivElement>(null)
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([])
  const iconRef = useRef<HTMLDivElement>(null)

  // Before paint, so the pieces never show unanimated
  useLayoutEffect(() => {
    ringRef.current?.animate?.(RING_KEYFRAMES, {
      duration: SPARK_BURST_RING_MS,
      easing: 'ease-out',
      fill: 'backwards',
    })
    SPARK_BURST_PIECES.forEach((piece, index) => {
      pieceRefs.current[index]?.animate?.(pieceKeyframes(piece), {
        duration: SPARK_BURST_PIECE_MS,
        delay: piece.delay,
        easing: SPARK_BURST_PIECE_EASING,
        fill: 'backwards',
      })
    })
    iconRef.current?.animate?.(ICON_KEYFRAMES, {
      duration: SPARK_BURST_ICON_MS,
      easing: 'ease-out',
      fill: 'backwards',
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      data-testid="sparkBurst"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}>
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          left: -13,
          top: -13,
          width: 26,
          height: 26,
          boxSizing: 'border-box',
          borderRadius: 999,
          border: `2px solid ${SPARK_BURST_COLORS[0]}`,
          opacity: 0,
        }}
      />
      {SPARK_BURST_PIECES.map((piece, index) => {
        const strip = piece.shape === 'strip'
        const width = strip ? 4 : 5
        const height = strip ? 8 : 5
        return (
          <div
            key={index}
            ref={element => {
              pieceRefs.current[index] = element
            }}
            style={{
              position: 'absolute',
              left: -width / 2,
              top: -height / 2,
              width,
              height,
              borderRadius: strip ? 1 : 999,
              backgroundColor:
                SPARK_BURST_COLORS[index % SPARK_BURST_COLORS.length],
              opacity: 0,
            }}
          />
        )
      })}
      {reaction && (
        <div
          ref={iconRef}
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            opacity: 0,
          }}>
          {/* The picker's 20px artwork, shown at 16px */}
          <div style={{transform: 'scale(0.8)'}}>
            <SparkReactionIcon reaction={reaction} />
          </div>
        </div>
      )}
    </div>
  )
}
