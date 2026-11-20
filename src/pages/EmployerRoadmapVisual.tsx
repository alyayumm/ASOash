import { FileText, MapPin, ShieldCheck, Users, Wallet } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'

export function EmployerRoadmapVisual({ kind }: { kind: string }) {
  return <div className={`employer-visual employer-visual--${kind}`} aria-hidden="true">
    <span className="employer-diagram-label">Схема этапа</span>
    {kind === 'promo' ? <div className="employer-phone"><BrandLogo /><strong>Промокод</strong><span className="visual-promo-tag">ПРОМО</span><div className="visual-input">Код от компании</div><div className="visual-blue-bar">Корпоративные условия</div></div> : null}
    {kind === 'payment' ? <div className="employer-order"><div className="visual-window-heading">Оформление обучения<ShieldCheck size={28} /></div><strong>Категория B</strong><span>Программа и итоговая цена</span><span>Контакт и мессенджер</span><span>Условия договора</span><div className="visual-rule" /><div className="visual-red-bar">Оплата обучения</div></div> : null}
    {kind === 'manager' ? <div className="employer-message"><div className="visual-window-heading">Наш менеджер</div><div className="visual-document"><FileText size={32} /><strong>Документы<br />и инструкции</strong></div><div className="visual-messengers"><span>Telegram</span><span>WhatsApp</span></div></div> : null}
    {kind === 'program' ? <div className="employer-program"><BrandLogo /><strong>Программа для команды</strong><span><Users size={20} />Участники</span><span><MapPin size={20} />Города обучения</span><span><Wallet size={20} />Согласованный бюджет</span></div> : null}
    {kind === 'invoice' ? <div className="employer-order employer-invoice"><FileText size={32} /><strong>Комплект для компании</strong><span>Договор и счёт</span><div className="visual-rule" /><span>Согласованные условия</span><div className="visual-red-bar">Безналичная оплата <span>→</span></div></div> : null}
  </div>
}
