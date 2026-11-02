import {EMPTY_RECORD, type PromptRecord} from './rules'

/*
 * Plain localStorage/sessionStorage rather than the app's `#/storage` schema,
 * so this Sparkable-only feature doesn't touch upstream files. Every access is
 * wrapped because storage can be unavailable (private mode, blocked site data).
 */

const RECORD_KEY = 'sparkable.homeScreenPrompt'
const SESSION_KEY = 'sparkable.homeScreenPrompt.session'

export function readRecord(): PromptRecord {
  try {
    const raw = localStorage.getItem(RECORD_KEY)
    return raw ? {...EMPTY_RECORD, ...JSON.parse(raw)} : {...EMPTY_RECORD}
  } catch {
    return {...EMPTY_RECORD}
  }
}

export function updateRecord(
  update: (record: PromptRecord) => Partial<PromptRecord>,
) {
  try {
    const record = readRecord()
    localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({...record, ...update(record)}),
    )
  } catch {}
}

type SessionState = {
  counted?: boolean
  shown?: boolean
  openedTracked?: boolean
}

function readSession(): SessionState {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeSession(update: SessionState) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({...readSession(), ...update}),
    )
  } catch {}
}

/**
 * Counts a visit once per browser session.
 */
export function countVisit() {
  if (readSession().counted) return
  writeSession({counted: true})
  updateRecord(record => ({visits: record.visits + 1}))
}

export function wasShownThisSession() {
  return Boolean(readSession().shown)
}

export function markShownThisSession() {
  writeSession({shown: true})
}

/**
 * Returns true the first time it's called in a session.
 */
export function claimOpenedTracking() {
  if (readSession().openedTracked) return false
  writeSession({openedTracked: true})
  return true
}
