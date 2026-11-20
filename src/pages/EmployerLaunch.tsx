import { Check } from 'lucide-react'
import programmeLaunch from '../assets/hr-programme-launch.webp'

type Props = { companyPaid: boolean; onRequest: () => void }

export function EmployerLaunch({ companyPaid, onRequest }: Props) {
  const steps = [
    {
      title: 'Оставьте заявку',
      text: 'Укажите компанию, города и удобный контакт. Наш менеджер свяжется с вами.',
    },
    {
      title: 'Согласуем условия',
      text: 'Обсудим категории обучения, стоимость и формат участия: сотрудники оплачивают сами или платит компания.',
    },
    {
      title: 'Подготовим запуск',
      text: companyPaid
        ? 'Согласуем участников, подготовим договор и выставим счёт.'
        : 'Передадим готовый анонс, ссылку на программу и корпоративный промокод.',
    },
    {
      title: 'Запустим программу',
      text: companyPaid
        ? 'После оплаты наш менеджер свяжется с сотрудниками и направит документы и инструкции по началу обучения.'
        : 'Вы размещаете предложение для сотрудников. Мы помогаем участникам с оформлением, оплатой и началом обучения.',
    },
  ]

  return <section className="employer-launch employer-section" id="employer-launch" tabIndex={-1} aria-labelledby="employer-launch-title">
    <div className="content-shell" id="employer-format-panel" role="tabpanel" aria-labelledby={`employer-payment-${companyPaid ? 1 : 0}`}>
      <div className="employer-launch-intro">
        <div className="employer-launch-copy">
          <h2 id="employer-launch-title">Как запустить программу в вашей компании</h2>
          <p>Согласуем условия, подготовим запуск и поможем сотрудникам начать обучение.</p>
        </div>
        <img src={programmeLaunch} width={1672} height={941} loading="lazy" alt="Представитель компании и наш менеджер обсуждают программу обучения" />
      </div>
      <ol className="employer-launch-roadmap">
        {steps.map((step, index) => <li key={step.title}>
          <div className="employer-launch-node" aria-hidden="true"><span>0{index + 1}</span></div>
          <div className="employer-launch-card"><h3>{step.title}</h3><p>{step.text}</p></div>
        </li>)}
      </ol>
      <div className="employer-launch-footer">
        <p><Check size={24} aria-hidden="true" /><span>Наш менеджер будет вашим единым контактом по вопросам запуска и сопровождения программы.</span></p>
        <button className="button button--primary" type="button" onClick={onRequest}>Получить условия для компании</button>
      </div>
    </div>
  </section>
}
