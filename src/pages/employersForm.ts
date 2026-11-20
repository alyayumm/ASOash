import { getCorporateContactError } from './corporateFormValidation'

export type EmployerContact = 'email' | 'telegram' | 'whatsapp'
export type EmployerFields = {
  name: string; company: string; city: string; participants: string; comment: string; consent: boolean
}

export function validateEmployerForm(fields: EmployerFields, method: EmployerContact, contact: string) {
  const errors: Record<string, string> = {}
  if (!fields.name.trim()) errors.name = 'Укажите имя'
  if (!fields.company.trim()) errors.company = 'Укажите название компании'
  const contactError = getCorporateContactError(method, contact)
  if (contactError) errors.contact = contactError
  if (!fields.city.trim()) errors.city = 'Укажите город обучения'
  if (fields.participants && (!/^\d+$/.test(fields.participants) || !Number.isSafeInteger(Number(fields.participants)) || Number(fields.participants) < 1)) errors.participants = 'Введите целое положительное число или оставьте поле пустым'
  if (!fields.consent) errors.consent = 'Нужно согласие на обработку персональных данных'
  return errors
}
