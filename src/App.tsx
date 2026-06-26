import { useCallback, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ClipboardCheck,
  Gauge,
  LineChart,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { trackEvent } from './analytics'
import { BrandLogo } from './components/BrandLogo'
import { LeadForm } from './components/LeadForm'
import { QuizDialog } from './components/QuizDialog'
import {
  CONTACTS,
  audiencePaths,
  evidenceItems,
  faqItems,
  problems,
  processSteps,
  transformationAreas,
} from './data'
import type { Contacts, TransformationArea } from './types'

const navItems = [
  { href: '#directions', label: 'Направления' },
  { href: '#system', label: 'Система' },
  { href: '#process', label: 'Как работаем' },
  { href: '#founders', label: 'Команда' },
  { href: '#contact', label: 'Контакты' },
]

const scenarioStatusByPath = {
  growth: 'Есть действующая автошкола',
  launch: 'Планирую запуск',
  system: 'Ищу готовую систему',
} as const

const directionCards = [
  {
    id: 'growth',
    label: 'Развитие',
    title: 'Действующая автошкола',
    text: 'Собираем экономику, маркетинг, продажи и филиалы в управляемую модель.',
    art: 'chart',
  },
  {
    id: 'launch',
    label: 'Запуск',
    title: 'Автошкола с нуля',
    text: 'Проектируем маршрут запуска до первых затрат и случайных решений.',
    art: 'route',
  },
  {
    id: 'system',
    label: 'Система',
    title: 'Готовый контур управления',
    text: 'Внедряем стандарты и инструменты так, чтобы контроль оставался у владельца.',
    art: 'speed',
  },
] as const

const iconSystemAsset = `${import.meta.env.BASE_URL}assets/creative-icon-system.png`
const teamPhotoAsset = `${import.meta.env.BASE_URL}assets/aso-team-group.jpg`

const lossFunnelRows = [
  {
    stage: 'Заявки',
    reason: 'Разные данные',
    detail: 'Маркетинг и продажи считают результат по-разному',
    potentialWidth: 84,
    lossWidth: 16,
  },
  {
    stage: 'Продажи',
    reason: 'Нет общей картины',
    detail: 'Переходы между этапами видны не полностью',
    potentialWidth: 70,
    lossWidth: 18,
  },
  {
    stage: 'Договоры',
    reason: 'План без факта',
    detail: 'План не связан с реальными действиями команды',
    potentialWidth: 56,
    lossWidth: 14,
  },
  {
    stage: 'Решения',
    reason: 'Решения на ощущениях',
    detail: 'Собственник собирает выводы вручную',
    potentialWidth: 46,
    lossWidth: 12,
  },
]

const systemModules = [
  { title: 'Диагностика', text: 'Проверяем данные, роли и процессы.' },
  { title: 'Стратегия', text: 'Фиксируем приоритеты и управленческий контур.' },
  { title: 'Маркетинг', text: 'Связываем каналы с обращениями и договорами.' },
  { title: 'Продажи', text: 'Настраиваем этапы и контроль обработки.' },
  { title: 'Процессы', text: 'Определяем правила и зоны ответственности.' },
  { title: 'Аналитика', text: 'Собираем общую картину для решений.' },
  { title: 'Сопровождение', text: 'Помогаем команде закрепить новый ритм.' },
]

const deliverables = [
  'Управленческая отчётность',
  'CRM-воронка и правила работы',
  'Планирование и контроль показателей',
  'Стандарты и чек-листы',
  'Зоны ответственности',
  'Система регулярных планёрок',
  'Сравнение филиалов по единым правилам',
  'Инструменты принятия решений',
]

const objections = [
  {
    title: '«Я не хочу отдавать управление»',
    text: 'И не нужно. Мы настраиваем систему внутри вашей компании и передаём владельцу правила контроля.',
  },
  {
    title: '«У нас особенный регион»',
    text: 'Регион учитывается в диагностике. Базовая управленческая логика адаптируется к вашим данным и модели работы.',
  },
  {
    title: '«Команда не примет новые правила»',
    text: 'Внедрение включает работу с сотрудниками и первые циклы применения, а не только выдачу документов.',
  },
  {
    title: '«Сначала хочу понять объём изменений»',
    text: 'Для этого и нужен предварительный разбор: определить задачу и решить, нужна ли глубокая диагностика.',
  },
]

function ManagementPreview() {
  return (
    <div className="management-preview" aria-label="Пример управленческой системы без реальных данных">
      <div className="preview-orbit preview-orbit--one" aria-hidden="true" />
      <div className="preview-orbit preview-orbit--two" aria-hidden="true" />
      <article className="glass-panel preview-panel preview-panel--plan">
        <div className="preview-panel__heading"><span>План / факт</span><LineChart aria-hidden="true" /></div>
        <div className="bar-chart" aria-hidden="true">
          {[38, 52, 44, 66, 58, 76].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
        </div>
        <p>Динамика по периодам</p>
      </article>
      <article className="glass-panel preview-panel preview-panel--funnel">
        <div className="preview-panel__heading"><span>CRM-воронка</span><Users aria-hidden="true" /></div>
        <div className="funnel" aria-hidden="true"><i /><i /><i /><i /></div>
        <p>Переходы между этапами</p>
      </article>
      <article className="glass-panel preview-panel preview-panel--branches">
        <div className="preview-panel__heading"><span>Филиалы</span><Building2 aria-hidden="true" /></div>
        <div className="branch-lines" aria-hidden="true">
          <span><i style={{ width: '72%' }} /></span>
          <span><i style={{ width: '54%' }} /></span>
          <span><i style={{ width: '63%' }} /></span>
        </div>
        <p>Сравнение по единым правилам</p>
      </article>
    </div>
  )
}

function TransformationVisual({ area }: { area: TransformationArea }) {
  return (
    <div className={`transformation-visual transformation-visual--${area.id}`}>
      <div className="transformation-visual__topline">
        <span>{area.number}</span>
        <p>{area.outcome}</p>
      </div>
      <div className="transformation-diagram" aria-hidden="true">
        <div className="diagram-core"><Gauge /><span>Единая картина</span></div>
        {area.artifacts.map((artifact, index) => (
          <div className={`diagram-node diagram-node--${index + 1}`} key={artifact}>
            <span>{artifact}</span>
          </div>
        ))}
        <svg viewBox="0 0 600 330" preserveAspectRatio="none">
          <path d="M300 165 C220 95, 180 70, 95 80" />
          <path d="M300 165 C390 90, 430 55, 520 80" />
          <path d="M300 165 C360 230, 430 255, 500 270" />
        </svg>
      </div>
    </div>
  )
}

function DirectionArt({ type }: { type: (typeof directionCards)[number]['art'] }) {
  return (
    <div className={`direction-art direction-art--${type}`} aria-hidden="true">
      <span className={`direction-ref-icon direction-ref-icon--${type}`} style={{ backgroundImage: `url(${iconSystemAsset})` }} />
      {type === 'chart' ? <><i /><i /><i /><b /></> : null}
      {type === 'route' ? <><i /><i /><i /><b /></> : null}
      {type === 'speed' ? <><i /><b /><em /></> : null}
    </div>
  )
}

function MessengerButton({ kind, contacts }: { kind: 'telegram' | 'whatsapp'; contacts: Contacts }) {
  const href = contacts[kind]
  const label = kind === 'telegram' ? 'Telegram' : 'WhatsApp'
  if (!href) {
    return (
      <button className="messenger-link is-disabled" type="button" disabled={!import.meta.env.DEV} onClick={() => { if (import.meta.env.DEV) window.alert(`Ссылка на ${label} ещё не заполнена в CONTACTS`) }}>
        {label}<span>ссылка ожидается</span>
      </button>
    )
  }
  return <a className="messenger-link" href={href} target="_blank" rel="noreferrer" onClick={() => trackEvent('messenger_click', { kind })}>{label}<ArrowRight aria-hidden="true" /></a>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [initialQuizStatus, setInitialQuizStatus] = useState('')
  const [activeArea, setActiveArea] = useState(transformationAreas[0].id)
  const [openFaq, setOpenFaq] = useState(0)

  const closeQuiz = useCallback(() => {
    setQuizOpen(false)
    setInitialQuizStatus('')
  }, [])
  const openQuiz = useCallback((source: string, status = '') => {
    setInitialQuizStatus(status)
    setQuizOpen(true)
    trackEvent('quiz_open', { source })
  }, [])

  const scrollToContact = (source: string) => {
    trackEvent('cta_click', { source })
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectedArea = transformationAreas.find((area) => area.id === activeArea) ?? transformationAreas[0]

  return (
    <>
      {import.meta.env.DEV ? <div className="dev-badge">Локальная версия · неподтверждённые данные скрыты</div> : null}
      <header className="site-header">
        <div className="header-shell glass-panel">
          <a className="header-logo-link" href="#top" aria-label="АСО Автошкол — в начало страницы"><BrandLogo /></a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <button className="button button--primary header-cta" type="button" onClick={() => scrollToContact('header')}>Получить разбор</button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <div id="mobile-menu" className={`mobile-menu glass-panel${menuOpen ? ' is-open' : ''}`}>
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <button className="button button--primary" type="button" onClick={() => { setMenuOpen(false); scrollToContact('mobile-menu') }}>Получить разбор</button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-glow hero-glow--blue" aria-hidden="true" />
          <div className="hero-glow hero-glow--red" aria-hidden="true" />
          <div className="hero-copy">
            <p className="brand-kicker">АСО Автошкол</p>
            <h1 id="hero-title">Запуск и развитие автошкол <span>под ключ</span></h1>
            <p className="hero-promise">Система управления автошколой, которая работает без ручного контроля.</p>
            <p className="hero-lead">Проектируем управленческий контур: маркетинг, продажи, процессы и экономику. Сначала проводим диагностику ситуации, затем показываем, какие решения нужны именно вашей автошколе.</p>
            <div className="hero-actions">
              <button className="button button--primary button--large hero-diagnostic-button" type="button" onClick={() => openQuiz('hero')}>Пройти диагностику <ArrowRight aria-hidden="true" /></button>
            </div>
            <ul className="hero-points" aria-label="Что даёт предварительный разбор">
              <li><Check aria-hidden="true" /> Определим текущую задачу</li>
              <li><Check aria-hidden="true" /> Уточним доступные данные</li>
              <li><Check aria-hidden="true" /> Наметим следующий шаг</li>
            </ul>
          </div>
          <ManagementPreview />
        </section>

        <section className="statement-section">
          <div className="content-shell statement-layout">
            <h2>Автошкола может расти в выручке и одновременно <span>терять прибыль, контроль и время собственника</span></h2>
            <div className="statement-points">
              {problems.map((problem, index) => (
                <div className={index === 1 ? 'statement-point is-accented' : 'statement-point'} key={problem}>
                  <span>0{index + 1}</span><p>{problem}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="audience-section section-padding" aria-labelledby="audience-title">
          <div className="content-shell">
            <div className="section-heading section-heading--stack">
              <h2 id="audience-title">Три ситуации.<br />Одна задача — <span>управляемый бизнес</span></h2>
              <p>Мы начинаем не с готового пакета, а с того, где находится автошкола сейчас и какую систему нужно построить.</p>
            </div>
            <div className="audience-paths">
              {audiencePaths.map((path) => (
                <article className={`audience-path audience-path--${path.id}`} key={path.id}>
                  <span className="audience-path__number">{path.number}</span>
                  <div>
                    <h3>{path.title}</h3>
                    <p>{path.description}</p>
                  </div>
                  <strong>{path.result}</strong>
                  <button type="button" className="round-link" onClick={() => openQuiz(`audience-${path.id}`, scenarioStatusByPath[path.id])} aria-label={`Пройти диагностику: ${path.title}`}><ArrowRight aria-hidden="true" /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="directions" className="directions-section section-padding" aria-labelledby="directions-title">
          <div className="content-shell">
            <div className="section-heading">
              <p className="brand-kicker">Направления работы</p>
              <h2 id="directions-title">Не консультация. <span>Контур изменений под задачу бизнеса</span></h2>
            </div>
            <div className="direction-composition">
              {directionCards.map((card) => (
                <article className={`direction direction--${card.id}`} key={card.id}>
                  <div className="direction__copy">
                    <span>{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                  <DirectionArt type={card.art} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="loss-map-section section-padding" aria-labelledby="loss-map-title">
          <div className="content-shell">
            <div className="section-heading loss-heading">
              <h2 id="loss-map-title">Где теряются деньги и управляемость</h2>
              <p>Проблема часто находится не в одном отделе, а в разрывах между этапами. Поэтому мы смотрим на весь путь — от рекламы до решения собственника.</p>
            </div>
            <div className="loss-funnel" aria-label="Воронка потенциальной прибыли и потерь">
              <div className="loss-funnel__grid">
                {lossFunnelRows.map((row) => (
                  <article className="loss-funnel__row" key={row.reason}>
                    <div className="loss-funnel__labels"><span>{row.stage}</span><strong>{row.reason}</strong></div>
                    <div className="loss-funnel__bar" aria-hidden="true">
                      <span className="loss-funnel__potential" style={{ width: `${row.potentialWidth}%` }} />
                      <span className="loss-funnel__lost" style={{ width: `${row.lossWidth}%`, left: `calc(${row.potentialWidth}% - ${row.lossWidth}%)` }} />
                      <i style={{ left: `calc(${row.potentialWidth}% - 10px)` }} />
                    </div>
                    <p>{row.detail}</p>
                  </article>
                ))}
              </div>
              <div className="loss-funnel__summary">
                <strong>до 50% потерь потенциальной прибыли</strong>
                <span>точный процент определяется после диагностики</span>
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="system-section section-padding" aria-labelledby="system-title">
          <div className="content-shell">
            <div className="section-heading section-heading--split">
              <h2 id="system-title">Что именно <span>мы перестраиваем</span></h2>
              <p>Каждое направление связано с остальными. Переключите раздел, чтобы увидеть не обещание, а логику результата для собственника.</p>
            </div>
            <div className="transformation-layout">
              <div className="transformation-tabs" role="tablist" aria-label="Направления перестройки">
                {transformationAreas.map((area) => (
                  <button key={area.id} className={area.id === activeArea ? 'transformation-tab is-active' : 'transformation-tab'} role="tab" aria-selected={area.id === activeArea} aria-controls="transformation-panel" type="button" onClick={() => setActiveArea(area.id)}>
                    <span>{area.number}</span><strong>{area.title}</strong><ChevronDown aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div id="transformation-panel" className="transformation-panel" role="tabpanel">
                <div className="transformation-copy"><h3>{selectedArea.title}</h3><p>{selectedArea.description}</p></div>
                <TransformationVisual area={selectedArea} />
              </div>
            </div>
            <div className="system-modules" aria-label="Состав системы АСО">
              {systemModules.map((module, index) => (
                <article key={module.title}><span>0{index + 1}</span><h3>{module.title}</h3><p>{module.text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="process-section section-padding" aria-labelledby="process-title">
          <div className="content-shell process-layout">
            <div className="process-intro">
              <p className="brand-kicker">Как проходит работа</p>
              <h2 id="process-title">От первой картины до системы, которая остаётся у вас</h2>
              <p>Этапы идут последовательно. Объём и глубина определяются после знакомства с исходной ситуацией.</p>
              <button className="text-button" type="button" onClick={() => openQuiz('process')}>Пройти диагностику <ArrowRight aria-hidden="true" /></button>
            </div>
            <div className="process-steps">
              {processSteps.map((step) => (
                <article className="process-step" key={step.number}>
                  <span className="process-step__number">{step.number}</span>
                  <div className="process-step__copy"><h3>{step.title}</h3><p>{step.action}</p><strong>{step.result}</strong></div>
                  <div className="process-artifact"><ClipboardCheck aria-hidden="true" /><span>{step.artifact}</span><i aria-hidden="true" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="deliverables-section" aria-labelledby="deliverables-title">
          <div className="content-shell deliverables-layout">
            <div>
              <p className="brand-kicker brand-kicker--light">Результат внедрения</p>
              <h2 id="deliverables-title">Система остаётся внутри вашей компании</h2>
              <p>Не презентация и не зависимость от внешнего консультанта, а рабочий комплект управления для владельца и команды.</p>
            </div>
            <div className="deliverables-list">
              {deliverables.map((item) => <div key={item}><Check aria-hidden="true" /><span>{item}</span></div>)}
            </div>
          </div>
          <div className="deliverables-line" aria-hidden="true"><i /><i /><i /></div>
        </section>

        <section className="evidence-section section-padding" aria-labelledby="evidence-title">
          <div className="content-shell">
            <div className="section-heading section-heading--split">
              <h2 id="evidence-title">Рабочие материалы с учётом конфиденциальности</h2>
              <p>Показываем структуру решений и формат документов. Коммерческие показатели, контакты и внутренние данные остаются закрытыми.</p>
            </div>
            <div className="evidence-collage">
              {evidenceItems.map((item, index) => (
                <article className={`evidence-item evidence-item--${item.kind}`} key={item.title}>
                  <div className="evidence-item__top"><span>{item.title}</span><LockKeyhole aria-hidden="true" /></div>
                  <div className="evidence-lines" aria-hidden="true"><i /><i /><i /><i /></div>
                  <div className={`frosted-mask frosted-mask--${index + 1}`}><LockKeyhole aria-hidden="true" /><span>Конфиденциально</span></div>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <p className="evidence-note"><ShieldCheck aria-hidden="true" /> Чувствительные данные закрываются до передачи материалов — конфиденциальность сохраняется на каждом этапе.</p>
          </div>
        </section>

        <section id="founders" className="founders-section section-padding" aria-labelledby="founders-title">
          <div className="content-shell founders-layout">
            <div className="founders-copy">
              <p className="brand-kicker">Команда АСО</p>
              <h2 id="founders-title">За системой стоят конкретные люди</h2>
              <p>Команда, которая работает над системой управления для автошкол.</p>
              <div className="founders-principle"><span>Принцип</span><strong>Система должна работать внутри бизнеса, а не существовать только в презентации.</strong></div>
            </div>
            <div className="founders-visual founders-visual--team">
              <figure className="founder-team">
                <img src={teamPhotoAsset} alt="Команда АСО рядом с брендированным автомобилем" loading="eager" />
              </figure>
            </div>
          </div>
        </section>

        <section className="objections-section section-padding" aria-labelledby="objections-title">
          <div className="content-shell">
            <div className="section-heading section-heading--split"><h2 id="objections-title">Вопросы, которые стоит задать до начала</h2><p>Спокойно разбираем формат, границы ответственности и риски — без давления и обещаний до диагностики.</p></div>
            <div className="objections-list">
              {objections.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="quiz-cta-section">
          <div className="content-shell quiz-cta-layout">
            <div><p className="brand-kicker brand-kicker--light">Диагностика за несколько шагов</p><h2>Начните с вашей ситуации, а не с готового тарифа</h2><p>Ответьте на вопросы о регионе, текущем этапе и главной задаче. Это поможет сделать первый разговор предметным.</p></div>
            <button className="button button--light button--large" type="button" onClick={() => openQuiz('diagnostic-cta')}>Пройти диагностику <ArrowRight aria-hidden="true" /></button>
          </div>
        </section>

        <section id="contact" className="contact-section section-padding" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="content-shell contact-layout">
            <div className="faq-column">
              <p className="brand-kicker">Перед заявкой</p>
              <h2 id="contact-title">Коротко о формате работы</h2>
              <div className="faq-list">
                {faqItems.map((item, index) => (
                  <div className={openFaq === index ? 'faq-item is-open' : 'faq-item'} key={item.question}>
                    <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index} aria-controls={`faq-panel-${index}`}>
                      <span>{item.question}</span><ChevronDown aria-hidden="true" />
                    </button>
                    <div id={`faq-panel-${index}`} className="faq-answer"><p>{item.answer}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lead-form-shell glass-panel">
              <div className="lead-form-shell__heading"><span>Предварительный разбор</span><h2>Расскажите, где находится ваш бизнес сейчас</h2></div>
              <LeadForm />
            </div>
          </div>
        </section>

        <section className="final-cta-section" aria-labelledby="final-cta-title">
          <div className="content-shell final-cta-layout">
            <div><p className="brand-kicker brand-kicker--light">Следующий шаг</p><h2 id="final-cta-title">Соберите маркетинг, продажи и управление в одну систему</h2><p>Начните с предварительного разговора: уточним задачу и поймём, какие данные нужны для разбора.</p></div>
            <button className="button button--primary button--large" type="button" onClick={() => scrollToContact('final-cta')}>Получить предварительный разбор <ArrowRight aria-hidden="true" /></button>
          </div>
          <div className="final-route" aria-hidden="true"><span>Маркетинг</span><i /><span>Продажи</span><i /><span>Управление</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-shell footer-layout">
          <div><BrandLogo inverse /><p>Система создания и развития автошкол.</p></div>
          <div className="footer-nav">{navItems.slice(0, 4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div className="footer-messengers"><MessengerButton kind="telegram" contacts={CONTACTS} /><MessengerButton kind="whatsapp" contacts={CONTACTS} /></div>
          {import.meta.env.DEV ? <div className="footer-legal"><span>Юридические данные не заполнены</span><span>Политика обработки данных — TODO</span></div> : null}
        </div>
      </footer>

      {quizOpen ? <QuizDialog open={quizOpen} onClose={closeQuiz} initialStatus={initialQuizStatus} /> : null}
    </>
  )
}

export default App
