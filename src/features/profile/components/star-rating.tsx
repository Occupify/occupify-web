export interface StarRatingProps {
  rating: number
  size?: number
}

export function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: size,
            color: s <= rating ? '#F5A623' : '#D1D5DB',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
