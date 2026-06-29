import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react'
import { trackEvent } from '../analytics'
import type { QuizAnswers } from '../types'

type QuizDialogProps = {
  open: boolean
  onClose: () => void
  initialStatus?: string
}

const initialAnswers: QuizAnswers = {
  status: '',
  region: '',
  branches: '',
  task: '',
  problem: '',
  result: '',
  name: '',
  phone: '',
  consent: false,
}

const steps = [
  { key: 'status', title: 'На каком этапе вы сейчас?', options: ['Есть действующая автошкола', 'Планирую запуск', 'Ищу готовую систему'] },
  { key: 'region', title: 'В каком регионе находится проект?', placeholder: 'Город или регион' },
  { key: 'branches', title: 'Сколько филиалов работает сейчас?', options: ['Пока нет', 'Один', 'Два–три', 'Четыре и больше'] },
  { key: 'task', title: 'Какая задача сейчас главная?', options: ['Увеличить продажи', 'Навести порядок в управлении', 'Подготовить запуск', 'Масштабировать сеть'] },
  { key: 'problem', title: 'Что сильнее всего мешает?', options: ['Нет общей аналитики', 'Продажи зависят от людей', 'Собственник в операционке', 'Нет единых процессов'] },
  { key: 'result', title: 'Какой результат хотите обсудить?', placeholder: 'Опишите своими словами' },
  { key: 'contact', title: 'Куда можно вернуться с разбором?' },
] as const

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11)
  const normalized = digits.startsWith('7') ? digits : `7${digits}`
  const rest = normalized.slice(1)
  let result = '+7'
  if (rest.length) result += ` (${rest.slice(0, 3)}`
  if (rest.length >= 3) result += ')'
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`
  return result
}

function answersWithStatus(status = ''): QuizAnswers {
  return { ...initialAnswers, status }
}

export function QuizDialog({ open, onClose, initialStatus = '' }: QuizDialogProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const [step, setStep] = useState(() => (initialStatus ? 1 : 0))
  const [answers, setAnswers] = useState(() => answersWithStatus(initialStatus))
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (!open) return
    restoreFocusRef.current = document.activeElement as HTMLElement
    const dialog = dialogRef.current
    dialog?.querySelector<HTMLElement>('button, input, textarea')?.focus()
    document.body.classList.add('modal-open')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
      restoreFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const current = steps[step]
  const setAnswer = (key: keyof QuizAnswers, value: string | boolean) => {
    setAnswers((previous) => ({ ...previous, [key]: value }))
    setError('')
  }

  const validate = () => {
    if (current.key === 'contact') {
      if (!answers.name.trim() || answers.phone.replace(/\D/g, '').length < 11 || !answers.consent) {
        setError('Заполните имя, полный номер телефона и подтвердите согласие')
        return false
      }
      return true
    }
    const value = answers[current.key as keyof QuizAnswers]
    if (!value) {
      setError('Выберите или заполните ответ')
      return false
    }
    return true
  }

  const next = () => {
    if (!validate()) return
    if (step === steps.length - 1) {
      setComplete(true)
      trackEvent('quiz_submit', { status: answers.status })
      return
    }
    const nextStep = step + 1
    setStep(nextStep)
    trackEvent('quiz_step', { step: nextStep + 1 })
  }

  const close = () => {
    onClose()
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={dialogRef} className="quiz-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button className="icon-button quiz-dialog__close" type="button" onClick={close} aria-label="Закрыть диагностику"><X aria-hidden="true" /></button>
        {complete ? (
          <div className="quiz-complete" role="status" aria-live="polite">
            <CheckCircle2 aria-hidden="true" />
            <h2 id={titleId}>Ответы сохранены</h2>
            <p>Это локальная демонстрация. После подключения backend ответы будут передаваться менеджеру вместе с контактами.</p>
            <button className="button button--primary" type="button" onClick={close}>Закрыть</button>
          </div>
        ) : (
          <>
            <div className="quiz-dialog__meta">
              <span>Диагностика ситуации</span>
              <span>{step + 1} / {steps.length}</span>
            </div>
            <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <h2 id={titleId}>{current.title}</h2>
            <div className="quiz-answer">
              {'options' in current ? (
                <div className="quiz-options">
                  {current.options.map((option) => {
                    const key = current.key as keyof QuizAnswers
                    return (
                      <button key={option} type="button" className={answers[key] === option ? 'quiz-option is-selected' : 'quiz-option'} onClick={() => setAnswer(key, option)}>
                        {option}
                      </button>
                    )
                  })}
                </div>
              ) : current.key === 'contact' ? (
                <div className="quiz-contact">
                  <label><span>Имя</span><input value={answers.name} onChange={(event) => setAnswer('name', event.target.value)} autoComplete="name" /></label>
                  <label><span>Телефон</span><input value={answers.phone} onChange={(event) => setAnswer('phone', formatPhone(event.target.value))} inputMode="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" /></label>
                  <label className="consent"><input type="checkbox" checked={answers.consent} onChange={(event) => setAnswer('consent', event.target.checked)} /><span>Согласен на <a href="#personal-data-consent" target="_blank" rel="noreferrer">обработку персональных данных</a></span></label>
                </div>
              ) : current.key === 'result' ? (
                <textarea value={answers.result} onChange={(event) => setAnswer('result', event.target.value)} rows={5} placeholder={current.placeholder} autoFocus />
              ) : (
                <input value={answers.region} onChange={(event) => setAnswer('region', event.target.value)} placeholder={current.placeholder} autoFocus />
              )}
            </div>
            {error ? <p className="quiz-error" role="alert">{error}</p> : null}
            <div className="quiz-dialog__actions">
              <button className="button button--ghost" type="button" onClick={() => { setStep((currentStep) => Math.max(0, currentStep - 1)); setError('') }} disabled={step === 0}>
                <ArrowLeft aria-hidden="true" /> Назад
              </button>
              <button className="button button--primary" type="button" onClick={next}>
                {step === steps.length - 1 ? 'Сохранить ответы' : 'Продолжить'} <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
