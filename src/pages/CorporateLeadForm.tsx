import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '../analytics'
import { isLeadWebhookConfigured, sendLead } from '../leadDelivery'
import { createTrackingFields } from '../trackingFields'
import { HiddenTrackingInputs } from '../components/HiddenTrackingInputs'
import { getCorporateContactError, type CorporateAudience, type CorporateContactMethod } from './corporateFormValidation'

const audiences = { agency: 'HR-агентство', employer: 'Работодатель' }
const channels: Record<CorporateContactMethod, string> = { phone: 'Телефон', email: 'Email', telegram: 'Telegram', whatsapp: 'WhatsApp' }
const initialFields = { name: '', contact: '', company: '', city: '', comment: '', consent: false }

type Props = {
  audience: CorporateAudience
  source: string
  onAudienceChange: (audience: CorporateAudience) => void
}

export function CorporateLeadForm({ audience, source, onAudienceChange }: Props) {
  const [fields, setFields] = useState(initialFields)
  const [method, setMethod] = useState<CorporateContactMethod>('phone')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [tracking] = useState(() => createTrackingFields('corporate-lead-form', 'corporate-training'))
  const started = useRef(false)
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const configured = isLeadWebhookConfigured()

  const update = <K extends keyof typeof fields>(key: K, value: typeof fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSubmitError('')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const nextErrors: Record<string, string> = {}
    if (!fields.name.trim()) nextErrors.name = 'Укажите имя'
    if (!audience) nextErrors.audience = 'Выберите тип организации'
    const contactError = getCorporateContactError(method, fields.contact)
    if (contactError) nextErrors.contact = contactError
    if (!fields.consent) nextErrors.consent = 'Нужно согласие на обработку персональных данных'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      trackEvent('corporate_form_submit_error', { source, audience, channel: method, reason: 'validation' })
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }
    submitting.current = true
    setStatus('loading')
    setSubmitError('')
    try {
      await sendLead({
        kind: 'lead_form',
        formName: 'Корпоративное обучение вождению',
        values: {
          name: fields.name.trim(),
          status: audience ? audiences[audience] : '',
          contactMethod: channels[method],
          phone: method === 'phone' || method === 'whatsapp' ? fields.contact.trim() : '',
          email: method === 'email' ? fields.contact.trim() : '',
          telegram: method === 'telegram' ? fields.contact.trim() : '',
          contact: fields.contact.trim(),
          company: fields.company.trim(),
          city: fields.city.trim(),
          comment: [
            method === 'email' || method === 'telegram' ? `${channels[method]}: ${fields.contact.trim()}` : '',
            fields.company.trim() ? `Компания: ${fields.company.trim()}` : '',
            fields.comment.trim(),
          ].filter(Boolean).join('\n'),
          consent: fields.consent,
          service: 'corporate-training',
        },
        tracking: { ...tracking, source },
      }, { requireConfirmation: true })
      setStatus('success')
      trackEvent('corporate_form_submit_success', { source, audience, channel: method })
    } catch {
      setStatus('idle')
      setSubmitError(configured ? 'Не удалось подтвердить отправку заявки. Проверьте соединение и попробуйте ещё раз. Введённые данные сохранены.' : 'Сейчас отправка формы недоступна. Попробуйте позже. Введённые данные сохранены.')
      trackEvent('corporate_form_submit_error', { source, audience, channel: method, reason: configured ? 'delivery' : 'not_configured' })
    } finally {
      submitting.current = false
    }
  }

  if (status === 'success') return <div className="corporate-success" role="status" aria-live="polite"><CheckCircle2 aria-hidden="true" /><h3>Заявка получена</h3><p>Свяжемся с вами, уточним задачу и обсудим стоимость и порядок участия.</p><button className="corporate-text-button" type="button" onClick={() => { setFields(initialFields); setStatus('idle'); started.current = false }}>Отправить ещё одну заявку</button></div>

  const error = (key: string) => errors[key] ? <small className="field-error" role="alert" id={`corporate-${key}-error`}>{errors[key]}</small> : null
  const invalid = (key: string) => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `corporate-${key}-error` : undefined })

  return (
    <form ref={formRef} className="corporate-form" onSubmit={submit} noValidate aria-busy={status === 'loading'} onFocusCapture={() => {
      if (!started.current) { started.current = true; trackEvent('corporate_form_start', { source, audience }) }
    }}>
      <HiddenTrackingInputs fields={{ ...tracking, source }} />
      {!configured ? <p className="corporate-form-notice" role="status">Сейчас отправка формы недоступна. Попробуйте позже.</p> : null}
      <fieldset disabled={status === 'loading'} className="corporate-form-fields">
        <legend className="corporate-visually-hidden">Данные для запроса условий</legend>
        <div className="corporate-field-row">
          <label><span>Имя <span aria-hidden="true">*</span></span><input name="name" value={fields.name} autoComplete="name" required {...invalid('name')} onChange={(e) => update('name', e.target.value)} />{error('name')}</label>
          <label><span>Тип организации <span aria-hidden="true">*</span></span><select name="audience" required value={audience} {...invalid('audience')} onChange={(e) => { onAudienceChange(e.target.value as CorporateAudience); setErrors((current) => ({ ...current, audience: '' })) }}><option value="">Выберите вариант</option><option value="agency">HR-агентство</option><option value="employer">Работодатель</option></select>{error('audience')}</label>
        </div>
        <fieldset className="corporate-channels"><legend>Как с вами связаться</legend>{(Object.keys(channels) as CorporateContactMethod[]).map((channel) => <label key={channel}><input type="radio" name="channel" checked={method === channel} value={channel} onChange={() => { setMethod(channel); update('contact', '') }} /><span>{channels[channel]}</span></label>)}</fieldset>
        <label><span>{method === 'email' ? 'Email' : method === 'telegram' ? 'Telegram: username или телефон' : method === 'whatsapp' ? 'Телефон WhatsApp' : 'Номер телефона'} <span aria-hidden="true">*</span></span><input name="contact" type={method === 'email' ? 'email' : method === 'telegram' ? 'text' : 'tel'} inputMode={method === 'email' ? 'email' : method === 'telegram' ? 'text' : 'tel'} autoComplete={method === 'email' ? 'email' : method === 'telegram' ? 'off' : 'tel'} placeholder={method === 'email' ? 'name@company.ru' : method === 'telegram' ? '@username или +7 900 000-00-00' : '+7 900 000-00-00'} required value={fields.contact} {...invalid('contact')} onChange={(e) => update('contact', e.target.value)} />{error('contact')}</label>
        <details className="corporate-extra"><summary>Добавить информацию о компании <span>необязательно</span></summary><div>
          <label><span>Название компании</span><input name="company" value={fields.company} autoComplete="organization" onChange={(e) => update('company', e.target.value)} /></label>
          <label><span>Город обучения</span><input name="city" value={fields.city} autoComplete="address-level2" onChange={(e) => update('city', e.target.value)} /></label>
          <label><span>Комментарий</span><textarea name="comment" value={fields.comment} rows={3} placeholder="Какая программа интересует и сколько сотрудников планируют учиться" onChange={(e) => update('comment', e.target.value)} /></label>
        </div></details>
        <label className="corporate-consent"><input name="consent" type="checkbox" required checked={fields.consent} {...invalid('consent')} onChange={(e) => update('consent', e.target.checked)} /><span>Согласен на <a href="./#personal-data-consent" target="_blank" rel="noreferrer">обработку персональных данных</a></span></label>{error('consent')}
        {submitError ? <p className="corporate-submit-error" role="alert">{submitError}</p> : null}
        <button className="button button--primary button--wide" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Отправляем…' : 'Получить условия'}<ArrowRight aria-hidden="true" /></button>
      </fieldset>
      <p className="corporate-form-note">После заявки свяжемся с вами, уточним задачу и обсудим стоимость и порядок участия.</p>
    </form>
  )
}
