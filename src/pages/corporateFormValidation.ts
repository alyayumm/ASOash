export type CorporateAudience = '' | 'agency' | 'employer'
export type CorporateContactMethod = 'phone' | 'email' | 'telegram' | 'whatsapp'

export function isValidCorporatePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return /^\+?[\d\s()-]+$/.test(value.trim()) && digits.length >= 10 && digits.length <= 15
}

export function getCorporateContactError(method: CorporateContactMethod, value: string) {
  const contact = value.trim()
  if (method === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? '' : 'Введите email, например name@company.ru'
  if (method === 'telegram') return /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact) || isValidCorporatePhone(contact) ? '' : 'Укажите Telegram в формате @username или номер телефона'
  return isValidCorporatePhone(contact) ? '' : 'Введите номер телефона с кодом страны'
}
