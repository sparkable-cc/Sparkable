import {useState} from 'react'
import {Image, Pressable, View} from 'react-native'

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

export function SparkReactionPicker({
  children,
  onOpen,
  onSelect,
}: {
  children: React.ReactNode
  onOpen?: () => void
  onSelect: (reaction: SparkReaction) => void
}) {
  const t = useTheme()
  const [visible, setVisible] = useState(false)

  return (
    <View
      style={{position: 'relative'}}
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
              zIndex: 100,
              paddingBottom: 8,
            },
          ]}>
          <View
            style={[
              a.flex_row,
              a.align_center,
              {
                gap: 4,
                paddingHorizontal: 8,
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
            {REACTIONS.map(reaction => (
              <Pressable
                key={reaction.id}
                accessibilityRole="button"
                accessibilityLabel={`React with ${reaction.label}`}
                accessibilityHint="Selects this reaction for the post"
                onPress={evt => {
                  evt.stopPropagation()
                  onSelect(reaction.id)
                  setVisible(false)
                }}
                style={({hovered}) => [
                  a.align_center,
                  a.justify_center,
                  {
                    width: 62,
                    minHeight: 62,
                    borderRadius: 12,
                    backgroundColor: hovered
                      ? t.palette.contrast_25
                      : 'transparent',
                  },
                ]}>
                <Image
                  source={reaction.icon}
                  accessibilityIgnoresInvertColors
                  style={{width: 34, height: 34, resizeMode: 'contain'}}
                />
                <Text
                  style={[
                    a.text_xs,
                    a.pt_2xs,
                    {color: t.palette.contrast_700},
                  ]}>
                  {reaction.label}
                </Text>
              </Pressable>
            ))}
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
