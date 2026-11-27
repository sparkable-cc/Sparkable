import {memo, useMemo, useRef, useState} from 'react'
import {type StyleProp, View, type ViewStyle} from 'react-native'
import {type AtUriString} from '@atproto/syntax'
import {type RichText as RichTextAPI} from '@bsky/sdk/richtext'
import {plural} from '@lingui/core/macro'
import {useLingui} from '@lingui/react/macro'
import {useQueryClient} from '@tanstack/react-query'

import {CountWheel} from '#/lib/custom-animations/CountWheel'
import {AnimatedLikeIcon} from '#/lib/custom-animations/LikeIcon'
import {useOpenComposer} from '#/lib/hooks/useOpenComposer'
import {
  createReactionWithSpark,
  deleteReactionWithSpark,
  putReaction,
} from '#/lib/prosocial-reactions'
import {updatePostShadow} from '#/state/cache/post-shadow'
import {type Shadow} from '#/state/cache/types'
import {
  usePostLikeMutationQueue,
  usePostRepostMutationQueue,
} from '#/state/queries/post'
import {
  prosocialMetadataQueryKey,
  updateProsocialReactionCache,
  useViewerProsocialReaction,
  viewerProsocialReactionQueryKey,
} from '#/state/queries/prosocial-metadata'
import {usePdsClient, useRequireAuth, useSession} from '#/state/session'
import {
  ProgressGuideAction,
  useProgressGuideControls,
} from '#/state/shell/progress-guide'
import {atoms as a, useBreakpoints, useTheme} from '#/alf'
import {Reply_Stroke2_Corner0_Rounded as Bubble} from '#/components/icons/Reply'
import {useFormatPostStatCount} from '#/components/PostControls/util'
import * as Skele from '#/components/Skeleton'
import * as Toast from '#/components/Toast'
import {useAnalytics} from '#/analytics'
import {useFeedItemFeedback} from '#/features/feedFeedback'
import {type app} from '#/lexicons'
import {BookmarkButton} from './BookmarkButton'
import {
  PostControlButton,
  PostControlButtonIcon,
  PostControlButtonText,
} from './PostControlButton'
import {PostMenuButton} from './PostMenu'
import {RepostButton} from './RepostButton'
import {ShareMenuButton} from './ShareMenu'
import {SparkBurst} from './SparkBurst'
import {
  type SparkReaction,
  SparkReactionIcon,
  SparkReactionPicker,
} from './SparkReactionPicker'

let PostControls = ({
  big,
  post,
  record,
  richText,
  style,
  onPressReply,
  onPostReply,
  logContext,
  threadgateRecord,
  onShowLess,
  variant,
  forceGoogleTranslate = false,
}: {
  big?: boolean
  post: Shadow<app.bsky.feed.defs.PostView>
  record: app.bsky.feed.post.Main
  richText: RichTextAPI
  style?: StyleProp<ViewStyle>
  onPressReply: () => void
  onPostReply?: (postUri: string | undefined) => void
  logContext: 'FeedItem' | 'PostThreadItem' | 'Post' | 'ImmersiveVideo'
  threadgateRecord?: app.bsky.feed.threadgate.Main
  onShowLess?: (interaction: app.bsky.feed.defs.Interaction) => void
  variant?: 'compact' | 'normal' | 'large'
  forceGoogleTranslate?: boolean
}): React.ReactNode => {
  const ax = useAnalytics()
  const client = usePdsClient()
  const did = useSession().currentAccount?.did
  const queryClient = useQueryClient()
  const t = useTheme()
  const {t: l} = useLingui()
  const {openComposer} = useOpenComposer()
  const feedItem = useFeedItemFeedback()
  const {feedDescriptor} = feedItem
  const [queueLike, queueUnlike] = usePostLikeMutationQueue(
    post,
    feedItem.item?.via,
    feedDescriptor,
    logContext,
  )
  const [queueRepost, queueUnrepost] = usePostRepostMutationQueue(
    post,
    feedItem.item?.via,
    feedDescriptor,
    logContext,
  )
  const requireAuth = useRequireAuth()
  const {captureAction} = useProgressGuideControls()
  const isBlocked = Boolean(
    post.author.viewer?.blocking ||
    post.author.viewer?.blockedBy ||
    post.author.viewer?.blockingByList,
  )
  const replyDisabled = post.viewer?.replyDisabled
  const {gtPhone} = useBreakpoints()
  const formatPostStatCount = useFormatPostStatCount()
  const {data: viewerReaction, refetch: refetchViewerReaction} =
    useViewerProsocialReaction(post.uri, Boolean(post.viewer?.like))

  const [hasLikeIconBeenToggled, setHasLikeIconBeenToggled] = useState(false)
  const pendingLikeUri = useRef<Promise<string | undefined> | null>(null)
  const lastCreatedLikeUri = useRef<string | undefined>(undefined)
  const [reactionOverride, setReactionOverride] =
    useState<SparkReaction | null>()
  const sparkReaction = post.viewer?.like
    ? reactionOverride !== undefined
      ? (reactionOverride ?? undefined)
      : (viewerReaction ?? undefined)
    : undefined
  const [sparkPickerDismissKey, setSparkPickerDismissKey] = useState(0)
  const [sparkPickerOpenKey, setSparkPickerOpenKey] = useState(0)
  const [sparkPickerVisible, setSparkPickerVisible] = useState(false)
  const sparkSurface =
    logContext === 'FeedItem'
      ? 'feed'
      : logContext === 'PostThreadItem'
        ? 'thread'
        : logContext === 'ImmersiveVideo'
          ? 'video-feed'
          : 'profile'

  const setOptimisticReaction = (
    previous: SparkReaction | null,
    next: SparkReaction | null,
  ) => {
    void queryClient.cancelQueries({
      queryKey: prosocialMetadataQueryKey(post.uri),
    })
    setReactionOverride(next)
    updateProsocialReactionCache(queryClient, post.uri, previous, next)
    if (did) {
      queryClient.setQueryData(
        viewerProsocialReactionQueryKey(did, post.uri),
        next,
      )
    }
  }

  const refreshProsocialMetadata = () => {
    setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: prosocialMetadataQueryKey(post.uri),
      })
    }, 1500)
  }

  const resolveLikeUri = async (likeUri: string): Promise<AtUriString> => {
    if (likeUri !== 'pending') return likeUri as AtUriString
    // The picker can be used while the first Spark write is still in flight.
    // Its optimistic URI cannot be parsed as an AT URI or sent to applyWrites.
    const resolved = pendingLikeUri.current
      ? await pendingLikeUri.current
      : lastCreatedLikeUri.current
    if (!resolved) throw new Error('Spark is still being saved. Try again.')
    return resolved as AtUriString
  }

  const onPressToggleLike = async () => {
    if (isBlocked) {
      Toast.show(l`Cannot interact with a blocked user`, {
        type: 'warning',
      })
      return
    }

    // A Spark may render before its reaction lookup finishes. Resolve it before
    // deciding whether to remove only the Spark or both repository records.
    let activeReaction = sparkReaction
    if (
      post.viewer?.like &&
      reactionOverride === undefined &&
      viewerReaction === undefined
    ) {
      const lookup = await refetchViewerReaction()
      if (lookup.error) throw lookup.error
      activeReaction = lookup.data ?? undefined
    }

    if (post.viewer?.like && activeReaction) {
      if (!sparkPickerVisible) {
        setSparkPickerOpenKey(key => key + 1)
        return
      }

      const removedReaction = activeReaction
      const likeUri = await resolveLikeUri(post.viewer.like)
      setSparkPickerDismissKey(key => key + 1)
      setOptimisticReaction(removedReaction, null)
      setHasLikeIconBeenToggled(true)
      updatePostShadow(queryClient, post.uri, {likeUri: undefined})
      try {
        await deleteReactionWithSpark({
          client,
          subjectUri: post.uri,
          likeUri,
        })
        lastCreatedLikeUri.current = undefined
        refreshProsocialMetadata()
        ax.metric('spark:reaction:removed', {
          reaction: removedReaction,
          surface: sparkSurface,
        })
      } catch (err) {
        updatePostShadow(queryClient, post.uri, {likeUri})
        setOptimisticReaction(null, removedReaction)
        ax.metric('spark:reaction:failed', {
          reaction: removedReaction,
          action: 'remove',
          surface: sparkSurface,
        })
        throw err
      }
      return
    }

    try {
      setHasLikeIconBeenToggled(true)
      if (!post.viewer?.like) {
        setReactionOverride(null)
        feedItem.send('app.bsky.feed.defs#interactionLike')
        captureAction(ProgressGuideAction.Like)
        const likePromise = queueLike()
        lastCreatedLikeUri.current = undefined
        pendingLikeUri.current = likePromise
        setSparkPickerOpenKey(key => key + 1)
        lastCreatedLikeUri.current = await likePromise
      } else {
        const removedReaction = activeReaction
        setSparkPickerDismissKey(key => key + 1)
        setReactionOverride(null)
        await queueUnlike()
        lastCreatedLikeUri.current = undefined
        if (removedReaction) {
          ax.metric('spark:reaction:removed', {
            reaction: removedReaction,
            surface: sparkSurface,
          })
        }
      }
    } catch (err) {
      const e = err as Error
      if (sparkReaction && post.viewer?.like) {
        ax.metric('spark:reaction:failed', {
          reaction: sparkReaction,
          action: 'remove',
          surface: sparkSurface,
        })
      }
      if (e?.name !== 'AbortError') {
        throw e
      }
    }
  }

  const onSelectSparkReaction = async (reaction: SparkReaction) => {
    let previousReaction = sparkReaction
    if (
      post.viewer?.like &&
      reactionOverride === undefined &&
      viewerReaction === undefined
    ) {
      const lookup = await refetchViewerReaction()
      if (lookup.error) throw lookup.error
      previousReaction = lookup.data ?? undefined
    }

    if (previousReaction === reaction) {
      const pendingUri = post.viewer?.like
      if (!pendingUri) return
      const likeUri = await resolveLikeUri(pendingUri)
      setOptimisticReaction(reaction, null)
      setHasLikeIconBeenToggled(true)
      updatePostShadow(queryClient, post.uri, {likeUri: undefined})
      try {
        await deleteReactionWithSpark({
          client,
          subjectUri: post.uri,
          likeUri,
        })
        lastCreatedLikeUri.current = undefined
        refreshProsocialMetadata()
        ax.metric('spark:reaction:removed', {
          reaction,
          surface: sparkSurface,
        })
      } catch (err) {
        updatePostShadow(queryClient, post.uri, {likeUri})
        setOptimisticReaction(null, previousReaction)
        ax.metric('spark:reaction:failed', {
          reaction,
          action: 'remove',
          surface: sparkSurface,
        })
        throw err
      }
      return
    }

    setOptimisticReaction(previousReaction ?? null, reaction)
    try {
      if (!post.viewer?.like) {
        setHasLikeIconBeenToggled(true)
        updatePostShadow(queryClient, post.uri, {likeUri: 'pending'})
        feedItem.send('app.bsky.feed.defs#interactionLike')
        captureAction(ProgressGuideAction.Like)
        const {likeUri} = await createReactionWithSpark({
          client,
          subject: {uri: post.uri, cid: post.cid},
          reactionType: reaction,
          via: feedItem.item?.via,
        })
        lastCreatedLikeUri.current = likeUri
        updatePostShadow(queryClient, post.uri, {likeUri})
        refreshProsocialMetadata()
      } else {
        await putReaction({
          client,
          subject: {uri: post.uri, cid: post.cid},
          reactionType: reaction,
        })
        refreshProsocialMetadata()
      }
      if (previousReaction && previousReaction !== reaction) {
        ax.metric('spark:reaction:changed', {
          reaction,
          previousReaction,
          surface: sparkSurface,
        })
      } else {
        ax.metric('spark:reaction:selected', {
          reaction,
          surface: sparkSurface,
        })
      }
    } catch (err) {
      setOptimisticReaction(reaction, previousReaction ?? null)
      if (!post.viewer?.like) {
        updatePostShadow(queryClient, post.uri, {likeUri: undefined})
      }
      ax.metric('spark:reaction:failed', {
        reaction,
        action: previousReaction ? 'change' : 'select',
        surface: sparkSurface,
      })
      throw err
    }
  }

  const onRepost = async () => {
    if (isBlocked) {
      Toast.show(l`Cannot interact with a blocked user`, {
        type: 'warning',
      })
      return
    }

    const existingRepost = post.viewer?.repost
    try {
      if (!existingRepost) {
        feedItem.send('app.bsky.feed.defs#interactionRepost')
        await queueRepost()
      } else {
        await queueUnrepost()
      }
    } catch (err) {
      const e = err as Error
      if (e?.name !== 'AbortError') {
        throw e
      }
    }
  }

  const onQuote = () => {
    if (isBlocked) {
      Toast.show(l`Cannot interact with a blocked user`, {
        type: 'warning',
      })
      return
    }

    feedItem.send('app.bsky.feed.defs#interactionQuote')
    ax.metric('post:clickQuotePost', {
      uri: post.uri,
      authorDid: post.author.did,
      logContext,
      feedDescriptor,
    })
    openComposer({
      quote: post,
      onPost: onPostReply,
      logContext: 'QuotePost',
    })
  }

  const onShare = () => {
    feedItem.send('app.bsky.feed.defs#interactionShare')
  }

  const secondaryControlSpacingStyles = useSecondaryControlSpacingStyles({
    variant,
    big,
    gtPhone,
  })

  return (
    <View
      style={[
        a.flex_row,
        a.justify_between,
        a.align_center,
        !big && a.pt_2xs,
        a.gap_md,
        style,
      ]}>
      <View style={[a.flex_row, a.flex_1, {maxWidth: 320}]}>
        <View style={[a.flex_1, a.align_start, {marginLeft: big ? -2 : -6}]}>
          <SparkReactionPicker
            dismissKey={sparkPickerDismissKey}
            openKey={sparkPickerOpenKey}
            openOnTouch={!post.viewer?.like}
            onOpen={() =>
              ax.metric('spark:picker:opened', {surface: sparkSurface})
            }
            onSelect={reaction =>
              requireAuth(() => onSelectSparkReaction(reaction))
            }
            onVisibilityChange={setSparkPickerVisible}
            selectedReaction={sparkReaction}>
            <PostControlButton
              testID="likeBtn"
              big={big}
              active={Boolean(post.viewer?.like)}
              activeColor={t.palette.pink}
              onPress={() => requireAuth(() => onPressToggleLike())}
              label={
                post.viewer?.like
                  ? l({
                      message: `Unspark (${plural(post.likeCount || 0, {
                        one: '# spark',
                        other: '# sparks',
                      })})`,
                      comment:
                        'Accessibility label for the spark button when the post has been sparked, verb followed by number of sparks and noun',
                    })
                  : l({
                      message: `Spark (${plural(post.likeCount || 0, {
                        one: '# spark',
                        other: '# sparks',
                      })})`,
                      comment:
                        'Accessibility label for the spark button when the post has not been sparked, verb form followed by number of sparks and noun form',
                    })
              }>
              <SparkBurst
                sparked={Boolean(post.viewer?.like)}
                reaction={reactionOverride}
                hasBeenToggled={hasLikeIconBeenToggled}>
                {sparkReaction && post.viewer?.like ? (
                  <SparkReactionIcon reaction={sparkReaction} />
                ) : (
                  <AnimatedLikeIcon
                    isLiked={Boolean(post.viewer?.like)}
                    big={big}
                    hasBeenToggled={hasLikeIconBeenToggled}
                  />
                )}
              </SparkBurst>
              <CountWheel
                count={post.likeCount ?? 0}
                isToggled={Boolean(post.viewer?.like)}
                hasBeenToggled={hasLikeIconBeenToggled}
                renderCount={({count}) => (
                  <PostControlButtonText testID="likeCount">
                    {formatPostStatCount(count)}
                  </PostControlButtonText>
                )}
              />
            </PostControlButton>
          </SparkReactionPicker>
        </View>
        <View
          style={[
            a.flex_1,
            a.align_start,
            replyDisabled ? {opacity: 0.6} : undefined,
          ]}>
          <PostControlButton
            testID="replyBtn"
            onPress={
              !replyDisabled
                ? () =>
                    requireAuth(() => {
                      ax.metric('post:clickReply', {
                        uri: post.uri,
                        authorDid: post.author.did,
                        logContext,
                        feedDescriptor,
                      })
                      onPressReply()
                    })
                : undefined
            }
            label={l({
              message: `Reply (${plural(post.replyCount || 0, {
                one: '# reply',
                other: '# replies',
              })})`,
              comment:
                'Accessibility label for the reply button, verb form followed by number of replies and noun form',
            })}
            big={big}>
            <PostControlButtonIcon icon={Bubble} />
            {typeof post.replyCount !== 'undefined' && post.replyCount > 0 && (
              <PostControlButtonText>
                {formatPostStatCount(post.replyCount)}
              </PostControlButtonText>
            )}
          </PostControlButton>
        </View>
        <View style={[a.flex_1, a.align_start]}>
          <RepostButton
            isReposted={!!post.viewer?.repost}
            repostCount={(post.repostCount ?? 0) + (post.quoteCount ?? 0)}
            onRepost={() => void onRepost()}
            onQuote={onQuote}
            big={big}
            embeddingDisabled={Boolean(post.viewer?.embeddingDisabled)}
          />
        </View>
        {/* Spacer! */}
        <View />
      </View>
      <View style={[a.flex_row, a.justify_end, secondaryControlSpacingStyles]}>
        <BookmarkButton
          post={post}
          big={big}
          logContext={logContext}
          hitSlop={{
            right: secondaryControlSpacingStyles.gap / 2,
          }}
        />
        <ShareMenuButton
          testID="postShareBtn"
          post={post}
          big={big}
          record={record}
          richText={richText}
          timestamp={post.indexedAt}
          threadgateRecord={threadgateRecord}
          onShare={onShare}
          hitSlop={{
            left: secondaryControlSpacingStyles.gap / 2,
            right: secondaryControlSpacingStyles.gap / 2,
          }}
          logContext={logContext}
        />
        <PostMenuButton
          testID="postDropdownBtn"
          post={post}
          big={big}
          record={record}
          richText={richText}
          timestamp={post.indexedAt}
          threadgateRecord={threadgateRecord}
          onShowLess={onShowLess}
          hitSlop={{
            left: secondaryControlSpacingStyles.gap / 2,
          }}
          logContext={logContext}
          forceGoogleTranslate={forceGoogleTranslate}
        />
      </View>
    </View>
  )
}
PostControls = memo(PostControls)
export {PostControls}

export function PostControlsSkeleton({
  big,
  style,
  variant,
}: {
  big?: boolean
  style?: StyleProp<ViewStyle>
  variant?: 'compact' | 'normal' | 'large'
}) {
  const {gtPhone} = useBreakpoints()

  const rowHeight = big ? 32 : 28
  const padding = 4
  const size = rowHeight - padding * 2

  const secondaryControlSpacingStyles = useSecondaryControlSpacingStyles({
    variant,
    big,
    gtPhone,
  })

  const itemStyles = {
    padding,
  }

  return (
    <Skele.Row
      style={[a.flex_row, a.justify_between, a.align_center, a.gap_md, style]}>
      <View style={[a.flex_row, a.flex_1, {maxWidth: 320}]}>
        <View
          style={[itemStyles, a.flex_1, a.align_start, {marginLeft: -padding}]}>
          <Skele.Pill blend size={size} />
        </View>

        <View style={[itemStyles, a.flex_1, a.align_start]}>
          <Skele.Pill blend size={size} />
        </View>

        <View style={[itemStyles, a.flex_1, a.align_start]}>
          <Skele.Pill blend size={size} />
        </View>
      </View>
      <View style={[a.flex_row, a.justify_end, secondaryControlSpacingStyles]}>
        <View style={itemStyles}>
          <Skele.Circle blend size={size} />
        </View>
        <View style={itemStyles}>
          <Skele.Circle blend size={size} />
        </View>
        <View style={itemStyles}>
          <Skele.Circle blend size={size} />
        </View>
      </View>
    </Skele.Row>
  )
}

function useSecondaryControlSpacingStyles({
  variant,
  big,
  gtPhone,
}: {
  variant?: 'compact' | 'normal' | 'large'
  big?: boolean
  gtPhone: boolean
}) {
  return useMemo(() => {
    let gap = 0 // default, we want `gap` to be defined on the resulting object
    if (variant !== 'compact') gap = a.gap_xs.gap
    if (big || gtPhone) gap = a.gap_sm.gap
    return {gap}
  }, [variant, big, gtPhone])
}
