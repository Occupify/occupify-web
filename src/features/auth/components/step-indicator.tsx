export interface StepIndicatorProps {
  current: number
  total: number
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 28,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 9999,
            background: i < current ? '#0A66C2' : i === current ? '#0A66C2' : 'rgba(0,0,0,0.12)',
            opacity: i === current ? 1 : i < current ? 0.85 : 1,
            transition: 'background 300ms',
          }}
        />
      ))}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(0,0,0,0.40)',
          whiteSpace: 'nowrap',
          marginLeft: 4,
        }}
      >
        {current + 1}/{total}
      </span>
    </div>
  )
}
