import type { TrackingFields } from '../types'

const trackingFieldNames: Array<keyof TrackingFields> = [
  'formId',
  'source',
  'pageUrl',
  'landingPage',
  'referrer',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmContent',
  'utmTerm',
  'yclid',
  'gclid',
  'fbclid',
  'submittedAt',
  'userAgent',
]

export function HiddenTrackingInputs({ fields }: { fields: TrackingFields }) {
  return (
    <>
      {trackingFieldNames.map((name) => (
        <input key={name} type="hidden" name={`tracking[${name}]`} value={fields[name]} readOnly />
      ))}
    </>
  )
}
