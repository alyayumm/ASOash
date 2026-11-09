import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { CorporateLeadForm } from './CorporateLeadForm'
import type { CorporateAudience } from './corporateFormValidation'
import { trackEvent } from '../analytics'
import bannerAsset from '../assets/corporate-benefit-main.png'
import './corporateTraining.css'

const steps = [
  { title: 'Рассказываете о задаче', text: 'Указываете тип организации, город и удобный способ связи.' },
  { title: 'Обсуждаем программу', text: 'Уточняем категории, количество сотрудников и организационные вопросы.' },
  { title: 'Согласуем условия', text: 'Обсуждаем стоимость, формат оплаты и порядок взаимодействия.' },
  { title: 'Организуем обучение', text: 'Согласуем порядок записи сотрудников и дальнейшие шаги.' },
]
const faq = [
  { question: 'Для каких организаций подходит программа?', answer: 'Для HR-агентств, которые хотят дополнить предложение для клиентов, и работодателей, которые расширяют программу льгот для сотрудников.' },
  { question: 'Можно ли совмещать обучение с работой?', answer: 'Онлайн-теория и согласование практических занятий помогают учитывать рабочий график. Практика проходит очно; конкретное расписание обсуждаем при подборе программы.' },
  { question: 'Как определяется стоимость?', answer: 'Стоимость и формат оплаты согласуем с учётом категории, города и количества сотрудников. Условия для вашей организации обсудим после заявки.' },
  { question: 'Можно ли открыть новую категорию?', answer: 'Да, запрос на новую категорию можно обсудить в рамках программы. Доступность категории и условия перехода уточняем при подборе обучения.' },
  { question: 'Как подключить сотрудников?', answer: 'Оставьте заявку от агентства или работодателя. Обсудим программу, согласуем условия и порядок записи сотрудников на обучение.' },
]

export default function CorporateTrainingPage() {
  const [audience, setAudience] = useState<CorporateAudience>('')
  const [source, setSource] = useState('corporate-contact')
  useEffect(() => {
    const previousTitle = document.title
    const updates = [
      { element: document.querySelector('meta[name="description"]'), attribute: 'content', value: 'Корпоративное обучение вождению для HR-агентств и работодателей. Онлайн-теория, очная практика в Москве и условия для вашей компании.' },
      { element: document.querySelector('meta[property="og:title"]'), attribute: 'content', value: 'Корпоративное обучение вождению — АСО' },
      { element: document.querySelector('meta[property="og:description"]'), attribute: 'content', value: 'Добавьте обучение вождению в предложение для клиентов или программу льгот для сотрудников. Получите условия сотрудничества с АСО.' },
      { element: document.querySelector('link[rel="canonical"]'), attribute: 'href', value: 'https://alyayumm.github.io/ASOash/?page=corporate-training' },
    ].map((update) => ({ ...update, previous: update.element?.getAttribute(update.attribute) ?? '' }))
    document.title = 'Корпоративное обучение вождению для компаний — АСО'
    updates.forEach(({ element, attribute, value }) => element?.setAttribute(attribute, value))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      document.title = previousTitle
      updates.forEach(({ element, attribute, previous }) => element?.setAttribute(attribute, previous))
    }
  }, [])

  const selectAudience = (value: CorporateAudience) => {
    setAudience(value)
    trackEvent('corporate_audience_select', { audience: value })
  }
  const goTo = (id: string, ctaSource: string, selectedAudience?: CorporateAudience) => {
    if (selectedAudience) selectAudience(selectedAudience)
    setSource(ctaSource)
    trackEvent('corporate_cta_click', { source: ctaSource, audience: selectedAudience || audience || 'unspecified' })
    const target = document.getElementById(id)
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <div className="corporate-page">
      <a className="corporate-skip" href="#corporate-content">К содержанию</a>
      <header className="corporate-header"><div className="content-shell corporate-header__inner">
        <a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo /></a>
        <a className="corporate-back" href="./#directions"><ArrowLeft size={18} aria-hidden="true" />Все направления</a>
        <button type="button" className="button button--primary" onClick={() => goTo('corporate-contact', 'header')}>Обсудить партнёрство</button>
      </div></header>
      <main id="corporate-content" tabIndex={-1}>
        <section className="corporate-hero" aria-labelledby="corporate-title"><div className="content-shell">
          <p className="corporate-label">Для HR-агентств и работодателей</p>
          <div className="corporate-hero__layout"><h1 id="corporate-title">Корпоративное обучение <span>вождению</span></h1><div className="corporate-hero__copy">
            <p className="corporate-hero__lead">Добавьте обучение вождению в предложение для клиентов или программу льгот для сотрудников.</p>
            <p>АСО организует обучение и помогает согласовать условия участия. Вы получаете дополнительный инструмент для развития HR-предложения, а сотрудники — возможность получить водительские права или открыть новую категорию.</p>
          </div></div>
          <div className="corporate-hero__actions"><button className="button button--primary" type="button" onClick={() => goTo('corporate-contact', 'hero')}>Получить условия сотрудничества <ArrowRight aria-hidden="true" /></button><button className="corporate-text-button" type="button" onClick={() => goTo('corporate-process', 'hero-process')}>Как работает программа <ArrowRight size={18} aria-hidden="true" /></button></div>
        </div></section>

        <div className="corporate-banner content-shell"><img src={bannerAsset} width={1672} height={941} fetchPriority="high" alt="Обучение вождению на корпоративных условиях — дополнительный бенефит для клиентов компании" /></div>

        <section className="corporate-audience corporate-section content-shell" aria-labelledby="corporate-audience-title">
          <div className="corporate-section-intro"><h2 id="corporate-audience-title">Два пути к <span>сильному HR-предложению</span></h2><p>Выберите задачу вашей организации. Обучение сотрудников организует АСО, условия участия согласуем вместе с вами.</p></div>
          <div className="corporate-audience__cards">
            <article><p className="corporate-audience__label">Для HR-агентства</p><h3>Дополните предложение для ваших клиентов</h3><p>Предлагайте работодателям обучение вождению как дополнительный бенефит для команды. Условия взаимодействия агентства, компании и АСО обсудим применительно к вашей задаче.</p><button className="corporate-text-button" type="button" onClick={() => goTo('corporate-contact', 'agency-card', 'agency')}>Получить условия для агентства <ArrowRight size={18} aria-hidden="true" /></button></article>
            <article><p className="corporate-audience__label">Для работодателя</p><h3>Расширьте программу льгот для сотрудников</h3><p>Добавьте возможность обучения вождению в ваше HR-предложение. Поможем обсудить доступные программы, расписание и организацию участия сотрудников.</p><button className="corporate-text-button" type="button" onClick={() => goTo('corporate-contact', 'employer-card', 'employer')}>Получить условия для компании <ArrowRight size={18} aria-hidden="true" /></button></article>
          </div>
        </section>

        <section className="corporate-learning corporate-section" aria-labelledby="corporate-learning-title"><div className="content-shell corporate-learning__layout"><div><p className="corporate-label">Для сотрудников</p><h2 id="corporate-learning-title">Новый навык,<br /><span>который остаётся с сотрудником</span></h2><p className="corporate-learning__intro">Водительские права или новая категория расширяют личные и профессиональные возможности. Онлайн-теорию и график практики можно учитывать при планировании обучения.</p></div><div className="corporate-learning__items">
          <article><Check aria-hidden="true" /><div><h3>Права или новая категория</h3><p>Программу подбираем с учётом задачи сотрудника и уже открытых категорий.</p></div></article>
          <article><Check aria-hidden="true" /><div><h3>Теория — онлайн</h3><p>Теоретическую часть можно изучать дистанционно и совмещать с работой.</p></div></article>
          <article><Check aria-hidden="true" /><div><h3>Практика — за рулём</h3><p>Практические занятия проходят очно. Расписание согласуем с учётом рабочего графика.</p></div></article>
        </div></div></section>

        <section className="corporate-conditions corporate-section content-shell" aria-labelledby="corporate-conditions-title"><div className="corporate-section-intro"><h2 id="corporate-conditions-title">Программа и условия <span>под вашу задачу</span></h2><p>До начала обучения обсудим, что нужно сотрудникам и как организовать участие вашей компании.</p></div><dl className="corporate-conditions__rows">
          <div><dt>Программы обучения</dt><dd>Получение водительских прав или открытие новой категории. Доступные категории и условия перехода уточняем при подборе программы.</dd></div>
          <div><dt>Где проходят занятия</dt><dd>Теория — онлайн. Практические занятия — в Москве; место и расписание согласуем при обсуждении программы.</dd></div>
          <div><dt>Стоимость и оплата</dt><dd>Стоимость и формат оплаты согласуем с учётом категории, города и количества сотрудников. Оставьте заявку — обсудим условия для вашей компании.</dd></div>
        </dl><button className="button button--primary" type="button" onClick={() => goTo('corporate-contact', 'conditions')}>Получить расчёт для компании <ArrowRight aria-hidden="true" /></button></section>

        <section className="corporate-process corporate-section" id="corporate-process" tabIndex={-1} aria-labelledby="corporate-process-title"><div className="content-shell"><div className="corporate-section-intro"><h2 id="corporate-process-title">От заявки<br /><span>до начала обучения</span></h2><p>Сначала согласуем программу и условия, затем — порядок записи сотрудников.</p></div><ol className="corporate-process__steps">{steps.map((step, index) => <li key={step.title}><span className="corporate-step-number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>

        <section className="corporate-trust corporate-section content-shell" aria-labelledby="corporate-trust-title"><h2 id="corporate-trust-title">Опыт, на который<br /><span>можно опереться</span></h2><div><h3>Более 10 лет обучения водителей</h3><p>Опыт АСО и большая команда инструкторов помогают подбирать программу и график практических занятий в Москве.</p><p>Условия корпоративного участия адаптируем к задаче агентства и работодателя.</p></div></section>

        <section className="corporate-faq corporate-section" aria-labelledby="corporate-faq-title"><div className="content-shell corporate-faq__layout"><h2 id="corporate-faq-title">Перед первым<br /><span>разговором</span></h2><div>{faq.map((item) => <details key={item.question}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className="corporate-contact corporate-section content-shell" id="corporate-contact" tabIndex={-1} aria-labelledby="corporate-contact-title"><div className="corporate-contact__copy"><p className="corporate-label">Следующий шаг</p><h2 id="corporate-contact-title">Получите условия <span>для вашей компании</span></h2><p>Оставьте контакт — обсудим доступные программы, стоимость и порядок подключения.</p><a className="corporate-back" href="./#directions"><ArrowLeft size={18} aria-hidden="true" />К другим направлениям АСО</a></div><div className="corporate-contact__form"><h3>Обсудим вашу задачу</h3><CorporateLeadForm audience={audience} source={source} onAudienceChange={selectAudience} /></div></section>
      </main>
      <footer className="corporate-footer"><div className="content-shell"><a href="./" aria-label="АСО Автошкол — на главную"><BrandLogo inverse /></a><p>Корпоративная программа обучения вождению</p><a href="./#personal-data-consent" target="_blank" rel="noreferrer">Обработка персональных данных</a></div></footer>
    </div>
  )
}
