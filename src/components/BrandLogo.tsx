import logoColorAsset from '../assets/aso-logo-color.png'
import logoWhiteAsset from '../assets/aso-logo-white.png'

type BrandLogoProps = {
  inverse?: boolean
}

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo${inverse ? ' brand-logo--inverse' : ''}`} aria-label="ASO Avtoshkol">
      <img className="brand-logo__image" src={inverse ? logoWhiteAsset : logoColorAsset} alt="" aria-hidden="true" />
    </span>
  )
}
