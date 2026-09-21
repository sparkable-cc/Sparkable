import * as env from '#/env'

type UmamiValue = string | number | boolean
type UmamiPayload = Record<string, UmamiValue>

type UmamiTracker = {
  track: (event: string, data?: UmamiPayload) => void
}

const EVENTS_WITHOUT_PROPERTIES = [
  'splash:signInPressed',
  'splash:createAccountPressed',
  'welcomeModal:presented',
  'welcomeModal:signupClicked',
  'welcomeModal:signinClicked',
  'welcomeModal:exploreClicked',
  'welcomeModal:dismissed',
  'signin:hostingProviderFailedResolution',
  'signin:forgotPasswordPressed',
  'signin:passwordResetSuccess',
  'signin:passwordResetFailure',
  'signup:captchaSuccess',
  'signup:captchaFailure',
  'signup:createAccountFailure',
  'post:create',
  'post:like',
  'post:unlike',
  'post:repost',
  'post:unrepost',
  'post:bookmark',
  'post:unbookmark',
  'post:clickReply',
  'post:clickQuotePost',
  'post:clickthroughAuthor',
  'post:clickthroughItem',
  'post:clickthroughEmbed',
  'post:share',
  'post:showMore',
  'post:showLess',
  'post:photoEmbed:impression',
  'post:photoEmbed:open',
  'post:photoEmbed:carouselSwipe',
  'composer:open',
  'composer:gif:open',
  'composer:gif:select',
  'composer:image:edit',
  'thread:create',
  'share:press:copyLink',
  'share:press:nativeShare',
  'share:press:openDmSearch',
  'share:press:dmSelected',
  'share:press:recentDm',
  'share:press:embed',
  'search:results:loaded',
  'search:result:press',
  'search:recent:press',
  'search:autocomplete:press',
  'search:advanced:press',
  'search:shareLink:press',
  'search:addFilter:press',
  'trendingTopic:seen',
  'trendingTopic:click',
  'chat:message:reply:tap',
  'chat:message:reply:send',
  'groupchat:create',
  'groupchat:landingPage:view',
  'groupchat:message:send',
  'video:upload:picked',
  'video:upload:compressStarted',
  'video:upload:compressCompleted',
  'video:upload:compressSkipped',
  'video:upload:compressFailed',
  'video:upload:uploadStarted',
  'video:upload:uploadCompleted',
  'video:upload:uploadFailed',
  'video:upload:processingStarted',
  'video:upload:processingCompleted',
  'video:upload:processingFailed',
  'video:upload:published',
  'video:upload:abandoned',
  'video:playback:failed',
  'videoCard:click',
  'reportDialog:open',
  'reportDialog:close',
  'reportDialog:success',
  'reportDialog:failure',
  'postMenu:reportPost',
  'postMenu:blockAccount',
  'postMenu:muteAccount',
  'postMenu:unmuteAccount',
  'profile:block',
  'profile:unblock',
  'profile:mute',
  'profile:unmute',
] as const

const SAFE_PROPERTIES: Record<string, readonly string[]> = {
  'account:loggedIn': ['logContext', 'withPassword'],
  'account:loggedOut': ['logContext', 'scope'],
  'signin:hostingProviderPressed': ['hostingProviderDidChange'],
  'signin:success': [
    'failedAttemptsCount',
    'isUsingCustomProvider',
    'timeTakenSeconds',
  ],
  'signup:nextPressed': ['activeStep', 'phoneVerificationRequired'],
  'signup:backPressed': ['activeStep'],
  'nav:click': ['item', 'surface'],
  'home:feedDisplayed': ['feedType', 'index', 'reason'],
  'feed:refresh': ['feedType', 'reason'],
  'feed:endReached': ['feedType', 'itemCount'],
  'feed:clickthrough': ['index'],
  'feed:engaged': ['feedType'],
  'feed:save': [],
  'feed:unsave': [],
  'feed:pin': [],
  'feed:unpin': [],
  'feed:share': [],
  'desktopFeeds:feed:click': ['index'],
  'spark:picker:opened': ['surface'],
  'spark:reaction:selected': ['reaction', 'surface'],
  'spark:reaction:changed': ['reaction', 'previousReaction', 'surface'],
  'spark:reaction:removed': ['reaction', 'surface'],
  'spark:reaction:failed': ['reaction', 'action', 'surface'],
  'chat:create': ['logContext'],
  'chat:open': ['logContext'],
}

for (const event of EVENTS_WITHOUT_PROPERTIES) {
  SAFE_PROPERTIES[event] = []
}

Object.assign(SAFE_PROPERTIES, {
  'post:create': [
    'imageCount',
    'isReply',
    'isPartOfThread',
    'hasLink',
    'hasQuote',
    'logContext',
  ],
  'thread:create': ['postCount', 'isReply'],
  'post:like': ['logContext'],
  'post:unlike': ['logContext'],
  'post:repost': ['logContext'],
  'post:unrepost': ['logContext'],
  'post:bookmark': ['logContext', 'position'],
  'post:unbookmark': ['logContext', 'position'],
  'post:clickReply': ['logContext'],
  'post:clickQuotePost': ['logContext'],
  'post:clickthroughAuthor': ['logContext'],
  'post:clickthroughItem': ['logContext'],
  'post:clickthroughEmbed': ['logContext'],
})

function safeValue(value: unknown): UmamiValue | undefined {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string' || value.length > 64) return undefined

  // Defense in depth: never send identifiers, handles, links, or free-form URLs.
  if (/^(?:at:\/\/|did:|https?:\/\/)/i.test(value) || value.includes('@')) {
    return undefined
  }
  return value
}

export function trackUmamiEvent(event: string, payload: unknown) {
  if (!env.IS_WEB || !(event in SAFE_PROPERTIES)) return

  const tracker = (globalThis as typeof globalThis & {umami?: UmamiTracker})
    .umami
  if (!tracker?.track) return

  const source =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {}
  const data: UmamiPayload = {}

  for (const property of SAFE_PROPERTIES[event]) {
    const value = safeValue(source[property])
    if (value !== undefined) data[property] = value
  }

  try {
    tracker.track(event, Object.keys(data).length ? data : undefined)
  } catch {
    // Product analytics must never interrupt a user action.
  }
}
