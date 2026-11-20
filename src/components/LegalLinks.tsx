import { legalLinks } from '../legalData'
import '../pages/legal.css'

export function LegalLinks() {
  return <nav className="legal-links" aria-label="Правовая информация">
    <a href={legalLinks.privacy} target="_blank" rel="noreferrer">Политика конфиденциальности</a>
    <a href={legalLinks.consent} target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>
  </nav>
}

export function LegalFormNotice() {
  return <p className="legal-form-note">Порядок обработки данных — в <a href={legalLinks.privacy} target="_blank" rel="noreferrer">политике конфиденциальности</a>.</p>
}
