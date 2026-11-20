import { useState, type KeyboardEvent } from 'react'
import { ArrowRight, MonitorPlay } from 'lucide-react'
import motorcycle from '../assets/hr-category-a-motorcycle.webp'
import car from '../assets/hr-category-b-car.webp'
import { employerCities, type EmployerCity } from './employersData'

const cities = Object.keys(employerCities) as EmployerCity[]
type Props = { onRequest: (city: string, topic: string) => void }

export function EmployerProgrammes({ onRequest }: Props) {
  const [city, setCity] = useState<EmployerCity>('moscow')
  const [transmission, setTransmission] = useState('МКПП')
  const cityKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % cities.length : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index - 1 + cities.length) % cities.length : event.key === 'Home' ? 0 : event.key === 'End' ? cities.length - 1 : -1
    if (next < 0) return
    event.preventDefault()
    setCity(cities[next])
    document.getElementById(`employer-city-${cities[next]}`)?.focus()
  }
  return <section className="employer-section content-shell employer-programmes" id="employer-programmes" tabIndex={-1} aria-labelledby="employer-programmes-title">
    <div className="employer-section-heading"><p className="corporate-label">Особые корпоративные условия обучения</p><h2 id="employer-programmes-title">Обучение на корпоративных условиях</h2><p>Подберём программу для сотрудников вашей компании в Москве и Санкт-Петербурге.</p></div>
    <div className="employer-city-tabs" role="tablist" aria-label="Город обучения">{cities.map((value, index) => <button key={value} id={`employer-city-${value}`} type="button" role="tab" aria-selected={city === value} tabIndex={city === value ? 0 : -1} aria-controls="employer-city-panel" onClick={() => setCity(value)} onKeyDown={(event) => cityKeys(event, index)}>{employerCities[value]}</button>)}</div>
    <div id="employer-city-panel" role="tabpanel" aria-labelledby={`employer-city-${city}`}>
      <div className="employer-programme-cards">{(['A', 'B'] as const).map(category => <article className="employer-programme-card" key={category} aria-labelledby={`employer-category-${category}`}>
        <div className="employer-programme-visual"><img src={category === 'A' ? motorcycle : car} width={1254} height={1254} loading="lazy" alt={category === 'A' ? 'Учебный мотоцикл' : 'Учебный автомобиль'} /></div>
        <div className="employer-programme-copy"><span className="employer-programme-city">{employerCities[city]}</span><h3 id={`employer-category-${category}`}>Категория {category}</h3><p>{category === 'A' ? 'Обучение вождению мотоцикла.' : 'Обучение вождению автомобиля.'}</p>
          <p className="employer-online-theory"><MonitorPlay size={18} aria-hidden="true" />Онлайн-теория</p>
          {category === 'B' ? <fieldset className="employer-transmission"><legend>Коробка передач</legend><div>{['МКПП', 'АКПП'].map(value => <label key={value}><input type="radio" name="employer-transmission" value={value} checked={transmission === value} onChange={() => setTransmission(value)} /><span>{value}</span></label>)}</div></fieldset> : <p className="employer-programme-description">Практические занятия на мотоцикле.</p>}
          <div className="employer-programme-offer"><strong>Стоимость по корпоративным условиям</strong><button type="button" className="button button--primary" onClick={() => onRequest(employerCities[city], `Категория ${category}${category === 'B' ? ` · ${transmission}` : ''}`)}>Получить предложение<ArrowRight size={18} aria-hidden="true" /></button></div>
        </div>
      </article>)}</div>
    </div>
    <button className="corporate-text-button employer-other-category" type="button" onClick={() => onRequest(employerCities[city], 'Подбор категории обучения')}>Обсудить нужную категорию<ArrowRight size={18} aria-hidden="true" /></button>
  </section>
}
