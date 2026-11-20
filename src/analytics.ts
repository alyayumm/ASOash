export type AnalyticsEvent =
  | 'employer_payment_view'
  | 'employer_tax_select'
  | 'employer_cta_click'
  | 'employer_form_start'
  | 'employer_form_submit_success'
  | 'employer_form_submit_error'
  | 'employee_offer_open'
  | 'corporate_cta_click'
  | 'corporate_audience_select'
  | 'corporate_form_start'
  | 'corporate_form_submit_success'
  | 'corporate_form_submit_error'
  | 'cta_click'
  | 'lead_submit'
  | 'lead_submit_error'
  | 'quiz_open'
  | 'quiz_step'
  | 'quiz_submit'
  | 'quiz_submit_error'
  | 'messenger_click'

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  const record = { event, ...payload }
  window.dataLayer?.push(record)
  if (import.meta.env.DEV) {
    console.info('[analytics]', record)
  }
}
