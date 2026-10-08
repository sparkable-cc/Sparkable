import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Image, Pressable, useWindowDimensions, View} from 'react-native'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import {
  type ReactionCounts,
  type ReactionType,
} from '@sparkable/prosocial-contract'
import {createPortal} from 'react-dom'

import {atoms as a, useTheme, web} from '#/alf'
import {Text} from '#/components/Typography'
// @ts-ignore bundled image asset
import compassionIcon from '../../../assets/images/reactions/compassion.png'
// @ts-ignore bundled image asset
import hopeIcon from '../../../assets/images/reactions/hope.png'
// @ts-ignore bundled image asset
import insightIcon from '../../../assets/images/reactions/insight.png'
// @ts-ignore bundled image asset
import inspirationIcon from '../../../assets/images/reactions/inspiration.png'
// @ts-ignore bundled image asset
import joyIcon from '../../../assets/images/reactions/joy.png'
// @ts-ignore bundled image asset
import respectIcon from '../../../assets/images/reactions/respect.png'

export type SparkReaction = ReactionType

const REACTIONS: {
  id: SparkReaction
  label: string
  icon: number
}[] = [
  {id: 'insight', label: 'Insight', icon: insightIcon},
  {id: 'compassion', label: 'Compassion', icon: compassionIcon},
  {id: 'joy', label: 'Joy', icon: joyIcon},
  {id: 'inspiration', label: 'Inspiration', icon: inspirationIcon},
  {id: 'hope', label: 'Hope', icon: hopeIcon},
  {id: 'respect', label: 'Respect', icon: respectIcon},
]

const VIEWPORT_GUTTER = 8
const DESKTOP_MENU_WIDTH = 408

function getPointerType(event: unknown) {
  const pointerEvent = event as {
    pointerType?: string
    nativeEvent?: {pointerType?: string}
  }
  return pointerEvent.pointerType ?? pointerEvent.nativeEvent?.pointerType
}

export function SparkReactionPicker({
  children,
  dismissKey,
  openKey,
  openOnTouch,
  onOpen,
  onSelect,
  reactionCounts,
  selectedReaction,
  onVisibilityChange,
}: {
  children: React.ReactNode
  dismissKey?: number
  openKey?: number
  openOnTouch?: boolean
  onOpen?: () => void
  onSelect: (reaction: SparkReaction) => void
  reactionCounts?: ReactionCounts
  selectedReaction?: SparkReaction
  onVisibilityChange?: (visible: boolean) => void
}) {
  const t = useTheme()
  const {width: viewportWidth} = useWindowDimensions()
  const [visible, setVisible] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pressedPointerType = useRef<string | undefined>(undefined)
  const previousOpenKey = useRef(openKey)
  const {refs, floatingStyles, update} = useFloating({
    placement: 'top-start',
    strategy: 'fixed',
    middleware: [
      offset(8),
      flip({padding: VIEWPORT_GUTTER}),
      shift({padding: VIEWPORT_GUTTER}),
    ],
    whileElementsMounted: autoUpdate,
  })

  const menuWidth = Math.min(
    DESKTOP_MENU_WIDTH,
    Math.max(0, viewportWidth - VIEWPORT_GUTTER * 2),
  )
  const compact = menuWidth < DESKTOP_MENU_WIDTH
  const horizontalChrome = compact ? 8 : 36
  const itemWidth = Math.max(
    32,
    (menuWidth - horizontalChrome) / REACTIONS.length,
  )
  const iconSize = compact ? Math.min(30, itemWidth - 16) : 34
  const labelSize = compact
    ? Math.max(7, Math.min(10, (itemWidth - 6) / 6.1))
    : 10

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const show = useCallback(() => {
    cancelClose()
    setVisible(current => {
      if (!current) onOpen?.()
      return true
    })
  }, [cancelClose, onOpen])

  useEffect(() => {
    if (openKey !== previousOpenKey.current) {
      previousOpenKey.current = openKey
      show()
    }
  }, [openKey, show])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setVisible(false), 100)
  }, [cancelClose])

  useEffect(() => {
    setVisible(false)
  }, [dismissKey])

  useEffect(() => {
    onVisibilityChange?.(visible)
  }, [onVisibilityChange, visible])

  useEffect(() => {
    if (visible) void update()
  }, [menuWidth, update, visible])

  useEffect(() => {
    if (!visible) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target
      const reference = refs.reference.current
      const floating = refs.floating.current

      if (
        target instanceof Node &&
        ((reference instanceof Element && reference.contains(target)) ||
          (floating instanceof Element && floating.contains(target)))
      ) {
        return
      }
      setVisible(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [refs.floating, refs.reference, visible])

  useEffect(() => cancelClose, [cancelClose])

  const menu = useMemo(
    () => (
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          width: menuWidth,
          maxWidth: `calc(100vw - ${VIEWPORT_GUTTER * 2}px)`,
          zIndex: 10000,
        }}
        onPointerEnter={event => {
          if (getPointerType(event) === 'mouse') show()
        }}
        onPointerLeave={event => {
          if (getPointerType(event) === 'mouse') scheduleClose()
        }}>
        <View
          style={[
            a.flex_row,
            a.align_center,
            {
              width: '100%',
              gap: compact ? 0 : 4,
              paddingHorizontal: compact ? 4 : 8,
              paddingVertical: compact ? 6 : 8,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: t.palette.contrast_100,
              backgroundColor: t.palette.white,
            },
            web({boxShadow: '0 5px 20px rgba(0, 0, 0, 0.18)'}),
          ]}>
          {REACTIONS.map(reaction => {
            const selected = selectedReaction === reaction.id
            const count = reactionCounts?.[reaction.id]
            return (
              <Pressable
                key={reaction.id}
                accessibilityRole="button"
                accessibilityLabel={
                  selected
                    ? `Remove ${reaction.label} reaction`
                    : `React with ${reaction.label}`
                }
                accessibilityHint={
                  selected
                    ? 'Removes this reaction from the post'
                    : 'Selects this reaction for the post'
                }
                accessibilityState={{selected}}
                onPress={evt => {
                  evt.stopPropagation()
                  onSelect(reaction.id)
                  setVisible(false)
                }}
                style={({hovered}) => [
                  a.align_center,
                  a.justify_center,
                  {
                    width: itemWidth,
                    minWidth: 0,
                    minHeight: compact ? 68 : 76,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selected
                      ? t.palette.primary_500
                      : 'transparent',
                    backgroundColor: selected
                      ? t.palette.primary_50
                      : hovered
                        ? t.palette.contrast_25
                        : 'transparent',
                  },
                ]}>
                <Image
                  source={reaction.icon}
                  accessibilityIgnoresInvertColors
                  style={{
                    width: iconSize,
                    height: iconSize,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    a.text_xs,
                    a.pt_2xs,
                    {
                      color: selected
                        ? t.palette.primary_700
                        : t.palette.contrast_700,
                      fontSize: labelSize,
                      maxWidth: itemWidth - 2,
                    },
                  ]}>
                  {reaction.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: selected
                      ? t.palette.primary_700
                      : t.palette.contrast_500,
                    fontSize: compact ? 10 : 11,
                    marginTop: 2,
                    maxWidth: itemWidth - 2,
                  }}>
                  {count === undefined ? '–' : count.toLocaleString()}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </div>
    ),
    [
      compact,
      floatingStyles,
      iconSize,
      itemWidth,
      labelSize,
      menuWidth,
      onSelect,
      reactionCounts,
      selectedReaction,
      refs.setFloating,
      scheduleClose,
      show,
      t,
    ],
  )

  return (
    <View
      // @ts-ignore react-native-web provides the underlying HTMLElement
      ref={refs.setReference}
      style={{position: 'relative'}}
      // @ts-ignore web-only pointer interaction
      onPointerEnter={event => {
        if (getPointerType(event) === 'mouse') show()
      }}
      // @ts-ignore web-only pointer interaction
      onPointerLeave={event => {
        if (getPointerType(event) === 'mouse') scheduleClose()
      }}
      // @ts-ignore web-only pointer interaction
      onPointerDown={event => {
        pressedPointerType.current = getPointerType(event)
      }}
      // Let the nested Spark button finish its click before mounting the
      // portalled menu. Mounting it on pointer-down interrupts the first tap
      // in some mobile browsers, forcing users to tap twice to Spark.
      // @ts-ignore web-only click interaction
      onClick={() => {
        const pointerType = pressedPointerType.current
        pressedPointerType.current = undefined
        if (openOnTouch && (pointerType === 'touch' || pointerType === 'pen')) {
          show()
        }
      }}>
      {children}
      {visible && createPortal(menu, document.body)}
    </View>
  )
}

export function SparkReactionIcon({reaction}: {reaction: SparkReaction}) {
  const source = REACTIONS.find(item => item.id === reaction)?.icon
  if (!source) return null

  return (
    <Image
      source={source}
      accessibilityIgnoresInvertColors
      style={{width: 20, height: 20, resizeMode: 'contain'}}
    />
  )
}
