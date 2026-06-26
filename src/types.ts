export type AudiencePath = {
  id: 'growth' | 'launch' | 'system'
  number: string
  title: string
  description: string
  result: string
}

export type TransformationArea = {
  id: string
  number: string
  title: string
  description: string
  outcome: string
  artifacts: string[]
}

export type ProcessStep = {
  number: string
  title: string
  action: string
  result: string
  artifact: string
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
}

export type Contacts = {
  telegram: string
  whatsapp: string
  phone: string
  email: string
}
