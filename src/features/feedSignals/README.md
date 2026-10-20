# Feed signals

Sends six private post-menu actions to Sparkable's feed service as negative
signals: mute thread, mute words, hide post, mute account, block account and
report post. "Show more" and "show less" already reach feeds through
Bluesky's own feed-feedback code, so they are not handled here.

Bluesky's app never sends these actions to feeds. They use Sparkable's own
event names (`cc.sparkable.feed.defs#...`) and go only to Sparkable's feed,
only while the reader is in that feed. `sparkableFeedProxy` is the single
gate; every other feed, Bluesky's Discover included, gets nothing.

What is never sent: the muted words themselves, and a report's reason or text.

## Hooks in Bluesky's files

All logic lives in this folder. Bluesky's files only call into it:

- `src/components/PostControls/PostMenu/PostMenuItems.tsx`: one
  `useSendFeedSignal` call and one `sendFeedSignal(FEED_SIGNALS.*)` line per
  action, each after the action succeeds.
- `src/components/dialogs/MutedWords.tsx`: `onMutedWordSaved()` after a word
  is saved, and `onClose={disarmMutedWordSignal}` on the dialog.

After merging Bluesky's updates, run `pnpm test src/features/feedSignals`.
It fails if a merge dropped any of these hooks.
