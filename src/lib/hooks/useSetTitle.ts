import {useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'

import {type NavigationProp} from '#/lib/routes/types'
import {bskyTitle} from '#/lib/strings/headings'
import {useUnreadNotifications} from '#/state/queries/notifications/unread'

export function useSetTitle(title?: string, appTitleOnly = false) {
  const navigation = useNavigation<NavigationProp>()
  const numUnread = useUnreadNotifications()
  useEffect(() => {
    if (title) {
      navigation.setOptions({
        title: appTitleOnly ? 'Sparkable' : bskyTitle(title, numUnread),
      })
    }
  }, [title, appTitleOnly, navigation, numUnread])
}
