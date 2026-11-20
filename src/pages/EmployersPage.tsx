import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, ChevronDown, Menu, X } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { trackEvent } from '../analytics'
import employeeHero from '../assets/hr-driver-practice.webp'
import companyHero from '../assets/hr-hero-company.webp'
import remoteCall from '../assets/hr-remote-call.webp'
import managerSupport from '../assets/hr-manager-support.webp'
import { EmployerRoadmapVisual } from './EmployerRoadmapVisual'
import { EmployerLaunch } from './EmployerLaunch'
import { EmployerPrices } from './EmployerPrices'
import { employeeDiscount, employerPriceCities, formatEmployerPrice } from './employersPricing'
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
      { selector: 'meta[property="og:description"]', attribute: 'content', value: 'Добавьте обучение категории B в программу льгот. Два формата оплаты, сопровождение и согласованные условия для команды.' },
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
  const contact = (ctaSource: string) => {
    setSource(ctaSource)
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
  const navLinks = [ ['employer-formats', 'Форматы участия'], ['employer-launch', 'Как это работает'], ['employer-tax', 'Документы'], ['employer-faq', 'Вопросы'] ]

  return <div className="corporate-page employers-page">
    <a className="corporate-skip" href="#employer-content">К содержанию</a>
    <header className="corporate-header employer-header"><div className="content-shell corporate-header__inner">
      <a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo /></a>
      <nav className="employer-desktop-nav" aria-label="Навигация по программе">{navLinks.map(([id, label]) => <button type="button" key={id} onClick={() => navigation(id)}>{label}</button>)}</nav>
      <button className="button button--primary employer-header-cta" type="button" onClick={() => contact('header')}>Обсудить программу</button>
      <button ref={menuButton} className="employer-menu-toggle" type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="employer-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div>{menuOpen ? <nav id="employer-mobile-menu" className="employer-mobile-nav content-shell" aria-label="Мобильная навигация по программе" onKeyDown={(e) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() } }}>{navLinks.map(([id,label]) => <button key={id} type="button" onClick={() => navigation(id)}>{label}</button>)}</nav> : null}</header>
    <main id="employer-content" tabIndex={-1}>
      <section className="employer-hero" aria-labelledby="employer-title"><div className="content-shell employer-hero-layout"><div className="employer-hero-copy">
        <p className="corporate-label">Корпоративная программа</p>
        <h1 id="employer-title">{content.heroLead} <span>{content.heroAccent}</span></h1>
        <p>{content.heroText}</p>
        {!companyPaid ? <p className="employer-price-proof">На {formatEmployerPrice(employeeDiscount)} ниже стоимости по нашему прайсу</p> : null}
        <div className="employer-hero-actions"><button className="button button--primary" type="button" onClick={() => contact('hero')}>{content.heroCta}<ArrowRight aria-hidden="true" /></button><button className="corporate-text-button" type="button" onClick={() => scrollTo('employer-launch')}>{content.secondaryCta}<ArrowRight size={18} aria-hidden="true" /></button></div>
        <ul className="employer-facts">{content.heroFacts.map(fact => <li key={fact}><Check size={18} aria-hidden="true" />{fact}</li>)}</ul>
      </div><figure className="employer-hero-photo"><img src={companyPaid ? companyHero : employeeHero} width={1448} height={1086} fetchPriority="high" alt={companyPaid ? 'Сотрудники рядом с учебным автомобилем АСО' : 'Женщина за рулём учебного автомобиля в фирменной форме АСО'} /></figure></div></section>

      <section className="employer-section content-shell" id="employer-formats" tabIndex={-1} aria-labelledby="employer-formats-title"><div className="employer-section-heading"><p className="corporate-label">Два формата участия</p><h2 id="employer-formats-title">Выберите, кто оплачивает обучение</h2></div>
        <div className="employer-payment-tabs" role="tablist" aria-label="Формат оплаты обучения">{modes.map((mode,index) => <button id={`employer-payment-${index}`} key={mode} role="tab" type="button" aria-selected={selection.payment === mode} aria-controls="employer-format-panel" tabIndex={selection.payment === mode ? 0 : -1} onClick={() => choose({ ...selection, payment: mode })} onKeyDown={(e) => tabKeys(e,index,2,(i) => choose({ ...selection, payment: modes[i] }), 'employer-payment')}>
          <span className="employer-tab-status">{selection.payment === mode ? <><Check size={18} aria-hidden="true" />Выбранный формат</> : 'Выбрать формат →'}</span><strong>{paymentContent[mode].label}</strong>
          <span className="employer-format-summary">{paymentContent[mode].summary}</span>
        </button>)}</div>
      </section>

      <EmployerLaunch companyPaid={companyPaid} onRequest={() => contact('programme-launch')} />

      {!companyPaid ? <EmployerPrices onRequest={(city, programme) => {
        setLeadCity(employerPriceCities[city].label)
        contact(`pricing-${city}-${programme}`)
      }} /> : null}

      {!companyPaid ? <section className="employer-process employer-section" id="employer-process" tabIndex={-1} aria-labelledby="employer-process-title"><div className="content-shell"><div className="employer-roadmap-heading"><BrandLogo /><span>Путь сотрудника</span></div><div className="employer-section-heading"><h2 id="employer-process-title">Как сотрудники воспользуются программой</h2><p>{content.processText}</p></div>
        <ol className="employer-roadmap">{content.steps.map((step,index) => <li key={step.visual}><div className="employer-roadmap-node"><span>0{index+1}</span></div><div className="employer-step-card"><EmployerRoadmapVisual kind={step.visual} /><div className="employer-step-copy"><h3>{step.title}</h3><p>{step.text}</p></div></div></li>)}</ol>
        <p className="employer-process-result"><Check size={23} aria-hidden="true" /><strong>{content.processResult}</strong></p>
        {enrollmentLink ? <a className="corporate-text-button" href={enrollmentLink} target="_blank" rel="noreferrer" onClick={() => trackEvent('employee_offer_open', { source: 'employee-roadmap' })}>Открыть предложение для сотрудника <ArrowRight size={18} aria-hidden="true" /></a> : <button className="corporate-text-button" type="button" onClick={() => contact('employee-enrollment-consultation')}>Обсудить подключение с менеджером <ArrowRight size={18} aria-hidden="true" /></button>}
      </div></section> : null}

      <section className="employer-section content-shell employer-benefits" aria-label="Поддержка команды">
        <div className="employer-remote"><div className="employer-remote-copy"><p className="corporate-label">Для команды из разных офисов</p><h2>Обсудим онлайн-встречу для команды</h2><p>{companyPaid ? 'На встрече расскажем сотрудникам об условиях обучения, объясним порядок оформления и ответим на вопросы. Участвовать смогут коллеги из разных офисов и те, кто работает удалённо.' : 'На встрече расскажем сотрудникам об условиях обучения, покажем, как применить промокод, и ответим на вопросы. Участвовать смогут коллеги из разных офисов и те, кто работает удалённо.'}</p><span>Возможность и формат встречи обсудим с вами.</span></div><img src={remoteCall} width={1672} height={941} loading="lazy" alt="Сотрудница участвует в видеовстрече команды, на столе кружка АСО" /></div>
        <div className="employer-manager-feature"><img src={managerSupport} width={1448} height={1086} loading="lazy" alt="Наш менеджер в гарнитуре за ноутбуком" /><div><p className="corporate-label">Персональное сопровождение</p><h2>Сотрудники обращаются к нам напрямую</h2><p>{companyPaid ? 'После оплаты компанией наш менеджер свяжется с участниками, поможет с оформлением и направит информацию о старте обучения. Сотрудники смогут обращаться к нему напрямую.' : 'После оплаты наш менеджер направит договор и инструкции в выбранный мессенджер. С вопросами об оформлении и начале обучения сотрудник сможет обращаться к нему напрямую.'}</p><div className="employer-support-note"><FileText size={24} aria-hidden="true" /><span>{companyPaid ? 'HR не нужно пересылать участникам инструкции по началу обучения.' : 'HR не нужно собирать оплаты и пересылать документы.'}</span></div></div></div>
      </section>

      <section className="employer-docs employer-section" id="employer-tax" tabIndex={-1} aria-labelledby="employer-tax-title">
        <div className="content-shell employer-docs-layout">
          <div><p className="corporate-label">Оплата и документы</p><h2 id="employer-tax-title">{companyPaid ? 'Оплата и документы для компании' : 'Цена и условия — до оплаты'}</h2><p>{companyPaid ? 'Уточним требования вашей бухгалтерии и согласуем порядок оплаты и документы.' : 'До оплаты сотрудник знакомится с программой, итоговой стоимостью и условиями договора, указывает контакт и выбирает мессенджер для получения документов и инструкций.'}</p></div>
          <div className="employer-docs-detail">{companyPaid ? <>
            <div className="employer-tax-tabs" role="tablist" aria-label="Налоговый режим покупателя">{taxModes.map((tax,index) => <button key={tax} id={`employer-tax-tab-${index}`} type="button" role="tab" aria-selected={selection.tax === tax} aria-controls="employer-tax-panel" tabIndex={selection.tax === tax ? 0 : -1} onClick={() => choose({ ...selection, tax })} onKeyDown={(e) => tabKeys(e,index,3,(i) => choose({ ...selection,tax:taxModes[i] }),'employer-tax-tab')}>{taxContent[tax].label}</button>)}</div>
            <div id="employer-tax-panel" role="tabpanel" aria-labelledby={`employer-tax-tab-${taxModes.indexOf(selection.tax)}`}><h3>{taxContent[selection.tax].title}</h3><p>{taxContent[selection.tax].text}</p><button className="corporate-text-button" type="button" onClick={() => contact('accounting')}>{taxContent[selection.tax].cta}<ArrowRight size={18} aria-hidden="true" /></button></div>
          </> : <><FileText size={34} aria-hidden="true" /><h3>Документы и инструкции</h3><p>После подтверждения оплаты — напрямую сотруднику в выбранный мессенджер.</p><button className="corporate-text-button" type="button" onClick={() => contact('documents')}>Обсудить с менеджером<ArrowRight size={18} aria-hidden="true" /></button></>}</div>
        </div>
      </section>

      <section className="corporate-faq employer-section" id="employer-faq" tabIndex={-1} aria-labelledby="employer-faq-title"><div className="content-shell corporate-faq__layout"><div><p className="corporate-label">Перед запуском</p><h2 id="employer-faq-title">Ответы для HR</h2><p className="employer-provider">Мы организуем подключение и сопровождение. Обучает выбранная партнёрская автошкола: исполнителя и сведения о лицензии уточняем до оформления.</p></div><div>{employerFaq(companyPaid).map((item) => <details key={item.question}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

      <section className="employer-section content-shell employer-contact" id="employer-contact" tabIndex={-1} aria-labelledby="employer-contact-title">
        <div><p className="corporate-label">{content.label}</p><h2 id="employer-contact-title">Получите предложение для вашей компании</h2><p>Оставьте контакт — обсудим условия программы для ваших сотрудников.</p><a className="corporate-back" href="./"><ArrowLeft size={18} aria-hidden="true" />На главную</a></div>
        <div className="employer-contact-form"><EmployersLeadForm selection={selection} source={source} city={leadCity} onCityChange={setLeadCity} onTaxEdit={() => scrollTo('employer-tax')} /></div>
      </section>
    </main>
    <footer className="corporate-footer"><div className="content-shell"><a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo inverse /></a><p>Корпоративная программа для работодателей</p><a href="./#personal-data-consent" target="_blank" rel="noreferrer">Обработка персональных данных</a></div></footer>
  </div>
}
