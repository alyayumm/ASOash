import logoAsset from '../assets/aso-logo-transparent-cropped.png'

type BrandLogoProps = {
  inverse?: boolean
}

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo${inverse ? ' brand-logo--inverse' : ''}`} aria-label="АСО Автошкол">
      <img className="brand-logo__image" src={logoAsset} alt="" aria-hidden="true" />
    </span>
  )
}
