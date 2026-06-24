type BrandLogoProps = {
  inverse?: boolean
}

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo${inverse ? ' brand-logo--inverse' : ''}`} aria-label="АСО Автошкол">
      <span className="brand-logo__source" aria-hidden="true" />
    </span>
  )
}
