import {useEffect, useRef, useState} from 'react'
import {Image, Pressable, useWindowDimensions, View} from 'react-native'

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

export type SparkReaction =
  | 'insight'
  | 'compassion'
  | 'joy'
  | 'inspiration'
  | 'hope'
  | 'respect'

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

const VIEWPORT_GUTTER = 16
const DESKTOP_MENU_WIDTH = 408

export function SparkReactionPicker({
  children,
  dismissKey,
  openKey,
  openOnTouch: _openOnTouch,
  onOpen,
  onSelect,
  selectedReaction,
  onVisibilityChange,
}: {
  children: React.ReactNode
  dismissKey?: number
  openKey?: number
  openOnTouch?: boolean
  onOpen?: () => void
  onSelect: (reaction: SparkReaction) => void
  selectedReaction?: SparkReaction
  onVisibilityChange?: (visible: boolean) => void
}) {
  const t = useTheme()
  const {width: viewportWidth} = useWindowDimensions()
  const [visible, setVisible] = useState(false)
  const previousOpenKey = useRef(openKey)
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
  const iconSize = compact ? Math.min(30, itemWidth - 14) : 34
  const labelSize = compact
    ? Math.max(7, Math.min(10, (itemWidth - 6) / 6.1))
    : 10

  useEffect(() => {
    if (openKey !== previousOpenKey.current) {
      previousOpenKey.current = openKey
      if (!visible) onOpen?.()
      setVisible(true)
    }
  }, [onOpen, openKey, visible])

  useEffect(() => {
    setVisible(false)
  }, [dismissKey])

  useEffect(() => {
    onVisibilityChange?.(visible)
  }, [onVisibilityChange, visible])

  return (
    <View
      style={{position: 'relative', zIndex: visible ? 1001 : 0}}
      // @ts-ignore web-only hover interaction
      onMouseEnter={() => {
        if (!visible) onOpen?.()
        setVisible(true)
      }}
      // @ts-ignore web-only hover interaction
      onMouseLeave={() => setVisible(false)}>
      {visible && (
        <View
          style={[
            a.flex_row,
            a.align_center,
            {
              position: 'absolute',
              bottom: '100%',
              left: -12,
              zIndex: 1002,
              elevation: 16,
              paddingBottom: 8,
            },
          ]}>
          <View
            style={[
              a.flex_row,
              a.align_center,
              {
                width: menuWidth,
                gap: 4,
                paddingHorizontal: compact ? 4 : 8,
                paddingVertical: 8,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: t.palette.contrast_100,
                backgroundColor: t.palette.white,
              },
              web({
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.18)',
              }),
            ]}>
            {REACTIONS.map(reaction => {
              const selected = selectedReaction === reaction.id
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
                      minHeight: compact ? 54 : 62,
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
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
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
                </Pressable>
              )
            })}
          </View>
        </View>
      )}
      {children}
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
