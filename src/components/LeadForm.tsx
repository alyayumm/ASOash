import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '../analytics'
import { getLeadSubmitErrorMessage, sendLead } from '../leadDelivery'
import { createTrackingFields } from '../trackingFields'
import type { LeadFormValues } from '../types'
import { HiddenTrackingInputs } from './HiddenTrackingInputs'

const createInitialValues = (): LeadFormValues => ({
  name: '',
  phone: '',
  city: '',
  status: '',
  contactMethod: 'phone',
  comment: '',
  consent: false,
  tracking: createTrackingFields('lead-form', 'contact-section'),
})

const statusLabels: Record<string, string> = {
  active: 'Есть действующая автошкола',
  launch: 'Планирую запуск',
  system: 'Ищу готовую систему',
}

const contactMethodLabels: Record<LeadFormValues['contactMethod'], string> = {
  phone: 'Телефон',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11)
  const normalized = digits.startsWith('7') ? digits : `7${digits}`
  const parts = normalized.slice(1)
  let result = '+7'
  if (parts.length) result += ` (${parts.slice(0, 3)}`
  if (parts.length >= 3) result += ')'
  if (parts.length > 3) result += ` ${parts.slice(3, 6)}`
  if (parts.length > 6) result += `-${parts.slice(6, 8)}`
  if (parts.length > 8) result += `-${parts.slice(8, 10)}`
  return result
}

export function LeadForm() {
  const [values, setValues] = useState(createInitialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const update = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSubmitError('')
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === 'loading') return

    const nextErrors: Record<string, string> = {}
    if (!values.name.trim()) nextErrors.name = 'Укажите имя'
    if (values.phone.replace(/\D/g, '').length < 11) nextErrors.phone = 'Введите полный номер телефона'
    if (!values.city.trim()) nextErrors.city = 'Укажите город'
    if (!values.status) nextErrors.status = 'Выберите текущую ситуацию'
    if (!values.consent) nextErrors.consent = 'Нужно согласие на обработку данных'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setStatus('loading')
    setSubmitError('')

    const statusLabel = statusLabels[values.status] || values.status
    const contactMethodLabel = contactMethodLabels[values.contactMethod]

    try {
      await sendLead({
        kind: 'lead_form',
        formName: 'Форма заявки',
        values: {
          name: values.name.trim(),
          phone: values.phone,
          city: values.city.trim(),
          status: statusLabel,
          contactMethod: contactMethodLabel,
          comment: values.comment.trim(),
          consent: values.consent,
        },
        tracking: values.tracking,
      })

      setStatus('success')
      trackEvent('lead_submit', {
        status: statusLabel,
        contactMethod: contactMethodLabel,
        tracking: values.tracking,
      })
    } catch (error) {
      setStatus('idle')
      setSubmitError(getLeadSubmitErrorMessage(error))
      trackEvent('lead_submit_error', {
        error: error instanceof Error ? error.name : 'unknown',
        tracking: values.tracking,
      })
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <CheckCircle2 aria-hidden="true" />
        <h3>Заявка отправлена</h3>
        <p>Данные переданы. Мы вернёмся с предварительным разбором.</p>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setValues(createInitialValues())
            setStatus('idle')
            setSubmitError('')
          }}
        >
          Заполнить ещё раз
        </button>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <HiddenTrackingInputs fields={values.tracking} />
      <div className="field-row">
        <label>
          <span>Имя</span>
          <input
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
            autoComplete="name"
          />
          {errors.name ? (
            <small id="lead-name-error" className="field-error" role="alert">
              {errors.name}
            </small>
          ) : null}
        </label>
        <label>
          <span>Телефон</span>
          <input
            value={values.phone}
            onChange={(event) => update('phone', maskPhone(event.target.value))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
          />
          {errors.phone ? (
            <small id="lead-phone-error" className="field-error" role="alert">
              {errors.phone}
            </small>
          ) : null}
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Город</span>
          <input
            value={values.city}
            onChange={(event) => update('city', event.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'lead-city-error' : undefined}
            autoComplete="address-level2"
          />
          {errors.city ? (
            <small id="lead-city-error" className="field-error" role="alert">
              {errors.city}
            </small>
          ) : null}
        </label>
        <label>
          <span>Текущая ситуация</span>
          <select
            value={values.status}
            onChange={(event) => update('status', event.target.value)}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'lead-status-error' : undefined}
          >
            <option value="">Выберите вариант</option>
            <option value="active">Есть действующая автошкола</option>
            <option value="launch">Планирую запуск</option>
            <option value="system">Ищу готовую систему</option>
          </select>
          {errors.status ? (
            <small id="lead-status-error" className="field-error" role="alert">
              {errors.status}
            </small>
          ) : null}
        </label>
      </div>
      <fieldset className="contact-method">
        <legend>Предпочтительный способ связи</legend>
        {(['phone', 'telegram', 'whatsapp'] as const).map((method) => (
          <label key={method}>
            <input
              type="radio"
              name="contactMethod"
              value={method}
              checked={values.contactMethod === method}
              onChange={() => update('contactMethod', method)}
            />
            <span>{contactMethodLabels[method]}</span>
          </label>
        ))}
      </fieldset>
      <label>
        <span>
          Комментарий <em>необязательно</em>
        </span>
        <textarea
          value={values.comment}
          onChange={(event) => update('comment', event.target.value)}
          rows={3}
          placeholder="Коротко опишите задачу"
        />
      </label>
      <label className="consent">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(event) => update('consent', event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
        />
        <span>
          Согласен на{' '}
          <a href="#personal-data-consent" target="_blank" rel="noreferrer">
            обработку персональных данных
          </a>
        </span>
      </label>
      {errors.consent ? (
        <small id="lead-consent-error" className="field-error field-error--standalone" role="alert">
          {errors.consent}
        </small>
      ) : null}
      {submitError ? (
        <small className="field-error field-error--standalone" role="alert">
          {submitError}
        </small>
      ) : null}
      <button className="button button--primary button--wide" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Отправляем...' : 'Получить предварительный разбор'}
        {status === 'loading' ? null : <ArrowRight aria-hidden="true" />}
      </button>
      <p className="form-note">
        После заявки уточним задачу и договоримся о короткой встрече. Условия обсуждаются только после знакомства с
        исходными данными.
      </p>
    </form>
  )
}
