import {useEffect, useState} from 'react'
import {type LayoutChangeEvent, View} from 'react-native'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useLingui} from '@lingui/react/macro'

import {useMinimalShellFabTransform} from '#/lib/hooks/useMinimalShellTransform'
import {clamp} from '#/lib/numbers'
import {useSession} from '#/state/session'
import {Logo} from '#/view/icons/Logo'
import {atoms as a, useAlf, useBreakpoints, useTheme, web} from '#/alf'
import {Button, ButtonIcon, ButtonText} from '#/components/Button'
import {ArrowOutOfBox_Stroke2_Corner0_Rounded as ShareIcon} from '#/components/icons/ArrowOutOfBox'
import {DotGrid3x1_Stroke2_Corner0_Rounded as MoreIcon} from '#/components/icons/DotGrid'
import {PlusLarge_Stroke2_Corner0_Rounded as PlusIcon} from '#/components/icons/Plus'
import {TimesLarge_Stroke2_Corner0_Rounded as XIcon} from '#/components/icons/Times'
import * as Toast from '#/components/Toast'
import {Text} from '#/components/Typography'
import {
  IS_FORCED,
  IS_STANDALONE,
  PLATFORM,
  promptInstall,
  trackWhenReady,
  useCanInstall,
} from './browser'
import {
  getIosSteps,
  getPromptMethod,
  isPromptDue,
  type PromptMethod,
} from './rules'
import {
  claimOpenedTracking,
  countVisit,
  markShownThisSession,
  readRecord,
  updateRecord,
  wasShownThisSession,
} from './storage'

/**
 * Time on the home feed, counted across the visit, before the card appears.
 */
const SHOW_AFTER_MS = 30_000
const TICK_MS = 1_000

countVisit()
if (IS_STANDALONE && claimOpenedTracking()) {
  trackWhenReady('app:openedFromHomeScreen', {platform: PLATFORM.os})
}

/**
 * Suggests adding Sparkable to the home screen on phones and tablets, and
 * keeps the browser's theme color in step with the app's theme. Mounted once
 * in the web shell. See README.md in this folder.
 */
export function HomeScreenPrompt() {
  return (
    <>
      <ThemeColorSync />
      <PromptController />
    </>
  )
}

/**
 * The browser's toolbar, and the status bar of the home screen app, use the
 * `theme-color` meta tag. Match it to the app's background in every theme.
 */
function ThemeColorSync() {
  const t = useTheme()
  const color = t.atoms.bg.backgroundColor

  useEffect(() => {
    if (typeof color !== 'string') return
    let metas = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    if (metas.length === 0) {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)
      metas = document.querySelectorAll('meta[name="theme-color"]')
    }
    metas.forEach(meta => meta.setAttribute('content', color))
  }, [color])

  return null
}

function isOnHomeFeed() {
  return window.location.pathname === '/'
}

/**
 * Dialogs, the composer, onboarding and similar screens all mark themselves as
 * dialogs. The card never appears on top of one.
 */
function isOverlayOpen() {
  return document.querySelector('[role="dialog"], [aria-modal="true"]') !== null
}

function PromptController() {
  const {t: l} = useLingui()
  const {hasSession} = useSession()
  const canInstall = useCanInstall()
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'card' | 'steps'>('card')
  /*
   * Kept from the moment the card appears. Opening Chrome's install window
   * uses up its event, which would otherwise change the method mid-flow.
   */
  const [shownMethod, setShownMethod] = useState<PromptMethod>()

  /*
   * The testing switch also shows steps where the rules would stay quiet (a
   * computer, or Chromium before it offers the install window), but never in
   * an app's built-in browser or from the home screen, where it can't work.
   */
  const forcedMethod: PromptMethod | undefined =
    IS_FORCED && !PLATFORM.inAppBrowser && !IS_STANDALONE
      ? PLATFORM.os === 'ios'
        ? 'ios-steps'
        : 'android-steps'
      : undefined
  const method: PromptMethod | undefined =
    getPromptMethod({
      platform: PLATFORM,
      standalone: IS_STANDALONE,
      canInstall,
    }) ?? forcedMethod

  const eligible =
    method !== undefined &&
    (IS_FORCED ||
      (!wasShownThisSession() &&
        isPromptDue({
          record: readRecord(),
          signedIn: hasSession,
          now: Date.now(),
        })))

  useEffect(() => {
    if (!eligible || !method || visible) return
    let onHomeMs = 0
    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible' || !isOnHomeFeed()) return
      onHomeMs += TICK_MS
      if (onHomeMs < (IS_FORCED ? TICK_MS : SHOW_AFTER_MS)) return
      if (isOverlayOpen()) return
      clearInterval(interval)
      markShownThisSession()
      trackWhenReady('homeScreenPrompt:shown', {method})
      setShownMethod(method)
      setVisible(true)
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [eligible, method, visible])

  useEffect(() => {
    if (!visible) return
    // Leaving the home feed ends it for this visit
    const interval = setInterval(() => {
      if (!isOnHomeFeed()) setVisible(false)
    }, 500)
    return () => clearInterval(interval)
  }, [visible])

  if (!visible || !shownMethod) return null

  const close = () => {
    setVisible(false)
    setMode('card')
  }

  const onDismiss = () => {
    updateRecord(record => ({
      dismissCount: record.dismissCount + 1,
      lastDismissedAt: Date.now(),
    }))
    trackWhenReady('homeScreenPrompt:dismissed', {method: shownMethod})
    close()
  }

  const onAdd = async () => {
    trackWhenReady('homeScreenPrompt:addPressed', {method: shownMethod})
    if (shownMethod !== 'install') {
      setMode('steps')
      return
    }
    const outcome = await promptInstall()
    trackWhenReady('homeScreenPrompt:installChoice', {outcome})
    if (outcome === 'accepted') {
      updateRecord(() => ({done: true}))
      close()
      Toast.show(l`Sparkable is on your home screen`, {type: 'success'})
    } else if (outcome === 'dismissed') {
      onDismiss()
    } else {
      // The install window failed to open, so fall back to the menu steps
      setShownMethod('android-steps')
      setMode('steps')
    }
  }

  const onStepsDone = () => {
    updateRecord(() => ({done: true}))
    trackWhenReady('homeScreenPrompt:stepsDone', {method: shownMethod})
    close()
  }

  return (
    <PromptCard
      method={shownMethod}
      mode={mode}
      onAdd={() => void onAdd()}
      onDismiss={onDismiss}
      onStepsDone={onStepsDone}
    />
  )
}

function PromptCard({
  method,
  mode,
  onAdd,
  onDismiss,
  onStepsDone,
}: {
  method: PromptMethod
  mode: 'card' | 'steps'
  onAdd: () => void
  onDismiss: () => void
  onStepsDone: () => void
}) {
  const {t: l} = useLingui()
  const t = useTheme()
  const {fonts} = useAlf()
  const insets = useSafeAreaInsets()
  const {gtMobile} = useBreakpoints()
  const fabTransform = useMinimalShellFabTransform()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  /*
   * Sits just above the floating compose button and moves with it when the
   * bottom bar hides, mirroring FABInner's position. Material guidance puts
   * snackbars above a FAB rather than over it.
   */
  const bottom = gtMobile
    ? 50 + 70 + 12
    : clamp(insets.bottom, 15, 60) + 15 + 56 + 12

  /*
   * Lets the browser scroll focused elements clear of the card, so nothing
   * ends up hidden behind it (WCAG 2.2, focus not obscured).
   */
  useEffect(() => {
    const root = document.documentElement
    root.style.scrollPaddingBottom = `${bottom + height + 44}px`
    return () => {
      root.style.scrollPaddingBottom = ''
    }
  }, [bottom, height])

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width)
    setHeight(event.nativeEvent.layout.height)
  }

  const stacked = width < 360 || fonts.scaleMultiplier > 1
  const surface = t.name === 'light' ? t.atoms.bg : t.atoms.bg_contrast_25
  const title = l`Add Sparkable to your home screen`

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(150)}
      style={[
        web({position: 'fixed'}),
        a.align_center,
        {left: 12, right: 12, bottom, zIndex: 2},
        !gtMobile && fabTransform,
      ]}>
      <View
        role="region"
        aria-label={title}
        testID="homeScreenPrompt"
        onLayout={onLayout}
        style={[
          a.w_full,
          a.gap_md,
          a.py_md,
          a.pl_md,
          a.pr_xs,
          a.rounded_lg,
          a.border,
          surface,
          t.atoms.border_contrast_low,
          t.atoms.shadow_md,
          {maxWidth: 520},
        ]}>
        <View style={[a.flex_row, a.align_center, a.gap_md]}>
          <AppIcon />
          <View style={[a.flex_1, a.gap_2xs]}>
            <Text style={[a.text_md, a.font_bold, a.leading_tight]}>
              {title}
            </Text>
            {mode === 'card' && (
              <Text
                style={[
                  a.text_sm,
                  a.leading_snug,
                  t.atoms.text_contrast_medium,
                ]}>
                {l`It opens full screen, like an app, one tap away.`}
              </Text>
            )}
          </View>
          {mode === 'card' && !stacked && (
            <AddButton title={title} onPress={onAdd} />
          )}
          <Button
            label={l`Not now`}
            onPress={onDismiss}
            size="small"
            shape="round"
            color="secondary"
            variant="ghost"
            style={{width: 44, height: 44}}>
            <ButtonIcon icon={XIcon} />
          </Button>
        </View>

        {mode === 'card' && stacked && (
          <View style={[a.flex_row, a.pr_md, {paddingLeft: 44 + 12}]}>
            <AddButton title={title} onPress={onAdd} />
          </View>
        )}

        {mode === 'steps' && <Steps method={method} onDone={onStepsDone} />}
      </View>
    </Animated.View>
  )
}

function AppIcon() {
  const t = useTheme()
  return (
    <View
      style={[
        a.align_center,
        a.justify_center,
        a.border,
        t.atoms.border_contrast_low,
        {width: 44, height: 44, borderRadius: 11, backgroundColor: '#FFFFFF'},
      ]}>
      <Logo width={26} allowVariants={false} />
    </View>
  )
}

function AddButton({title, onPress}: {title: string; onPress: () => void}) {
  const {t: l} = useLingui()
  return (
    <Button
      label={title}
      onPress={onPress}
      size="small"
      color="primary"
      style={{minHeight: 44}}>
      <ButtonText>
        {l({
          message: 'Add',
          comment:
            'Button that adds Sparkable to the phone’s home screen, shown under the text “Add Sparkable to your home screen”',
        })}
      </ButtonText>
    </Button>
  )
}

function Steps({method, onDone}: {method: PromptMethod; onDone: () => void}) {
  const {t: l} = useLingui()
  const t = useTheme()
  const iconColor = t.atoms.text.color

  let steps: {text: string; icons?: React.ReactNode}[]
  if (method === 'ios-steps') {
    const {shareInMoreMenu, openAsWebAppSwitch} = getIosSteps(PLATFORM)
    steps = [
      shareInMoreMenu
        ? {
            text: l({
              message: 'Tap ••• in Safari, then Share',
              comment:
                'Step 1 of adding Sparkable to the iPhone home screen. ••• is Safari’s menu button; use Safari’s own name for “Share” in this language.',
            }),
            icons: (
              <>
                <MoreIcon size="sm" fill={iconColor} />
                <ShareIcon size="sm" fill={iconColor} />
              </>
            ),
          }
        : {
            text: l({
              message: 'Tap the Share button',
              comment:
                'Step 1 of adding Sparkable to the iPhone home screen. Use the browser’s own name for “Share” in this language.',
            }),
            icons: <ShareIcon size="sm" fill={iconColor} />,
          },
      {
        text: l({
          message: 'Choose “Add to Home Screen”',
          comment:
            'Step 2 on iPhone. Use Apple’s exact label for “Add to Home Screen” in this language.',
        }),
        icons: <PlusIcon size="sm" fill={iconColor} />,
      },
      openAsWebAppSwitch
        ? {
            text: l({
              message: 'Keep “Open as Web App” on, then tap “Add”',
              comment:
                'Step 3 on iPhone. Use Apple’s exact labels for “Open as Web App” and “Add” in this language.',
            }),
          }
        : {
            text: l({
              message: 'Tap “Add”',
              comment:
                'Step 3 on iPhone. Use Apple’s exact label for “Add” in this language.',
            }),
          },
    ]
  } else {
    steps = [
      {
        text: l({
          message: 'Open your browser’s menu',
          comment: 'Step 1 of adding Sparkable to the Android home screen',
        }),
        icons: (
          <View style={{transform: [{rotate: '90deg'}]}}>
            <MoreIcon size="sm" fill={iconColor} />
          </View>
        ),
      },
      {
        text: l({
          message: 'Choose “Add to Home screen” or “Install”',
          comment:
            'Step 2 on Android. Use the browser’s own labels in this language.',
        }),
        icons: <PlusIcon size="sm" fill={iconColor} />,
      },
    ]
  }

  return (
    <View style={[a.gap_md, a.pr_md]}>
      <View role="list" style={[a.gap_sm]}>
        {steps.map((step, index) => (
          <View
            key={index}
            role="listitem"
            style={[a.flex_row, a.align_center, a.gap_sm]}>
            <View
              style={[
                a.align_center,
                a.justify_center,
                a.rounded_full,
                t.atoms.bg_contrast_50,
                {width: 24, height: 24},
              ]}>
              <Text style={[a.text_xs, a.font_bold]}>{index + 1}</Text>
            </View>
            <Text style={[a.flex_1, a.text_sm, a.leading_snug]}>
              {step.text}
            </Text>
            {step.icons && (
              <View style={[a.flex_row, a.gap_xs]} aria-hidden>
                {step.icons}
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={[a.flex_row, a.flex_wrap, a.align_center, a.gap_sm]}>
        {method === 'ios-steps' && (
          <Text
            style={[
              a.flex_1,
              a.text_sm,
              a.leading_snug,
              t.atoms.text_contrast_medium,
              {minWidth: 160},
            ]}>
            {l`You’ll sign in once more in the new app.`}
          </Text>
        )}
        <Button
          label={l`Got it`}
          onPress={onDone}
          size="small"
          color="secondary"
          style={[a.ml_auto, {minHeight: 44}]}>
          <ButtonText>{l`Got it`}</ButtonText>
        </Button>
      </View>
    </View>
  )
}
