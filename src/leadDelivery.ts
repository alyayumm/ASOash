import type { TrackingFields } from './types'

export type LeadKind = 'lead_form' | 'quiz'

export type LeadPayload = {
  kind: LeadKind
  formName: string
  values: Record<string, string | boolean>
  tracking: TrackingFields
}

const REQUEST_TIMEOUT_MS = 12000

const getWebhookUrl = () => (window.ASO_LEADS_WEBHOOK_URL || import.meta.env.VITE_LEADS_WEBHOOK_URL || '').trim()

export const isLeadWebhookConfigured = () => Boolean(getWebhookUrl())

export const getLeadSubmitErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.name === 'LeadWebhookMissingError') {
    return 'Отправка заявок пока не подключена. Добавьте URL Google Apps Script в настройку сайта.'
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'Отправка заняла слишком много времени. Попробуйте ещё раз.'
  }

  return 'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.'
}

export async function sendLead(payload: LeadPayload, { requireConfirmation = false }: { requireConfirmation?: boolean } = {}) {
  const webhookUrl = getWebhookUrl()

  if (!webhookUrl) {
    const error = new Error('Lead webhook URL is missing')
    error.name = 'LeadWebhookMissingError'
    throw error
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const body = JSON.stringify({
    ...payload,
    tracking: {
      ...payload.tracking,
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
    },
  })

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: requireConfirmation ? 'cors' : 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body,
      signal: controller.signal,
    })
    if (requireConfirmation) {
      if (!response.ok) throw new Error('Lead delivery failed')
      const result: unknown = await response.json()
      if (typeof result !== 'object' || result === null || !('ok' in result) || result.ok !== true) {
        throw new Error('Lead delivery was not confirmed')
      }
    }
  } finally {
    window.clearTimeout(timeout)
  }
}
