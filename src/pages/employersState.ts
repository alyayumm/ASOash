export type EmployerPayment = 'employee' | 'company'
export type BuyerTaxRegime = 'osno' | 'usn' | 'unknown'
export type EmployerSelection = { payment: EmployerPayment; tax: BuyerTaxRegime }

export function readEmployerSelection(search: string): EmployerSelection {
  const params = new URLSearchParams(search)
  return {
    payment: params.get('payment') === 'company' ? 'company' : 'employee',
    tax: params.get('tax') === 'osno' ? 'osno' : params.get('tax') === 'usn' ? 'usn' : 'unknown',
  }
}

export function employerSelectionUrl(href: string, selection: EmployerSelection) {
  const url = new URL(href)
  url.searchParams.set('page', 'employers')
  url.searchParams.set('payment', selection.payment)
  if (selection.payment === 'company' && selection.tax !== 'unknown') url.searchParams.set('tax', selection.tax)
  else url.searchParams.delete('tax')
  return url.href
}

export type EmployerAttribution = { company_id: string; campaign_id: string }
const safeIdentifier = (value: unknown) => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(value) ? value : ''

export function readEmployerAttribution(search: string, saved: string | null): EmployerAttribution {
  let prior: Partial<EmployerAttribution> = {}
  try { const parsed: unknown = JSON.parse(saved || '{}'); if (typeof parsed === 'object' && parsed !== null) prior = parsed } catch { /* Attribution must not block the page. */ }
  const params = new URLSearchParams(search)
  const company = safeIdentifier(params.get('company_id'))
  const changedCompany = Boolean(company && company !== safeIdentifier(prior.company_id))
  return {
    company_id: company || safeIdentifier(prior.company_id),
    campaign_id: safeIdentifier(params.get('campaign_id')) || (changedCompany ? '' : safeIdentifier(prior.campaign_id)),
  }
}

export function getEmployerAttribution(): EmployerAttribution {
  let saved: string | null = null
  try { saved = sessionStorage.getItem('aso_employer_attribution_v1') } catch { /* Storage may be unavailable. */ }
  const attribution = readEmployerAttribution(location.search, saved)
  try { sessionStorage.setItem('aso_employer_attribution_v1', JSON.stringify(attribution)) } catch { /* Storage may be unavailable. */ }
  return attribution
}

// This adapter only links to an existing, server-backed employee enrollment flow.
// It neither validates a promo code nor treats a browser redirect as payment proof.
export function employeeEnrollmentUrl(configuredUrl: string | undefined, attribution: EmployerAttribution) {
  if (!configuredUrl) return null
  try {
    const url = new URL(configuredUrl)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    if (attribution.company_id) url.searchParams.set('company_id', attribution.company_id)
    if (attribution.campaign_id) url.searchParams.set('campaign_id', attribution.campaign_id)
    return url.href
  } catch { return null }
}
