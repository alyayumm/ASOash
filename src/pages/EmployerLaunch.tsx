import { ArrowRight, Check, CheckCheck, FileText, GraduationCap, Link, Megaphone, Ticket, Users } from 'lucide-react'
import launchImage from '../assets/hr-programme-launch.webp'
import employeeInstructions from '../assets/hr-employee-offer-instructions.png'

type Props = { companyPaid: boolean; onRequest: () => void }
const examplePromoCode = 'KOMANDA26'
export function EmployerLaunch({ companyPaid, onRequest }: Props) {
  const steps = companyPaid ? [
    { title: 'Готовим предложение', text: 'Подберём программу, подготовим договор и счёт.' },
    { title: 'Согласуете и размещаете предложение', text: 'Согласуйте условия и разместите готовое предложение для сотрудников. Дальнейшее оформление и сопровождение берём на себя.' },
    { title: 'Организуем обучение', text: 'Дадим понятные инструкции, чтобы сотрудники могли самостоятельно записаться и начать обучение. Менеджеры ответят на вопросы по оформлению, а куратор поможет в процессе обучения.' },
  ] : [
    { title: 'Готовим запуск', text: 'Подготовим анонс, ссылку, корпоративный промокод и инструкции для сотрудников.' },
    { title: 'Размещаете предложение', text: 'Опубликуйте готовый анонс в корпоративном чате, рассылке или на внутреннем портале.' },
    { title: 'Организуем обучение', text: 'Дадим понятные инструкции: сотрудники смогут самостоятельно записаться и оплатить обучение. Менеджеры ответят на вопросы по оформлению, а куратор поможет в процессе обучения.' },
  ]
  const icons = [FileText, Megaphone, GraduationCap]
  return <section className="employer-section employer-launch" id="employer-launch" tabIndex={-1} aria-labelledby="employer-launch-title"><div className="content-shell">
    <div className="employer-launch-intro"><div className="employer-section-heading"><p className="corporate-label">Мы — Вы — Мы</p><h2 id="employer-launch-title">Как запустить программу в вашей компании</h2><p>Подготовку и сопровождение берём на себя. Для запуска вы получаете готовые материалы и понятный порядок действий.</p></div><img src={launchImage} width={1672} height={941} loading="lazy" alt="Обсуждаем с представителем компании запуск обучения" /></div>
    <ol className="employer-launch-roadmap">{steps.map((step, index) => {
      const Icon = icons[index]
      return <li key={index} className={index === 1 ? 'employer-launch-yours' : undefined}><div className="employer-launch-node"><span>0{index + 1}</span></div><div className="employer-launch-card"><div className="employer-launch-owner"><strong>{index === 1 ? 'Вы' : 'Мы'}</strong><span>{index === 1 ? 'Ваша задача' : 'Берём на себя'}</span><Icon size={24} aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.text}</p></div></li>
    })}</ol>
    <p className="employer-launch-result"><Check size={22} aria-hidden="true" /><span>{companyPaid ? 'После согласования и оплаты организацию обучения и сопровождение участников берём на себя.' : 'Сотрудники общаются с нашим менеджером напрямую. Вам не нужно собирать заявки, пересылать документы и координировать запись.'}</span></p>
    <div className="employer-launch-kit">
      <div className="employer-launch-kit-heading">
        <h3>Материалы для запуска уже подготовлены</h3>
        <ul><li><FileText size={18} aria-hidden="true" />Готовый анонс</li><li><Link size={18} aria-hidden="true" />Ссылка на программу</li><li><Ticket size={18} aria-hidden="true" />Корпоративный промокод</li></ul>
      </div>
      <div className="employer-chat" role="group" aria-label="Пример сообщения в корпоративном чате">
        <div className="employer-chat-header"><Users size={24} aria-hidden="true" /><div><strong>Наша команда</strong><span>Корпоративный чат · пример анонса</span></div></div>
        <div className="employer-chat-thread">
          <span className="employer-chat-avatar" aria-hidden="true">HR</span>
          <article className="employer-announcement" aria-label={companyPaid ? 'Анонс: оплачивает компания' : 'Анонс: сотрудник оплачивает сам'}>
            <div className="employer-chat-sender">HR-команда</div>
            {!companyPaid ? <a className="employer-instruction-preview" href={employeeInstructions} target="_blank" rel="noreferrer">
              <img src={employeeInstructions} width={1254} height={1254} loading="lazy" alt="Инструкция для сотрудников: выбор программы, промокод KOMANDA26, самостоятельная оплата и получение документов" />
              <span>Открыть инструкцию<ArrowRight size={16} aria-hidden="true" /></span>
            </a> : null}
            <div className="employer-announcement-body">
        <strong>Обучение вождению для нашей команды</strong>
        {companyPaid ? <>
          <p>Коллеги, для нашей команды доступна программа обучения вождению за счёт компании.</p>
          <p>Обучение проходит в Москве и Санкт-Петербурге. Доступны категории <strong>B — механика или автомат</strong> и <strong>A — мотоцикл</strong>.</p>
          <p>Порядок участия — по корпоративной ссылке. При обращении к менеджеру назовите промокод <strong>{examplePromoCode}</strong>. Менеджер поможет с оформлением и началом обучения.</p>
        </> : <>
          <p>Коллеги, мы договорились о специальных условиях обучения в автошколе для сотрудников нашей компании.</p>
          <p>Программа доступна в Москве и Санкт-Петербурге. Можно пройти обучение на категорию <strong>B — механика или автомат</strong>, либо <strong>A — мотоцикл</strong>. Теория проходит онлайн, практика — с инструктором.</p>
          <p>Условия, программы и порядок оформления собраны по корпоративной ссылке. С выбором программы и документами поможет менеджер автошколы — к нему можно обращаться напрямую.</p>
        </>}
              <div className="employer-announcement-code"><span>Промокод:</span><strong>{examplePromoCode}</strong></div>
              <div className="employer-chat-time" aria-label="Время отправки в примере: 10:00">10:00<CheckCheck size={16} aria-hidden="true" /></div>
            </div>
          </article>
        </div>
      </div>
      <button className="corporate-text-button" type="button" onClick={onRequest}>Получить условия для компании<ArrowRight size={18} aria-hidden="true" /></button>
    </div>
  </div></section>
}
