import { LegalLinks } from '../components/LegalLinks'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Menu, X, Handshake, Phone, Mail } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { trackEvent } from '../analytics'
import employerHero from '../assets/hr-hero-company.webp'
import remoteCall from '../assets/hr-remote-call.webp'
import managerSupport from '../assets/hr-manager-support.webp'
import { EmployerLaunch } from './EmployerLaunch'
import { EmployerEmployeeJourney } from './EmployerEmployeeJourney'
import { EmployerProgrammes } from './EmployerProgrammes'
import { EmployersLeadForm } from './EmployersLeadForm'
import { employerFaq, paymentContent, taxContent } from './employersData'
import { employeeEnrollmentUrl, employerSelectionUrl, getEmployerAttribution, readEmployerSelection, type BuyerTaxRegime, type EmployerPayment, type EmployerSelection } from './employersState'
import './corporateTraining.css'
import './employers.css'

const modes: EmployerPayment[] = ['employee', 'company']
const taxModes: BuyerTaxRegime[] = ['osno', 'usn', 'unknown']

export default function EmployersPage() {
  const [selection, setSelection] = useState(() => readEmployerSelection(location.search))
  const [menuOpen, setMenuOpen] = useState(false)
  const [source, setSource] = useState('employer-contact')
  const [requestTopic, setRequestTopic] = useState('')
  const [leadCity, setLeadCity] = useState('')
  const [attribution] = useState(getEmployerAttribution)
  const menuButton = useRef<HTMLButtonElement>(null)
  const content = paymentContent[selection.payment]
  const companyPaid = selection.payment === 'company'
  const enrollmentLink = employeeEnrollmentUrl(import.meta.env.VITE_EMPLOYEE_ENROLLMENT_URL, attribution)

  useEffect(() => {
    const previousTitle = document.title
    const metadata = [
      { selector: 'meta[name="description"]', attribute: 'content', value: 'Права для сотрудников: корпоративная программа АСО для работодателей. Самостоятельная оплата сотрудником или безналичная оплата компанией.' },
      { selector: 'meta[property="og:title"]', attribute: 'content', value: 'Права для сотрудников — корпоративная программа АСО' },
      { selector: 'meta[property="og:description"]', attribute: 'content', value: 'Добавьте обучение вождению в соцпакет для своих сотрудников. Категории A и B, особые корпоративные условия обучения и два формата оплаты.' },
      { selector: 'link[rel="canonical"]', attribute: 'href', value: 'https://alyayumm.github.io/ASOash/?page=employers' },
    ].map((item) => { const element = document.querySelector(item.selector); return { ...item, element, previous: element?.getAttribute(item.attribute) ?? '' } })
    document.title = 'Права для сотрудников — программа для работодателей | АСО'
    metadata.forEach(({ element, attribute, value }) => element?.setAttribute(attribute, value))
    history.replaceState(null, '', employerSelectionUrl(location.href, readEmployerSelection(location.search)))
    const pop = () => setSelection(readEmployerSelection(location.search))
    window.addEventListener('popstate', pop)
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      document.title = previousTitle
      metadata.forEach(({ element, attribute, previous }) => element?.setAttribute(attribute, previous))
      window.removeEventListener('popstate', pop)
    }
  }, [])
  useEffect(() => { trackEvent('employer_payment_view', { payment_mode: selection.payment }) }, [selection.payment])

  const choose = (next: EmployerSelection) => {
    if (next.payment === selection.payment && next.tax === selection.tax) return
    setSelection(next)
    history.pushState(null, '', employerSelectionUrl(location.href, next))
    if (next.payment === 'company' && next.tax !== selection.tax) trackEvent('employer_tax_select', { buyer_tax_regime: next.tax })
  }
  const scrollTo = (id: string) => requestAnimationFrame(() => {
    const target = document.getElementById(id)
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  })
  const contact = (ctaSource: string, topic = '') => {
    setSource(ctaSource)
    setRequestTopic(topic)
    setMenuOpen(false)
    trackEvent('employer_cta_click', { source: ctaSource, payment_mode: selection.payment, ...(companyPaid ? { buyer_tax_regime: selection.tax } : {}) })
    scrollTo('employer-contact')
  }
  const navigation = (id: string) => {
    setMenuOpen(false)
    scrollTo(id)
  }
  const tabKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, activate: (index: number) => void, prefix: string) => {
    const nextIndex = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % count : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index - 1 + count) % count : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : -1
    if (nextIndex !== -1) { event.preventDefault(); activate(nextIndex); document.getElementById(`${prefix}-${nextIndex}`)?.focus() }
  }
  const navLinks = [ ['employer-programmes', 'Категории'], ['employer-launch', 'Запуск программы'], ['employer-referral', 'Кешбэк'], ['employer-faq', 'Вопросы'] ]

  return <div className="corporate-page employers-page">
    <a className="corporate-skip" href="#employer-content">К содержанию</a>
    <header className="corporate-header employer-header"><div className="content-shell corporate-header__inner">
      <a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo /></a>
      <nav className="employer-desktop-nav" aria-label="Навигация по программе">{navLinks.map(([id, label]) => <button type="button" key={id} onClick={() => navigation(id)}>{label}</button>)}</nav>
      <button className="button button--primary employer-header-cta" type="button" onClick={() => contact('header')}>Обсудить программу</button>
      <button ref={menuButton} className="employer-menu-toggle" type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="employer-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div>{menuOpen ? <nav id="employer-mobile-menu" className="employer-mobile-nav content-shell" aria-label="Мобильная навигация по программе" onKeyDown={(e) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() } }}>{navLinks.map(([id,label]) => <button key={id} type="button" onClick={() => navigation(id)}>{label}</button>)}</nav> : null}</header>
    <main id="employer-content" tabIndex={-1}>
      <section className="employer-hero" aria-labelledby="employer-title"><div className="content-shell">
        <div className="employer-hero-layout"><div className="employer-hero-copy">
          <p className="corporate-label">Корпоративная программа · Москва и Санкт-Петербург</p>
          <h1 id="employer-title">Добавьте обучение вождению <span>в соцпакет</span></h1>
          <p className="employer-hero-subtitle">Предложите команде обучение на особых корпоративных условиях. Компания может оплатить обучение или сотрудники оплатят его самостоятельно.</p>
          <p className="employer-hero-support">Подготовим материалы для запуска, поможем с оформлением и организуем начало обучения.</p>
          <div className="employer-hero-actions"><button className="button button--primary" type="button" onClick={() => contact('hero')}>Получить условия для компании<ArrowRight aria-hidden="true" /></button><button className="corporate-text-button" type="button" onClick={() => scrollTo('employer-launch')}>Как запустить программу<ArrowRight size={18} aria-hidden="true" /></button></div>
        </div><figure className="employer-hero-photo"><img src={employerHero} width={1448} height={1086} fetchPriority="high" alt="Сотрудники рядом с учебным автомобилем" /></figure></div>
        <ul className="employer-facts">{['Особые условия для сотрудников.', 'Готовые материалы для запуска.', 'Менеджер сопровождает участников.'].map(fact => <li key={fact}><Check size={20} aria-hidden="true" />{fact}</li>)}</ul>
      </div></section>

      <section className="employer-section employer-formats content-shell" id="employer-formats" tabIndex={-1} aria-labelledby="employer-formats-title">
        <div className="employer-formats-heading"><h2 id="employer-formats-title">Выберите, кто оплачивает обучение</h2>
          <div className="employer-format-actions">
          <div className="employer-payment-tabs" role="tablist" aria-label="Формат оплаты обучения">{modes.map((mode,index) => <button id={`employer-payment-${index}`} key={mode} role="tab" type="button" aria-label={paymentContent[mode].label} aria-selected={selection.payment === mode} aria-controls="employer-format-panel" tabIndex={selection.payment === mode ? 0 : -1} onClick={() => choose({ ...selection, payment: mode })} onKeyDown={(e) => tabKeys(e,index,2,(i) => choose({ ...selection, payment: modes[i] }), 'employer-payment')}>
            <Check size={16} aria-hidden="true" /><span>{mode === 'employee' ? 'Сам сотрудник' : 'Компания'}</span>
          </button>)}</div>
          <button className="corporate-text-button employer-format-cta" type="button" onClick={() => contact('payment-format')}>{content.formCta}<ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
        <p className="employer-format-summary" aria-live="polite" aria-atomic="true">{content.summary}</p>
      </section>

      <div id="employer-format-panel" role="tabpanel" aria-labelledby={`employer-payment-${modes.indexOf(selection.payment)}`}>
        <EmployerProgrammes onRequest={(city, topic) => { setLeadCity(city); contact('programme', topic) }} />
        <EmployerLaunch companyPaid={companyPaid} onRequest={() => contact('programme-launch')} />
        {!companyPaid ? <EmployerEmployeeJourney enrollmentLink={enrollmentLink} /> : <section className="employer-section content-shell employer-journey" id="employer-process" tabIndex={-1} aria-labelledby="employer-process-title">
          <div className="employer-section-heading"><p className="corporate-label">Оформление и поддержка</p><h2 id="employer-process-title">Как сотрудники воспользуются программой</h2></div>
          <p className="employer-company-journey">После оплаты счёта компанией менеджер свяжется с участниками, поможет с оформлением и направит документы и инструкции по началу обучения.</p>
          <div className="employer-journey-support"><img src={managerSupport} width={1448} height={1086} loading="lazy" alt="Наш менеджер в гарнитуре за ноутбуком" /><div><h3>Дальше сотрудник общается с нашим менеджером напрямую</h3><p>По вопросам оформления, документов и начала обучения.</p></div></div>
        </section>}
      </div>

      <section className="employer-section employer-online"><div className="content-shell employer-online-layout"><div><p className="corporate-label">Для команды из разных офисов</p><h2>Расскажем команде об обучении онлайн</h2><p>Объясним условия программы и порядок оформления, ответим на вопросы сотрудников. Подключиться смогут коллеги из разных офисов и те, кто работает удалённо. Возможность и формат встречи согласуем с вами.</p></div><img src={remoteCall} width={1672} height={941} loading="lazy" alt="Онлайн-встреча команды из разных офисов" /></div></section>

      <section className="employer-section content-shell" id="employer-referral" tabIndex={-1} aria-labelledby="employer-referral-title"><div className="employer-referral"><div><p className="corporate-label"><Handshake size={24} aria-hidden="true" />Реферальная программа</p><h2 id="employer-referral-title">Дополнительная выгода для вашей компании</h2><p>В рамках сотрудничества можно подключить реферальную программу с кешбэком для вашей компании. Менеджер расскажет об условиях участия и начисления.</p></div><button className="button button--primary" type="button" onClick={() => contact('referral', 'Условия реферальной программы')}>Узнать условия кешбэка<ArrowRight size={18} aria-hidden="true" /></button></div></section>

      {companyPaid ? <section className="employer-section employer-docs" id="employer-tax" tabIndex={-1} aria-labelledby="employer-tax-title">
        <div className="content-shell employer-docs-layout">
          <div><p className="corporate-label">Оплата и документы</p><h2 id="employer-tax-title">Оплата и документы для компании</h2><p>Уточним требования вашей бухгалтерии и согласуем порядок оплаты и документы.</p></div>
          <div className="employer-docs-detail">
            <div className="employer-tax-tabs" role="tablist" aria-label="Налоговый режим покупателя">{taxModes.map((tax, index) => <button key={tax} id={`employer-tax-tab-${index}`} type="button" role="tab" aria-selected={selection.tax === tax} aria-controls="employer-tax-panel" tabIndex={selection.tax === tax ? 0 : -1} onClick={() => choose({ ...selection, tax })} onKeyDown={(event) => tabKeys(event, index, taxModes.length, next => choose({ ...selection, tax: taxModes[next] }), 'employer-tax-tab')}>{taxContent[tax].label}</button>)}</div>
            <div id="employer-tax-panel" role="tabpanel" aria-labelledby={`employer-tax-tab-${taxModes.indexOf(selection.tax)}`}>
              <h3>{taxContent[selection.tax].title}</h3><p>{taxContent[selection.tax].text}</p>
              <button className="corporate-text-button" type="button" onClick={() => contact('accounting', `Оплата и документы · ${taxContent[selection.tax].label}`)}>{taxContent[selection.tax].cta}<ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </section> : null}

      <section className="corporate-faq employer-section" id="employer-faq" tabIndex={-1} aria-labelledby="employer-faq-title"><div className="content-shell corporate-faq__layout"><div><p className="corporate-label">Перед запуском</p><h2 id="employer-faq-title">Ответы для HR</h2></div><div>{employerFaq.map(item => <details key={item.question}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

      <section className="employer-section content-shell employer-contact" id="employer-contact" tabIndex={-1} aria-labelledby="employer-contact-title"><div><p className="corporate-label">{content.label}</p><h2 id="employer-contact-title">Получите условия для вашей компании</h2><p>Уточним города, категории и формат оплаты, затем подготовим предложение для вашей команды.</p>
        <address className="employer-direct-contacts" aria-label="Связаться с нами напрямую">
          <a href="tel:+79990082719"><Phone size={22} aria-hidden="true" /><span><small>Телефон</small><strong>+7 999 008-27-19</strong></span></a>
          <a href="mailto:aso-autoschool@yandex.ru"><Mail size={22} aria-hidden="true" /><span><small>Электронная почта</small><strong>aso-autoschool@yandex.ru</strong></span></a>
        </address>
        <a className="corporate-back" href="./"><ArrowLeft size={18} aria-hidden="true" />На главную</a></div><div className="employer-contact-form"><EmployersLeadForm selection={selection} source={source} city={leadCity} requestTopic={requestTopic} onCityChange={setLeadCity} onTaxChange={tax => choose({ ...selection, tax })} /></div></section>
    </main>
    <footer className="corporate-footer"><div className="content-shell"><a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo inverse /></a><p>Корпоративная программа для работодателей</p><LegalLinks /></div></footer>
  </div>
}
