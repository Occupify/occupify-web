import { BriefcaseMetalIcon } from '@phosphor-icons/react'

export interface OccupifyLogoProps {
  size?: number
  inverted?: boolean
  className?: string
  style?: React.CSSProperties
}

export function OccupifyLogo({ size = 32, inverted = false, className, style }: OccupifyLogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: inverted ? 'rgba(255,255,255,0.18)' : '#0A66C2',
          border: inverted ? '1px solid rgba(255,255,255,0.30)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: inverted ? '0 2px 10px rgba(0,0,0,0.12)' : '0 2px 8px rgba(10,102,194,0.30)',
          flexShrink: 0,
        }}
      >
        <BriefcaseMetalIcon size={Math.round(size * 0.58)} color="#fff" weight="fill" />
      </div>
      <span
        style={{
          fontSize: Math.round(size * 0.72),
          fontWeight: 800,
          color: inverted ? '#ffffff' : '#0A66C2',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        Occupify
      </span>
    </div>
  )
}
