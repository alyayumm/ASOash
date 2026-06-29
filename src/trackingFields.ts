import type { TrackingFields } from './types'

const LANDING_PAGE_KEY = 'aso_landing_page'

const readSessionValue = (key: string) => {
  try {
    return window.sessionStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

const writeSessionValue = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in private browsing; tracking should not block forms.
  }
}

const getLandingPage = () => {
  const current = window.location.href
  const saved = readSessionValue(LANDING_PAGE_KEY)
  if (saved) return saved
  writeSessionValue(LANDING_PAGE_KEY, current)
  return current
}

const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    return ''
  }
}

const getScreenSize = () => {
  try {
    return `${window.screen.width}x${window.screen.height}`
  } catch {
    return ''
  }
}

export function createTrackingFields(formId: string, source: string): TrackingFields {
  const params = new URLSearchParams(window.location.search)

  return {
    formId,
    source,
    pageUrl: window.location.href,
    landingPage: getLandingPage(),
    referrer: document.referrer || '',
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
    yclid: params.get('yclid') || '',
    gclid: params.get('gclid') || '',
    fbclid: params.get('fbclid') || '',
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent || '',
    language: navigator.language || '',
    timezone: getTimezone(),
    screenSize: getScreenSize(),
  }
}
