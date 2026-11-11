import {useSyncExternalStore} from 'react'

import {web} from '#/alf'

/*
 * On phones the home screen card sits directly on the bottom bar, between it
 * and the floating compose button, so the button moves up by this many pixels
 * while the card shows. Always 0 on native, where the card never renders.
 */
let lift = 0
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getLift() {
  return lift
}

/**
 * Set by the home screen card from its measured position. Pass 0 when the
 * card goes away.
 */
export function setComposeButtonLift(value: number) {
  const next = Math.max(0, Math.round(value))
  if (next === lift) return
  lift = next
  listeners.forEach(listener => listener())
}

/**
 * Extra style for the floating compose button (FABInner) that lifts it clear
 * of the home screen card. Undefined while the card isn't showing.
 */
export function useComposeButtonLiftStyle() {
  const value = useSyncExternalStore(subscribe, getLift, getLift)
  if (value === 0) return undefined
  return [
    {marginBottom: value},
    web({transitionProperty: 'margin-bottom', transitionDuration: '250ms'}),
  ]
}
