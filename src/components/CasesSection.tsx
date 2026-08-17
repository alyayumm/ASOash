import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { casePreviews } from '../data'
import type { CasePreview } from '../types'

const caseStages = [
  { key: 'before', label: 'Проблема' },
  { key: 'implementation', label: 'Как решили' },
  { key: 'result', label: 'Что получил собственник' },
] as const

function ControlVisual() {
  return (
    <div className="case-visual case-visual--control" aria-label="Рабочие артефакты: план-факт, CRM-воронка и филиалы">
      <div className="case-ui-panel case-ui-panel--plan">
        <div className="case-ui-panel__head"><span>План / факт</span><i /></div>
        <div className="case-bars" aria-hidden="true">
          {[44, 58, 50, 68, 62, 78].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
        </div>
        <div className="case-ui-legend"><span>План</span><span>Факт</span><span>Динамика</span></div>
      </div>

      <div className="case-ui-panel case-ui-panel--crm">
        <div className="case-ui-panel__head"><span>CRM-воронка</span><i /></div>
        <div className="case-funnel-lines" aria-hidden="true">
          <span>Обращения</span>
          <span>Квалифицированные</span>
          <span>Договоры</span>
          <span>Оплаты</span>
        </div>
      </div>

      <div className="case-ui-panel case-ui-panel--branches">
        <div className="case-ui-panel__head"><span>Филиалы</span><i /></div>
        {['Филиал 01', 'Филиал 02', 'Филиал 03'].map((branch, index) => (
          <div className="case-table-row" key={branch}>
            <span>{branch}</span>
            <i style={{ width: `${72 - index * 10}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function LaunchVisual() {
  return (
    <div className="case-visual case-visual--launch" aria-label="Рабочие артефакты: маршрут запуска, экономика и роли команды">
      <div className="case-ui-panel case-ui-panel--roadmap">
        <div className="case-ui-panel__head"><span>Маршрут запуска</span><i /></div>
        <div className="case-roadmap" aria-hidden="true">
          {['Модель', 'Продажи', 'Команда', 'Запуск'].map((step) => <span key={step}>{step}</span>)}
        </div>
      </div>

      <div className="case-ui-panel case-ui-panel--unit">
        <div className="case-ui-panel__head"><span>Unit-экономика</span><i /></div>
        <div className="case-unit-grid" aria-hidden="true">
          <span>Затраты</span>
          <span>Цена</span>
          <span>План</span>
        </div>
      </div>

      <div className="case-ui-panel case-ui-panel--roles">
        <div className="case-ui-panel__head"><span>Роли команды</span><i /></div>
        {['Владелец', 'Администратор', 'Продажи'].map((role) => (
          <div className="case-role-row" key={role}><span>{role}</span><i /></div>
        ))}
      </div>
    </div>
  )
}

function ManagementVisual() {
  return (
    <div className="case-visual case-visual--management" aria-label="Рабочие артефакты: dashboard собственника, ответственность и ритм контроля">
      <div className="case-ui-panel case-ui-panel--owner">
        <div className="case-ui-panel__head"><span>Dashboard собственника</span><i /></div>
        {['Показатели', 'Отклонения', 'Решения'].map((row, index) => (
          <div className="case-dashboard-row" key={row}>
            <span>{row}</span>
            <i style={{ width: `${82 - index * 14}%` }} />
          </div>
        ))}
      </div>

      <div className="case-ui-panel case-ui-panel--responsibility">
        <div className="case-ui-panel__head"><span>Ответственность</span><i /></div>
        {['Маркетинг', 'Продажи', 'Филиалы'].map((row) => <div className="case-role-row" key={row}><span>{row}</span><i /></div>)}
      </div>

      <div className="case-ui-panel case-ui-panel--calendar">
        <div className="case-ui-panel__head"><span>Ритм контроля</span><i /></div>
        <div className="case-calendar-grid" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => <span key={index} className={index === 3 || index === 8 ? 'is-active' : ''} />)}
        </div>
      </div>
    </div>
  )
}

function CaseVisual({ type }: { type: CasePreview['visualType'] }) {
  if (type === 'launch') return <LaunchVisual />
  if (type === 'management') return <ManagementVisual />
  return <ControlVisual />
}

export function CasesSection() {
  const [activeId, setActiveId] = useState<CasePreview['id']>('control')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const activeCase = useMemo(() => casePreviews.find((item) => item.id === activeId) ?? casePreviews[0], [activeId])
  const compactCases = casePreviews.filter((item) => item.id !== activeCase.id)

  const selectCase = (id: CasePreview['id']) => {
    setActiveId(id)
    setDetailsOpen(false)
  }

  return (
    <section className="cases-section section-padding" aria-labelledby="cases-title">
      <div className="content-shell">
        <div className="cases-heading">
          <div>
            <p className="cases-label">Кейсы</p>
            <h2 id="cases-title">Типовые кейсы автошкол и логика решения</h2>
          </div>
          <p>Сценарии собраны по типовым задачам. Цифры используются как условные ориентиры, а чувствительные данные не раскрываются.</p>
        </div>

        <article className="case-study" aria-live="polite">
          <div className="case-study__intro">
            <div className="case-study__meta"><span>{activeCase.number}</span><i />{activeCase.category}</div>
            <h3>{activeCase.title}</h3>
            <p className="case-study__task">{activeCase.task}</p>
            <div className="case-metrics" aria-label="Условные показатели кейса">
              {activeCase.metrics.map((metric) => (
                <div className="case-metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="case-study__visual">
            <CaseVisual type={activeCase.visualType} />
          </div>

          <div className="case-study__body">
            <div className="case-flow">
              {caseStages.map((stage) => (
                <div className="case-flow__item" key={stage.key}>
                  <span>{stage.label}</span>
                  <p>{activeCase[stage.key]}</p>
                </div>
              ))}
            </div>

            <div className="case-study__footer">
              <div className="case-tags" aria-label="Материалы кейса">
                {activeCase.materials.map((material) => <span key={material}>{material}</span>)}
              </div>
              <button
                className="case-study__link"
                type="button"
                aria-expanded={detailsOpen}
                aria-controls={`case-details-${activeCase.id}`}
                onClick={() => setDetailsOpen((value) => !value)}
              >
                Посмотреть разбор <ArrowRight aria-hidden="true" />
              </button>
            </div>

            {detailsOpen ? (
              <div className="case-study__details" id={`case-details-${activeCase.id}`}>
                В полном разборе показываем исходную проблему, логику решения и связку материалов: {activeCase.materials.join(', ')}. Данные клиента остаются обезличенными.
              </div>
            ) : null}
          </div>
        </article>

        <div className="case-selector" aria-label="Другие кейсы">
          {compactCases.map((item) => (
            <button className="case-selector__item" type="button" key={item.id} onClick={() => selectCase(item.id)}>
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <ArrowRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
