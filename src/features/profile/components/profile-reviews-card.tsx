import * as React from 'react'
import { SealCheckIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import { StarRating } from './star-rating'
import { nameToGmail } from '../api'
import type { ProfileReview } from '../types'

export interface ProfileReviewsCardProps {
  reviews: ProfileReview[]
}

export function ProfileReviewsCard({ reviews }: ProfileReviewsCardProps) {
  const [starFilter, setStarFilter] = React.useState<number | null>(null)

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

  const filteredReviews = React.useMemo(() => {
    if (starFilter === null) return reviews
    return reviews.filter((r) => r.rating === starFilter)
  }, [reviews, starFilter])

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid var(--border-subtle)',
          letterSpacing: '-0.01em',
        }}
      >
        Đánh giá & Phản hồi từ đối tác
      </div>

      {/* Rating Summary & Distribution */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 20,
          padding: '16px 20px',
          background: '#F8FAFC',
          borderRadius: 10,
          border: '1px solid #F1F5F9',
          flexWrap: 'wrap',
        }}
      >
        {/* Score Overview */}
        <div style={{ textAlign: 'center', minWidth: 100, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1,
            }}
          >
            {avgRating}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            <StarRating rating={Math.round(Number(avgRating))} size={16} />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
            {reviews.length} lượt đánh giá
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: 1,
            height: 80,
            background: '#E2E8F0',
            display: 'none',
          }}
          className="sm:block"
        />

        {/* Star breakdown bars */}
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
            const isSelected = starFilter === star

            return (
              <button
                key={star}
                type="button"
                onClick={() => setStarFilter(isSelected ? null : star)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isSelected ? '#EFF6FF' : 'none',
                  border: isSelected ? '1px solid #93C5FD' : '1px solid transparent',
                  borderRadius: 6,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  fontFamily: 'inherit',
                  transition: 'all 120ms ease',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: '#475569',
                    minWidth: 24,
                    textAlign: 'right',
                    fontWeight: 600,
                  }}
                >
                  {star}★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 7,
                    background: '#E2E8F0',
                    borderRadius: 9999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: '#F5A623',
                      borderRadius: 9999,
                      transition: 'width 250ms ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    minWidth: 24,
                    textAlign: 'left',
                    fontWeight: 500,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter indicator */}
      {starFilter !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            padding: '6px 12px',
            background: '#EFF6FF',
            borderRadius: 6,
            border: '1px solid #DBEAFE',
          }}
        >
          <span style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>
            Đang lọc đánh giá {starFilter} sao ({filteredReviews.length} kết quả)
          </span>
          <button
            type="button"
            onClick={() => setStarFilter(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: '#0A66C2',
              fontFamily: 'inherit',
              fontWeight: 700,
              padding: 0,
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Reviews list (All sensitive metadata: price, duration, project name & tags are removed) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredReviews.map((r) => (
          <div
            key={r.id}
            style={{
              padding: '16px 18px',
              background: '#F8FAFC',
              borderRadius: 10,
              border: '1px solid #F1F5F9',
            }}
          >
            {/* Reviewer Header */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <Avatar name={r.reviewer} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14.5,
                      color: '#0F172A',
                    }}
                  >
                    {r.reviewer}
                  </div>

                  <span
                    style={{
                      fontSize: 11.5,
                      color: '#057642',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      padding: '2px 8px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 600,
                    }}
                  >
                    <SealCheckIcon size={13} weight="fill" />
                    Đã xác thực hợp tác
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    marginTop: 2,
                    marginBottom: 4,
                  }}
                >
                  {nameToGmail(r.reviewer)} · {r.date || 'Đối tác dự án'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StarRating rating={r.rating} size={13} />
                </div>
              </div>
            </div>

            {/* Comment text */}
            <p
              style={{
                fontSize: 13.5,
                color: '#334155',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {r.comment}
            </p>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <p
            style={{
              fontSize: 13.5,
              color: '#94A3B8',
              textAlign: 'center',
              padding: '24px 0',
              margin: 0,
            }}
          >
            Không có đánh giá nào cho mức {starFilter} sao.
          </p>
        )}
      </div>
    </div>
  )
}
