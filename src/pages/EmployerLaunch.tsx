import { ArrowRight, Check, FileText, GraduationCap, Link, Megaphone, Ticket } from 'lucide-react'
import launchImage from '../assets/hr-programme-launch.webp'

type Props = { companyPaid: boolean; onRequest: () => void }
export function EmployerLaunch({ companyPaid, onRequest }: Props) {
  const steps = companyPaid ? [
    { title: 'Готовим предложение', text: 'Подберём программу, подготовим договор и счёт.' },
    { title: 'Согласуете запуск', text: 'Подтвердите условия и участников, оплатите счёт.' },
    { title: 'Организуем обучение', text: 'Свяжемся с участниками, поможем с оформлением и направим инструкции по началу обучения.' },
  ] : [
    { title: 'Готовим запуск', text: 'Подготовим анонс, ссылку, корпоративный промокод и инструкции для сотрудников.' },
    { title: 'Размещаете предложение', text: 'Опубликуйте готовый анонс в корпоративном чате, рассылке или на внутреннем портале.' },
    { title: 'Организуем обучение', text: 'Ответим сотрудникам, поможем с оформлением и записью, направим документы и инструкции.' },
  ]
  const icons = [FileText, Megaphone, GraduationCap]
  return <section className="employer-section employer-launch" id="employer-launch" tabIndex={-1} aria-labelledby="employer-launch-title"><div className="content-shell">
    <div className="employer-launch-intro"><div className="employer-section-heading"><p className="corporate-label">Мы — Вы — Мы</p><h2 id="employer-launch-title">Как запустить программу в вашей компании</h2><p>Подготовку и сопровождение берём на себя. Для запуска вы получаете готовые материалы и понятный порядок действий.</p></div><img src={launchImage} width={1672} height={941} loading="lazy" alt="Обсуждаем с представителем компании запуск обучения" /></div>
    <ol className="employer-launch-roadmap">{steps.map((step, index) => {
      const Icon = icons[index]
      return <li key={index} className={index === 1 ? 'employer-launch-yours' : undefined}><div className="employer-launch-node"><span>0{index + 1}</span></div><div className="employer-launch-card"><div className="employer-launch-owner"><strong>{index === 1 ? 'Вы' : 'Мы'}</strong><span>{index === 1 ? 'Ваша задача' : 'Берём на себя'}</span><Icon size={24} aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.text}</p></div></li>
    })}</ol>
    <p className="employer-launch-result"><Check size={22} aria-hidden="true" /><span>{companyPaid ? 'После согласования и оплаты организацию обучения и сопровождение участников берём на себя.' : 'Сотрудники общаются с нашим менеджером напрямую. Вам не нужно собирать заявки, пересылать документы и координировать запись.'}</span></p>
    <div className="employer-launch-kit"><div><h3>Материалы для запуска уже подготовлены</h3><ul><li><FileText size={18} aria-hidden="true" />Готовый анонс</li><li><Link size={18} aria-hidden="true" />Ссылка на программу</li>{!companyPaid ? <li><Ticket size={18} aria-hidden="true" />Корпоративный промокод</li> : null}</ul></div><div className="employer-announcement"><span>Пример анонса для команды</span><strong>Обучение вождению для нашей команды</strong><p>Коллеги, для вас доступна корпоративная программа обучения. Подробности и порядок оформления — по ссылке в анонсе.</p></div></div>
    <button className="corporate-text-button" type="button" onClick={onRequest}>Получить условия для компании<ArrowRight size={18} aria-hidden="true" /></button>
  </div></section>
}
