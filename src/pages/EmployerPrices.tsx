import { useState, type KeyboardEvent } from 'react'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import car from '../assets/hr-category-b-car.webp'
import motorcycle from '../assets/hr-category-a-motorcycle.webp'
import {
  employeeDiscount, employerPriceCities, employerProgrammes, formatEmployerPrice, getEmployeePrice,
  type EmployerPriceCity, type EmployerProgrammeCode, type EmployerProgrammePricing, type EmployerTransmission,
} from './employersPricing'

const cityKeys = Object.keys(employerPriceCities) as EmployerPriceCity[]
type Props = { onRequest: (city: EmployerPriceCity, programme: string) => void }
type ProgrammeCardProps = Props & { city: EmployerPriceCity; code: EmployerProgrammeCode; category: string; title: string }

function ProgrammeCard({ city, code, category, title, onRequest }: ProgrammeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [transmission, setTransmission] = useState<EmployerTransmission>('manual')
  const programme: EmployerProgrammePricing = employerPriceCities[city].programmes[code]
  const listPrice = transmission === 'automatic' && programme.automaticListPrice !== undefined ? programme.automaticListPrice : programme.listPrice
  const quote = getEmployeePrice(listPrice)
  const panelId = `employer-programme-${code}`

  return <article className="employer-price-card" aria-label={`${employerPriceCities[city].label}, ${category}`}>
    <div className={`employer-programme-visual employer-programme-visual--${code}`} aria-hidden="true">
      {code !== 'a' ? <img className="employer-programme-car" src={car} width={1254} height={1254} loading="lazy" alt="" /> : null}
      {code !== 'b' ? <img className="employer-programme-motorcycle" src={motorcycle} width={1254} height={1254} loading="lazy" alt="" /> : null}
    </div>
    <h3>{category}</h3>
    <p className="employer-programme-title">{title}</p>
    <p className="employer-price-programme">Онлайн-теория{programme.automaticListPrice !== undefined ? ` · ${transmission === 'automatic' ? 'АКПП' : 'МКПП'}` : ''}</p>
    <div className="employer-price-values" aria-live="polite" aria-atomic="true">
      <p className="employer-price-base"><span>По прайсу</span> <s>{formatEmployerPrice(listPrice)}</s></p>
      <p className="employer-price-label">Для сотрудника</p>
      <div className="employer-price-total"><p><span>от </span><strong>{formatEmployerPrice(quote.price)}</strong></p><span className="employer-price-discount">−{quote.discountPercent}<span className="corporate-visually-hidden"> от цены по прайсу</span></span></div>
    </div>
    <button className="employer-programme-toggle" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(!expanded)}>{expanded ? 'Скрыть программу' : 'Посмотреть программу'}<ChevronDown size={20} aria-hidden="true" /></button>
    <div className="employer-programme-details" id={panelId} hidden={!expanded}>
      <h4>Что входит в программу</h4>
      <ul>
        <li>Теория онлайн</li>
        {programme.motorcyclePracticeHours ? <li>Мотопрактика — {programme.motorcyclePracticeHours} часов{programme.motorcycleAlternativeHours ? `; на другой площадке — ${programme.motorcycleAlternativeHours} часов` : ''}.</li> : null}
        {programme.carPracticeHours ? <li>Пакет с {programme.carPracticeHours} часами автомобильной практики по прайсу.</li> : null}
      </ul>
      {programme.automaticListPrice !== undefined ? <fieldset className="employer-programme-transmission"><legend>Коробка автомобиля</legend><div>{([['manual', 'МКПП'], ['automatic', 'АКПП']] as const).map(([value, label]) => <label key={value}><input type="radio" name={`employer-gear-${code}`} value={value} checked={transmission === value} onChange={() => setTransmission(value)} /><span>{label}</span></label>)}</div></fieldset> : null}
      {programme.motorcycleAlternativeHours ? <p className="employer-programme-note">Площадку и объём мотопрактики согласуем при подборе программы.</p> : null}
      <button className="button button--primary" type="button" onClick={() => onRequest(city, `${code}${programme.automaticListPrice !== undefined ? `-${transmission}` : ''}`)}>Получить условия<ArrowRight size={18} aria-hidden="true" /></button>
    </div>
  </article>
}

export function EmployerPrices({ onRequest }: Props) {
  const [city, setCity] = useState<EmployerPriceCity>('moscow')

  const onCityKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % cityKeys.length
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index - 1 + cityKeys.length) % cityKeys.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? cityKeys.length - 1 : -1
    if (next < 0) return
    event.preventDefault()
    setCity(cityKeys[next])
    document.getElementById(`employer-price-city-${cityKeys[next]}`)?.focus()
  }

  return <section className="employer-prices employer-section content-shell" id="employer-prices" tabIndex={-1} aria-labelledby="employer-prices-title">
    <div className="employer-section-heading">
      <h2 id="employer-prices-title">Специальные цены для ваших сотрудников</h2>
      <p>Скидка {formatEmployerPrice(employeeDiscount)} на обучение вождению по промокоду компании</p>
    </div>
    <div className="employer-price-cities" role="tablist" aria-label="Город обучения">
      {cityKeys.map((key, index) => <button key={key} id={`employer-price-city-${key}`} role="tab" type="button" aria-selected={city === key} aria-controls="employer-price-panel" tabIndex={city === key ? 0 : -1} onClick={() => setCity(key)} onKeyDown={(event) => onCityKey(event, index)}>{employerPriceCities[key].label}</button>)}
    </div>
    <div id="employer-price-panel" role="tabpanel" aria-labelledby={`employer-price-city-${city}`}>
      <div className="employer-price-cards">{employerProgrammes.map((programme) => <ProgrammeCard key={programme.code} {...programme} city={city} onRequest={onRequest} />)}</div>
    </div>
    <p className="employer-price-saving"><Check size={20} aria-hidden="true" /><span>Скидка <strong>{formatEmployerPrice(employeeDiscount)}</strong> уже учтена. Итоговая стоимость зависит от выбранной программы.</span></p>
  </section>
}
