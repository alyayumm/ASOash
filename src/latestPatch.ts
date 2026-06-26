const scenarioStatuses = new Map([
  ['audience-path--growth', 'Автошкола уже работает'],
  ['audience-path--launch', 'Планируется запуск'],
  ['audience-path--system', 'Нужна готовая система'],
])

let pendingQuizStatus = ''

function setText(selector: string, html: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) element.innerHTML = html
}

function patchHero() {
  setText('.hero-copy .brand-kicker', 'АСО Автошкола')
  setText('.hero-copy h1', 'Запуск и развитие автошкол <span>под ключ</span>')
  setText(
    '.hero-lead',
    'Проектируем управленческий контур: маркетинг, продажи, процессы и экономику. Сначала проводим диагностику ситуации, затем показываем, какие решения нужны именно вашей автошколе.',
  )

  const actions = document.querySelector<HTMLElement>('.hero-actions')
  const primary = actions?.querySelector<HTMLElement>('.button--primary')
  const diagnostic = actions?.querySelector<HTMLButtonElement>('.text-button')

  if (primary) primary.style.display = 'none'
  if (diagnostic) {
    diagnostic.classList.add('button', 'button--primary', 'button--large', 'hero-diagnostic-button')
    diagnostic.innerHTML = 'Пройти диагностику <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
}

function patchDirections() {
  const target = document.querySelector<HTMLElement>('#directions .direction-composition')
  if (!target || target.dataset.latestPatched === 'true') return

  target.dataset.latestPatched = 'true'
  target.innerHTML = `
    <article class="direction direction--growth">
      <div class="direction__copy">
        <span>Развитие</span>
        <h3>Действующая автошкола</h3>
        <p>Собираем экономику, маркетинг, продажи и филиалы в управляемую модель.</p>
      </div>
      <div class="direction-art direction-art--chart" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
    </article>
    <article class="direction direction--launch">
      <div class="direction__copy">
        <span>Запуск</span>
        <h3>Автошкола с нуля</h3>
        <p>Проектируем маршрут запуска до первых затрат и случайных решений.</p>
      </div>
      <div class="direction-art direction-art--route" aria-hidden="true"><i></i><i></i><i></i></div>
    </article>
    <article class="direction direction--system">
      <div class="direction__copy">
        <span>Система</span>
        <h3>Готовый контур управления</h3>
        <p>Внедряем стандарты и инструменты так, чтобы контроль оставался у владельца.</p>
      </div>
      <div class="direction-art direction-art--speed" aria-hidden="true"><i></i><b></b></div>
    </article>
  `
}

function patchLossFunnel() {
  const target = document.querySelector<HTMLElement>('.loss-map-section .content-shell')
  if (!target || target.dataset.latestPatched === 'true') return

  target.dataset.latestPatched = 'true'
  target.innerHTML = `
    <div class="section-heading loss-heading">
      <h2 id="loss-map-title">Где теряются деньги и управляемость</h2>
      <p>Проблема часто находится не в одном отделе, а в разрывах между этапами. Поэтому мы смотрим на весь путь — от рекламы до решения собственника.</p>
    </div>
    <div class="loss-funnel" aria-label="Воронка потенциальной прибыли и потерь">
      ${[
        ['Заявки', 'Разные данные', 'Маркетинг и продажи считают результат по-разному.', 100, 18],
        ['Продажи', 'Нет общей картины', 'Переходы между этапами видны не полностью.', 82, 22],
        ['Договоры', 'План без факта', 'План не связан с реальными действиями команды.', 60, 16],
        ['Решения', 'Решения на ощущениях', 'Собственник собирает выводы вручную.', 44, 14],
      ].map(([stage, reason, detail, potential, loss]) => `
        <article class="loss-funnel__row">
          <div class="loss-funnel__labels"><span>${stage}</span><strong>${reason}</strong></div>
          <div class="loss-funnel__bar" aria-hidden="true">
            <span class="loss-funnel__potential" style="width:${potential}%"></span>
            <span class="loss-funnel__lost" style="width:${loss}%;left:calc(${potential}% - ${loss}%)"></span>
            <i style="left:calc(${potential}% - 10px)"></i>
          </div>
          <p>${detail}</p>
        </article>
      `).join('')}
      <div class="loss-funnel__summary">
        <strong>−N% потенциальной прибыли</strong>
        <span>точный процент определяется после диагностики</span>
      </div>
    </div>
  `
}

function rememberScenarioClick(event: MouseEvent) {
  const button = (event.target as Element | null)?.closest('.audience-path .round-link')
  const card = button?.closest<HTMLElement>('.audience-path')
  if (!card) return

  for (const [className, status] of scenarioStatuses) {
    if (card.classList.contains(className)) pendingQuizStatus = status
  }
}

function prefillQuizStatus() {
  if (!pendingQuizStatus) return

  const option = Array.from(document.querySelectorAll<HTMLButtonElement>('.quiz-option'))
    .find((button) => button.textContent?.trim() === pendingQuizStatus)

  if (option) {
    option.click()
    pendingQuizStatus = ''
  }
}

function applyLatestPatch() {
  patchHero()
  patchDirections()
  patchLossFunnel()
  prefillQuizStatus()
}

document.addEventListener('click', rememberScenarioClick, { capture: true })

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(applyLatestPatch)
  })
} else {
  requestAnimationFrame(applyLatestPatch)
}

new MutationObserver(applyLatestPatch).observe(document.documentElement, {
  childList: true,
  subtree: true,
})
