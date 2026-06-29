export type AudiencePath = {
  id: 'growth' | 'launch' | 'system'
  number: string
  title: string
  description: string
  result: string
}

export type SystemArea = {
  id: string
  number: string
  title: string
  currentState: string
  implementation: string
  result: string
  tools: string[]
  shortBefore: string
  shortAfter: string
}

export type ProcessStep = {
  number: string
  title: string
  action: string
  result: string
  artifact: string
  image: string
}

export type EvidenceItem = {
  title: string
  description: string
  kind: 'report' | 'crm' | 'process' | 'document'
}

export type FaqItem = {
  question: string
  answer: string
}

export type LeadFormValues = {
  name: string
  phone: string
  city: string
  status: string
  contactMethod: 'phone' | 'telegram' | 'whatsapp'
  comment: string
  consent: boolean
  tracking: TrackingFields
}

export type QuizAnswers = {
  status: string
  region: string
  branches: string
  task: string
  problem: string
  result: string
  name: string
  phone: string
  consent: boolean
  tracking: TrackingFields
}

export type Contacts = {
  telegram: string
  whatsapp: string
  phone: string
  email: string
}

export type TrackingFields = {
  formId: string
  source: string
  pageUrl: string
  landingPage: string
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  utmTerm: string
  yclid: string
  gclid: string
  fbclid: string
  submittedAt: string
  userAgent: string
}
