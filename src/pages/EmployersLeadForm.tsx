import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '../analytics'
import { isLeadWebhookConfigured, sendLead } from '../leadDelivery'
import { createTrackingFields } from '../trackingFields'
import { HiddenTrackingInputs } from '../components/HiddenTrackingInputs'
import { paymentContent, taxContent } from './employersData'
import { getEmployerAttribution, type BuyerTaxRegime, type EmployerSelection } from './employersState'
import { validateEmployerForm, type EmployerContact, type EmployerFields } from './employersForm'

const initialFields: Omit<EmployerFields, 'city'> = { name: '', company: '', participants: '', comment: '', consent: false }
const channelLabels = { email: 'Email', telegram: 'Telegram', whatsapp: 'WhatsApp' }
type Props = { selection: EmployerSelection; source: string; city: string; requestTopic: string; onCityChange: (city: string) => void; onTaxChange: (tax: BuyerTaxRegime) => void }

export function EmployersLeadForm({ selection, source, city, requestTopic, onCityChange, onTaxChange }: Props) {
  const [fields, setFields] = useState(initialFields)
  const [method, setMethod] = useState<EmployerContact>('email')
  const [contacts, setContacts] = useState({ email: '', telegram: '', whatsapp: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [extraOpen, setExtraOpen] = useState(false)
  const [tracking] = useState(() => createTrackingFields('employer-lead-form', 'employers'))
  const [attribution] = useState(getEmployerAttribution)
  const formRef = useRef<HTMLFormElement>(null)
  const started = useRef(false)
  const submitting = useRef(false)
  const configured = isLeadWebhookConfigured()
  const content = paymentContent[selection.payment]
  const update = <K extends keyof typeof initialFields>(key: K, value: typeof initialFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSubmitError('')
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const nextErrors = validateEmployerForm({ ...fields, city }, method, contacts[method])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      if (nextErrors.participants) setExtraOpen(true)
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus())
      trackEvent('employer_form_submit_error', { payment_mode: selection.payment, source, reason: 'validation' })
      return
    }
    submitting.current = true
    setStatus('loading')
    setSubmitError('')
    const contact = contacts[method].trim()
    try {
      await sendLead({
        kind: 'lead_form', formName: 'Права для сотрудников — работодатель',
        values: {
          name: fields.name.trim(), company: fields.company.trim(), city: city.trim(),
          contactMethod: channelLabels[method], contact,
          email: method === 'email' ? contact : '', telegram: method === 'telegram' ? contact : '', phone: method === 'whatsapp' ? contact : '',
          status: content.label, payment_mode: selection.payment,
          ...(selection.payment === 'company' ? { buyer_tax_regime: selection.tax } : {}),
          participants: fields.participants || 'Пока не определено', topic: requestTopic,
          company_id: attribution.company_id, campaign_id: attribution.campaign_id,
          comment: [requestTopic ? `Тема: ${requestTopic}` : '', `Компания: ${fields.company.trim()}`, `${channelLabels[method]}: ${contact}`, `Формат: ${content.label}`, selection.payment === 'company' ? `Режим покупателя: ${taxContent[selection.tax].label}` : '', fields.participants ? `Участников: ${fields.participants}` : '', fields.comment.trim()].filter(Boolean).join('\n'),
          consent: fields.consent, consent_version: 'site-consent-2026-06-29', consented_at: new Date().toISOString(), service: 'employers',
        }, tracking: { ...tracking, source },
      }, { requireConfirmation: true })
      setStatus('success')
      trackEvent('employer_form_submit_success', { payment_mode: selection.payment, source })
    } catch {
      setStatus('idle')
      setSubmitError('Не удалось отправить заявку. Попробуйте ещё раз')
      trackEvent('employer_form_submit_error', { payment_mode: selection.payment, source, reason: configured ? 'delivery' : 'not_configured' })
    } finally { submitting.current = false }
  }
  const fieldError = (key: string) => key === 'city' && city.trim() ? '' : errors[key]
  const invalid = (key: string) => ({ 'aria-invalid': Boolean(fieldError(key)), 'aria-describedby': fieldError(key) ? `employer-${key}-error` : undefined })
  const error = (key: string) => fieldError(key) ? <small className="field-error" role="alert" id={`employer-${key}-error`}>{fieldError(key)}</small> : null
  if (status === 'success') return <div className="corporate-success" role="status" aria-live="polite"><CheckCircle2 aria-hidden="true" /><h3>Заявка отправлена.</h3><p>Менеджер свяжется с вами по указанному контакту</p><button className="corporate-text-button" type="button" onClick={() => { setFields(initialFields); onCityChange(''); setContacts({ email: '', telegram: '', whatsapp: '' }); setStatus('idle'); started.current = false }}>Оставить ещё одно обращение</button></div>
  return <form className="corporate-form employer-form" ref={formRef} noValidate onSubmit={submit} aria-busy={status === 'loading'} onFocusCapture={() => { if (!started.current) { started.current = true; trackEvent('employer_form_start', { payment_mode: selection.payment, source }) } }}>
    <HiddenTrackingInputs fields={{ ...tracking, source }} />
    {requestTopic ? <p className="employer-form-topic" role="status"><span>Тема обращения</span><strong>{requestTopic}</strong></p> : null}
    <input type="hidden" name="topic" value={requestTopic} readOnly />
    {!configured ? <p className="corporate-form-notice" role="status">Сейчас отправка формы недоступна. Попробуйте позже.</p> : null}
    <fieldset className="corporate-form-fields" disabled={status === 'loading'}><legend className="corporate-visually-hidden">Заявка работодателя</legend>
      <div className="corporate-field-row">
        <label><span>Имя *</span><input name="name" required autoComplete="name" value={fields.name} {...invalid('name')} onChange={(e) => update('name', e.target.value)} />{error('name')}</label>
        <label><span>Компания *</span><input name="company" required autoComplete="organization" value={fields.company} {...invalid('company')} onChange={(e) => update('company', e.target.value)} />{error('company')}</label>
      </div>
      <fieldset className="corporate-channels"><legend>Удобный способ связи</legend>{(Object.keys(channelLabels) as EmployerContact[]).map((channel) => <label key={channel}><input type="radio" name="channel" value={channel} checked={method === channel} onChange={() => { setMethod(channel); setErrors((current) => ({ ...current, contact: '' })); setSubmitError('') }} /><span>{channelLabels[channel]}</span></label>)}</fieldset>
      <label><span>{method === 'email' ? 'Рабочий email *' : method === 'telegram' ? 'Telegram: username или телефон *' : 'Телефон WhatsApp *'}</span><input name="contact" type={method === 'email' ? 'email' : method === 'telegram' ? 'text' : 'tel'} inputMode={method === 'email' ? 'email' : method === 'telegram' ? 'text' : 'tel'} required autoComplete={method === 'email' ? 'email' : method === 'whatsapp' ? 'tel' : 'off'} placeholder={method === 'email' ? 'hr@company.ru' : method === 'telegram' ? '@username или +7 900 000-00-00' : '+7 900 000-00-00'} value={contacts[method]} {...invalid('contact')} onChange={(e) => { setContacts((current) => ({ ...current, [method]: e.target.value })); setErrors((current) => ({ ...current, contact: '' })); setSubmitError('') }} />{error('contact')}</label>
      <label><span>Город обучения *</span><select name="city" required autoComplete="address-level2" value={city} {...invalid('city')} onChange={(e) => { onCityChange(e.target.value); setErrors((current) => ({ ...current, city: '' })); setSubmitError('') }}><option value="">Выберите город</option><option>Москва</option><option>Санкт-Петербург</option><option>Оба города</option></select>{error('city')}</label>
      <input type="hidden" name="payment" value={selection.payment} readOnly />
      <details className="corporate-extra" open={extraOpen} onToggle={(e) => setExtraOpen(e.currentTarget.open)}><summary>Уточнить задачу <span>необязательно</span></summary><div>
        {selection.payment === 'company' ? <label><span>Налоговый режим компании</span><select name="tax" value={selection.tax} onChange={e => onTaxChange(e.target.value as BuyerTaxRegime)}>{(Object.keys(taxContent) as BuyerTaxRegime[]).map(tax => <option key={tax} value={tax}>{taxContent[tax].label}</option>)}</select></label> : null}
        <label><span>Количество участников</span><input name="participants" type="number" min="1" step="1" placeholder="Пока не определено" value={fields.participants} {...invalid('participants')} onChange={(e) => update('participants', e.target.value)} />{error('participants')}</label>
        <label><span>Комментарий</span><textarea name="comment" rows={3} value={fields.comment} placeholder="Что важно учесть при подборе программы" onChange={(e) => update('comment', e.target.value)} /></label>
      </div></details>
      <label className="corporate-consent"><input name="consent" type="checkbox" required checked={fields.consent} {...invalid('consent')} onChange={(e) => update('consent', e.target.checked)} /><span>Согласен на <a href="./#personal-data-consent" target="_blank" rel="noreferrer">обработку персональных данных</a></span></label>{error('consent')}
      {submitError ? <p className="corporate-submit-error" role="alert">{submitError}</p> : null}
      <button className="button button--primary button--wide" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Отправляем…' : content.formCta}<ArrowRight aria-hidden="true" /></button>
    </fieldset>
    <p className="corporate-form-note">Менеджер свяжется с вами, уточнит города и формат участия, расскажет об условиях программы.</p>
  </form>
}
