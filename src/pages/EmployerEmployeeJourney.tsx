import { ArrowRight, Check, FileText, ShieldCheck } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { trackEvent } from '../analytics'
import { employeeSteps } from './employersData'
import './employerRoadmap.css'

const visualKinds = ['promo', 'payment', 'manager'] as const

function RoadmapVisual({ kind }: { kind: typeof visualKinds[number] }) {
  return <div className="employer-roadmap-visual" aria-hidden="true">
    {kind === 'promo' ? <div className="employer-roadmap-phone">
      <BrandLogo />
      <strong>Введите промокод</strong>
      <span className="employer-roadmap-input">KOMANDA26</span>
      <span className="employer-roadmap-action">Применить</span>
    </div> : null}
    {kind === 'payment' ? <div className="employer-roadmap-window">
      <div className="employer-roadmap-window-heading">Оформление обучения<ShieldCheck size={26} /></div>
      <div className="employer-roadmap-window-body">
        <strong>Категория B</strong>
        <span>Корпоративные условия</span>
        <div className="employer-roadmap-rule" />
        <span className="employer-roadmap-action employer-roadmap-action--red">Оплата обучения</span>
      </div>
    </div> : null}
    {kind === 'manager' ? <div className="employer-roadmap-window">
      <div className="employer-roadmap-window-heading">Наш менеджер</div>
      <div className="employer-roadmap-window-body">
        <div className="employer-roadmap-document"><FileText size={34} /><strong>Документы<br />и инструкции</strong></div>
        <div className="employer-roadmap-messengers"><span>Telegram</span><span>WhatsApp</span></div>
      </div>
    </div> : null}
  </div>
}

export function EmployerEmployeeJourney({ enrollmentLink }: { enrollmentLink?: string | null }) {
  return <section className="employer-section employer-process" id="employer-process" tabIndex={-1} aria-labelledby="employer-process-title">
    <div className="content-shell">
      <div className="employer-roadmap-heading"><span>Путь сотрудника</span></div>
      <div className="employer-section-heading">
        <h2 id="employer-process-title">Как сотрудники воспользуются программой</h2>
        <p>Сотрудник проходит три шага. Наш менеджер помогает с оформлением и началом обучения.</p>
      </div>
      <ol className="employer-roadmap">
        {employeeSteps.map((step, index) => <li key={step.title}>
          <div className="employer-roadmap-node"><span>0{index + 1}</span></div>
          <div className="employer-step-card">
            <RoadmapVisual kind={visualKinds[index]} />
            <div className="employer-step-copy"><h3>{step.title}</h3><p>{step.text}</p></div>
          </div>
        </li>)}
      </ol>
      <div className="employer-process-result">
        <Check size={26} aria-hidden="true" />
        <div><h3>Дальше сотрудник общается с нашим менеджером напрямую</h3><p>По вопросам оформления, документов и начала обучения.</p></div>
      </div>
      {enrollmentLink ? <a className="corporate-text-button employer-roadmap-link" href={enrollmentLink} target="_blank" rel="noreferrer" onClick={() => trackEvent('employee_offer_open', { source: 'employee-roadmap' })}>Открыть предложение для сотрудника<ArrowRight size={18} aria-hidden="true" /></a> : null}
    </div>
  </section>
}
