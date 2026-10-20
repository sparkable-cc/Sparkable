import {useLingui} from '@lingui/react/macro'

import {type DialogControlProps} from '#/components/Dialog'
import * as Prompt from '#/components/Prompt'

/**
 * Shown before sending someone to Bluesky's hosted sign-up page, so the
 * redirect doesn't come as a surprise to people who have never heard of
 * Bluesky.
 */
export function BlueskySignupDialog({
  control,
  onContinue,
}: {
  control: DialogControlProps
  /**
   * Runs after the dialog has closed.
   */
  onContinue: () => void
}) {
  const {t: l} = useLingui()

  return (
    <Prompt.Basic
      control={control}
      title={l({
        message: 'Join with a Bluesky account',
        comment:
          'Title of the dialog shown before sending someone to Bluesky to create their account',
      })}
      description={l({
        message:
          'To join Sparkable, you’ll create a free Bluesky account. Sparkable is built on the same technology as Bluesky, so one account works in both apps. When you’re done, Bluesky sends you back here.',
        comment:
          'Explains to people who have never heard of Bluesky why sign-up happens on Bluesky’s website',
      })}
      confirmButtonCta={l({
        message: 'Continue to Bluesky',
        comment: 'Button that opens Bluesky’s sign-up page',
      })}
      onConfirm={onContinue}
    />
  )
}
