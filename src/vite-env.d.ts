/// <reference types="vite/client" />

interface Window {
  dataLayer?: Array<Record<string, unknown>>
  ASO_LEADS_WEBHOOK_URL?: string
}

interface ImportMetaEnv {
  readonly VITE_LEADS_WEBHOOK_URL?: string
}
