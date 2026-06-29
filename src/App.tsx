import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  LineChart,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { trackEvent } from './analytics'
import teamPhotoAsset from './assets/aso-team-updated.png'
import ctaSlidersIcon from './assets/cta-sliders-icon.png'
import directionGrowthBg from './assets/direction-growth-bg.png'
import directionLaunchBg from './assets/direction-launch-bg.png'
import directionSystemBg from './assets/direction-system-bg.png'
import { BrandLogo } from './components/BrandLogo'
import { LeadForm } from './components/LeadForm'
import { QuizDialog } from './components/QuizDialog'
import {
  CONTACTS,
  evidenceItems,
  faqItems,
  processSteps,
  systemAreas,
} from './data'
import type { Contacts, SystemArea } from './types'

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
    image: directionGrowthBg,
  },
  {
    id: 'launch',
    label: 'Запуск',
    title: 'Автошкола с нуля',
    text: 'Проектируем маршрут запуска до первых затрат и случайных решений.',
    image: directionLaunchBg,
  },
  {
    id: 'system',
    label: 'Система',
    title: 'Готовый контур управления',
    text: 'Внедряем стандарты и инструменты так, чтобы контроль оставался у владельца.',
    image: directionSystemBg,
  },
] as const

const lossFunnelRows = [
  {
    stage: 'Заявки',
    reason: 'Разные данные',
    detail: 'Маркетинг и продажи считают результат по-разному',
    potentialWidth: 78,
    lossWidth: 16,
    reasonOffset: 80,
    reasonLeft: 446,
  },
  {
    stage: 'Продажи',
    reason: 'Нет общей картины',
    detail: 'Переходы между этапами видны не полностью',
    potentialWidth: 66,
    lossWidth: 18,
    reasonOffset: 68,
    reasonLeft: 382,
  },
  {
    stage: 'Договоры',
    reason: 'План без факта',
    detail: 'План не связан с реальными действиями команды',
    potentialWidth: 55,
    lossWidth: 14,
    reasonOffset: 57,
    reasonLeft: 325,
  },
  {
    stage: 'Решения',
    reason: 'Решения на ощущениях',
    detail: 'Собственник собирает выводы вручную',
    potentialWidth: 46,
    lossWidth: 12,
    reasonOffset: 48,
    reasonLeft: 278,
  },
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

const mobileDeliverables = [
  'Управленческая отчётность',
  'CRM-воронка и правила',
  'План-факт и контроль',
  'Стандарты и чек-листы',
  'Зоны ответственности',
  'Ритм планёрок',
  'Сравнение филиалов',
  'Инструменты решений',
]

const mobileObjectionTexts = [
  'Система настраивается внутри компании, правила контроля остаются у владельца.',
  'Регион учитывается в диагностике и настройке модели работы.',
  'Внедрение включает работу с командой и первые циклы применения.',
  'Сначала определяем задачу и нужную глубину диагностики.',
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

function SystemAreaRow({ area }: { area: SystemArea }) {
  return (
    <article className="system-area">
      <details className="system-area-mobile">
        <summary>
          <span className="system-area__number">{area.number}</span>
          <span>{area.title}</span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <div className="system-area-mobile__body">
          <p><span>Сейчас</span>{area.currentState}</p>
          <p><span>Внедряем</span>{area.implementation}</p>
          <strong>{area.result}</strong>
          <div className="system-area__tools" aria-label={`Инструменты: ${area.title}`}>
            {area.tools.slice(0, 3).map((tool) => <span className="system-area__tool" key={tool}>{tool}</span>)}
          </div>
        </div>
      </details>
      <div className="system-area-desktop">
        <div className="system-area__header">
          <span className="system-area__number">{area.number}</span>
          <div>
            <h3>{area.title}</h3>
            <p className="system-area__formula"><span>{area.shortBefore}</span><i aria-hidden="true" /><strong>{area.shortAfter}</strong></p>
          </div>
        </div>
        <div className="system-area__flow">
          <div className="system-area__stage system-area__stage--current"><span>Сейчас</span><p>{area.currentState}</p></div>
          <div className="system-area__stage system-area__stage--implementation"><span>Что внедряем</span><p>{area.implementation}</p></div>
          <div className="system-area__stage system-area__stage--result"><span>Результат</span><p>{area.result}</p></div>
        </div>
        <div className="system-area__tools" aria-label={`Инструменты: ${area.title}`}>
          {area.tools.map((tool) => <span className="system-area__tool" key={tool}>{tool}</span>)}
        </div>
      </div>
    </article>
  )
}

function ProcessStepRow({ step }: { step: (typeof processSteps)[number] }) {
  return (
    <article className="process-step">
      <details className="process-step-mobile">
        <summary>
          <span className="process-step__number">{step.number}</span>
          <span>{step.title}</span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <div className="process-step-mobile__body">
          <p>{step.action}</p>
          <strong>{step.result}</strong>
          <div className="process-artifact"><img src={step.image} alt="" loading="lazy" /><span>{step.artifact}</span></div>
        </div>
      </details>
      <div className="process-step-desktop">
        <span className="process-step__number">{step.number}</span>
        <div className="process-step__copy"><h3>{step.title}</h3><p>{step.action}</p><strong>{step.result}</strong></div>
        <div className="process-artifact"><img src={step.image} alt="" loading="lazy" /><span>{step.artifact}</span></div>
      </div>
    </article>
  )
}

function DirectionArt({ card }: { card: (typeof directionCards)[number] }) {
  return (
    <div className={`direction-art direction-art--${card.id}`} aria-hidden="true">
      <img src={card.image} alt="" loading="lazy" />
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

function PersonalDataConsentPage() {
  return (
    <>
      <header className="system-page-header">
        <div className="content-shell system-page-header__shell">
          <a className="header-logo-link" href="./" aria-label="АСО Автошкол — на главную страницу"><BrandLogo /></a>
          <a className="button button--primary" href="./">На главную</a>
        </div>
      </header>
      <main className="system-page" id="top">
        <section className="system-page-hero">
          <div className="content-shell system-page-hero__layout">
            <p className="brand-kicker">Системная страница</p>
            <h1>Согласие на обработку персональных данных</h1>
            <p>Текст согласия нужен для форм предварительного разбора и диагностического квиза на сайте АСО Автошкол. Реквизиты оператора и контакты для обращений должны быть заполнены после юридического подтверждения.</p>
          </div>
        </section>

        <section className="system-page-content">
          <div className="content-shell legal-document">
            <div className="legal-notice">
              <strong>Важно</strong>
              <span>Это рабочий шаблон для сайта. Перед публикацией с реальными заявками нужно указать оператора персональных данных, контакты и проверить текст у юриста.</span>
            </div>

            <article className="legal-section">
              <h2>1. Согласие пользователя</h2>
              <p>Пользователь, заполняя форму на сайте и отмечая чекбокс согласия, свободно, своей волей и в своём интересе даёт согласие оператору персональных данных на обработку указанных им данных.</p>
              <p><strong>Оператор:</strong> [указать полное наименование юридического лица или ИП].</p>
              <p><strong>Сайт:</strong> текущий сайт АСО Автошкол.</p>
            </article>

            <article className="legal-section">
              <h2>2. Какие данные могут обрабатываться</h2>
              <ul>
                <li>имя;</li>
                <li>номер телефона;</li>
                <li>город или регион;</li>
                <li>текущая ситуация автошколы;</li>
                <li>предпочтительный способ связи;</li>
                <li>комментарий и ответы диагностического квиза;</li>
                <li>технические данные, если они фиксируются системами аналитики сайта.</li>
              </ul>
            </article>

            <article className="legal-section">
              <h2>3. Цели обработки</h2>
              <ul>
                <li>обработка заявки на предварительный разбор;</li>
                <li>связь с пользователем по указанным контактам;</li>
                <li>подготовка первого разговора по ситуации автошколы;</li>
                <li>ведение внутреннего учёта обращений;</li>
                <li>улучшение работы сайта и форм обратной связи.</li>
              </ul>
            </article>

            <article className="legal-section">
              <h2>4. Действия с персональными данными</h2>
              <p>Согласие распространяется на сбор, запись, систематизацию, накопление, хранение, уточнение, использование, передачу внутри команды оператора, обезличивание, блокирование, удаление и уничтожение персональных данных.</p>
              <p>Оператор не должен публиковать персональные данные пользователя в открытом доступе без отдельного согласия.</p>
            </article>

            <article className="legal-section">
              <h2>5. Срок действия согласия</h2>
              <p>Согласие действует до достижения целей обработки или до его отзыва пользователем. Сроки хранения и порядок удаления нужно уточнить после утверждения внутренней политики обработки данных.</p>
            </article>

            <article className="legal-section">
              <h2>6. Отзыв согласия</h2>
              <p>Пользователь может отозвать согласие, направив обращение оператору.</p>
              <p><strong>Контакт для отзыва:</strong> [указать email или иной подтверждённый канал связи].</p>
              <p>После получения отзыва оператор прекращает обработку персональных данных, если дальнейшая обработка не требуется по закону.</p>
            </article>

            <article className="legal-section">
              <h2>7. Передача третьим лицам</h2>
              <p>Передача персональных данных третьим лицам допускается только для целей обработки заявки, обеспечения работы сайта и связи с пользователем, а также в случаях, предусмотренных законом.</p>
            </article>

            <article className="legal-section">
              <h2>8. Дата версии</h2>
              <p>Версия страницы: 29 июня 2026 года.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [initialQuizStatus, setInitialQuizStatus] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const [hashRoute, setHashRoute] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHashRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

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

  if (hashRoute === '#personal-data-consent') {
    return <PersonalDataConsentPage />
  }

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
            <h1 id="hero-title">
              <span className="hero-title-line">Запуск и развитие</span>
              <span className="hero-title-line">автошкол <em>под ключ</em></span>
            </h1>
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
                  <DirectionArt card={card} />
                  <button type="button" className="round-link direction__action" onClick={() => openQuiz(`directions-${card.id}`, scenarioStatusByPath[card.id])} aria-label={`Пройти диагностику: ${card.title}`}><ArrowRight aria-hidden="true" /></button>
                </article>
              ))}
            </div>
            <div className="section-action">
              <button className="button button--primary" type="button" onClick={() => openQuiz('directions')}>Подобрать направление работы <ArrowRight aria-hidden="true" /></button>
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
                    <div className="loss-funnel__labels"><span>{row.stage}</span></div>
                    <div className="loss-funnel__bar-cell" style={{ '--reason-left': `${row.reasonLeft}px`, '--reason-mobile-left': `${row.reasonOffset}%` } as CSSProperties}>
                      <div className="loss-funnel__bar" aria-hidden="true">
                        <span className="loss-funnel__potential" style={{ width: `calc(${row.potentialWidth}% - 18px)` }} />
                        <span className="loss-funnel__lost" style={{ width: `calc(${row.lossWidth}% - 18px)`, left: `calc(${row.potentialWidth}% - ${row.lossWidth}%)` }} />
                        <i style={{ left: `calc(${row.potentialWidth}% - 2px)` }} />
                      </div>
                      <strong className="loss-funnel__reason">{row.reason}</strong>
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
            <div className="section-action">
              <button className="button button--primary" type="button" onClick={() => openQuiz('loss-funnel')}>Найти свои потери <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
        </section>

        <section id="system" className="system-section section-padding" aria-labelledby="system-title">
          <div className="content-shell">
            <div className="section-heading section-heading--split system-heading">
              <h2 id="system-title">Собираем автошколу в <span>единую систему управления</span></h2>
            </div>
            <div className="system-areas">
              {systemAreas.map((area) => <SystemAreaRow key={area.id} area={area} />)}
            </div>
            <div className="system-summary">
              <p>В итоге собственник видит общую картину и принимает решения по понятным данным.</p>
              <button className="button button--primary" type="button" onClick={() => openQuiz('system-section')}>Получить разбор системы управления <ArrowRight aria-hidden="true" /></button>
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
              {processSteps.map((step) => <ProcessStepRow key={step.number} step={step} />)}
            </div>
          </div>
        </section>

        <section className="deliverables-section" aria-labelledby="deliverables-title">
          <div className="content-shell deliverables-layout">
            <div>
              <p className="brand-kicker brand-kicker--light">Результат внедрения</p>
              <h2 id="deliverables-title">Система остаётся внутри вашей компании</h2>
              <p><span className="desktop-copy">Не презентация и не зависимость от внешнего консультанта, а рабочий комплект управления для владельца и команды.</span><span className="mobile-copy">Не презентация, а рабочий комплект управления для владельца и команды.</span></p>
              <button className="button button--light deliverables-cta" type="button" onClick={() => openQuiz('deliverables')}><span className="desktop-copy">Понять, что нужно вашей автошколе</span><span className="mobile-copy">Понять следующий шаг</span> <ArrowRight aria-hidden="true" /></button>
            </div>
            <div className="deliverables-list">
              {deliverables.map((item, index) => <div key={item}><Check aria-hidden="true" /><span><span className="desktop-copy">{item}</span><span className="mobile-copy">{mobileDeliverables[index] ?? item}</span></span></div>)}
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
            <div className="section-action section-action--compact">
              <button className="text-button" type="button" onClick={() => openQuiz('evidence')}>Обсудить формат материалов <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
        </section>

        <section id="founders" className="founders-section section-padding" aria-labelledby="founders-title">
          <div className="content-shell founders-layout">
            <div className="founders-copy">
              <p className="brand-kicker">Команда АСО</p>
              <h2 id="founders-title">За системой стоят конкретные люди</h2>
              <p><span className="desktop-copy">Команда, которая работает над системой управления для автошкол.</span><span className="mobile-copy">Команда, которая внедряет систему управления автошколой.</span></p>
              <div className="founders-principle"><span>Принцип</span><strong><span className="desktop-copy">Система должна работать внутри бизнеса, а не существовать только в презентации.</span><span className="mobile-copy">Система работает внутри бизнеса, а не только в презентации.</span></strong></div>
              <button className="button button--primary founders-cta" type="button" onClick={() => openQuiz('team')}><span className="desktop-copy">Оставить заявку команде</span><span className="mobile-copy">Оставить заявку</span> <ArrowRight aria-hidden="true" /></button>
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
            <div className="section-heading section-heading--split objections-heading">
              <h2 id="objections-title">Вопросы, которые стоит задать до начала</h2>
              <div><p><span className="desktop-copy">Спокойно разбираем формат, границы ответственности и риски — без давления и обещаний до диагностики.</span><span className="mobile-copy">Разбираем формат, ответственность и риски до диагностики.</span></p><button className="button button--primary" type="button" onClick={() => openQuiz('objections')}><span className="desktop-copy">Задать свой вопрос</span><span className="mobile-copy">Задать вопрос</span> <ArrowRight aria-hidden="true" /></button></div>
            </div>
            <div className="objections-list">
              {objections.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p><span className="desktop-copy">{item.text}</span><span className="mobile-copy">{mobileObjectionTexts[index] ?? item.text}</span></p></article>)}
            </div>
          </div>
        </section>

        <section className="quiz-cta-section" aria-labelledby="quiz-cta-title">
          <div className="content-shell">
            <div className="quiz-cta-card">
              <div className="quiz-cta-copy"><p className="brand-kicker brand-kicker--light">Диагностика за несколько шагов</p><h2 id="quiz-cta-title">Начните с вашей ситуации, а не с готового тарифа</h2><p>Ответьте на вопросы о регионе, текущем этапе и главной задаче. Это поможет сделать первый разговор предметным.</p><button className="button button--light button--large" type="button" onClick={() => openQuiz('diagnostic-cta')}>Пройти диагностику <ArrowRight aria-hidden="true" /></button></div>
              <img className="quiz-cta-visual" src={ctaSlidersIcon} alt="" loading="lazy" />
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-padding" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="content-shell contact-layout">
            <div className="faq-column">
              <p className="brand-kicker">Перед заявкой</p>
              <h2 id="contact-title">FAQ</h2>
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
          <div><BrandLogo inverse /><p>Ассоциация современного образования автошкол России.</p></div>
          <div className="footer-nav">{navItems.slice(0, 4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div className="footer-messengers"><MessengerButton kind="telegram" contacts={CONTACTS} /><MessengerButton kind="whatsapp" contacts={CONTACTS} /></div>
          <div className="footer-legal">
            <a href="#personal-data-consent">Согласие на обработку персональных данных</a>
            {import.meta.env.DEV ? <span>Юридические данные не заполнены</span> : null}
          </div>
        </div>
      </footer>

      {quizOpen ? <QuizDialog open={quizOpen} onClose={closeQuiz} initialStatus={initialQuizStatus} /> : null}
    </>
  )
}

export default App
