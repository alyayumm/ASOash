export type AnalyticsEvent =
  | 'cta_click'
  | 'lead_submit'
  | 'quiz_open'
  | 'quiz_step'
  | 'quiz_submit'
  | 'messenger_click'

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  const record = { event, ...payload }
  window.dataLayer?.push(record)
  if (import.meta.env.DEV) {
    console.info('[analytics]', record)
  }
}
