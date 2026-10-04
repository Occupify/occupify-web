import {
  BriefcaseIcon,
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  MapPinIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react'
import type { ProfileExperience } from '../types'

export interface ProfileExperienceCardProps {
  experiences: ProfileExperience[]
  isOwnProfile?: boolean
  onAddClick?: () => void
  onEditClick?: (exp: ProfileExperience) => void
  onDeleteClick?: (id: string | number) => void
}

export function ProfileExperienceCard({
  experiences,
  isOwnProfile = true,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: ProfileExperienceCardProps) {
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BriefcaseIcon size={20} color="#0A66C2" weight="bold" />
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            Kinh nghiệm làm việc
          </span>
        </div>

        {isOwnProfile && (
          <button
            type="button"
            onClick={onAddClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              color: '#0A66C2',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 6,
              transition: 'all 120ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#DBEAFE'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#EFF6FF'
            }}
          >
            <PlusIcon size={14} weight="bold" />
            <span>Thêm kinh nghiệm</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {experiences.map((exp, index) => {
          const companyInitial = exp.company.trim().charAt(0).toUpperCase() || 'C'
          const isLast = index === experiences.length - 1

          return (
            <div
              key={exp.id}
              style={{
                display: 'flex',
                gap: 16,
                paddingBottom: isLast ? 0 : 20,
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                position: 'relative',
              }}
            >
              {/* Company Logo Monogram Badge */}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 10,
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0A66C2',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {companyInitial}
              </div>

              {/* Main content body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    {/* Role Title */}
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 15.5,
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: 1.3,
                      }}
                    >
                      {exp.title}
                    </h4>

                    {/* Company and Employment type */}
                    <div
                      style={{
                        fontSize: 13.5,
                        color: '#334155',
                        fontWeight: 600,
                        marginTop: 3,
                      }}
                    >
                      <span>{exp.company}</span>
                      {exp.employmentType && (
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: '#0A66C2',
                            background: '#EFF6FF',
                            padding: '1px 8px',
                            borderRadius: 4,
                            marginLeft: 8,
                            border: '1px solid #DBEAFE',
                          }}
                        >
                          {exp.employmentType}
                        </span>
                      )}
                    </div>

                    {/* Timeline and Location */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginTop: 4,
                        fontSize: 12.5,
                        color: '#64748B',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CalendarBlankIcon size={14} />
                        <span>
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </span>

                      {exp.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <MapPinIcon size={14} />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for owner: Edit / Delete */}
                  {isOwnProfile && (
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => onEditClick?.(exp)}
                        title="Chỉnh sửa mục này"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748B',
                          padding: 6,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = '#EFF6FF'
                          el.style.color = '#0A66C2'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'none'
                          el.style.color = '#64748B'
                        }}
                      >
                        <PencilSimpleIcon size={15} weight="bold" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteClick?.(exp.id)}
                        title="Xóa mục này"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748B',
                          padding: 6,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = '#FEF2F2'
                          el.style.color = '#DC2626'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'none'
                          el.style.color = '#64748B'
                        }}
                      >
                        <TrashIcon size={15} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <p
                    style={{
                      fontSize: 13.5,
                      color: '#475569',
                      lineHeight: 1.6,
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                  >
                    {exp.description}
                  </p>
                )}

                {/* Skills tags */}
                {exp.skills && exp.skills.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: '#64748B',
                        fontWeight: 600,
                        alignSelf: 'center',
                      }}
                    >
                      Kỹ năng:
                    </span>
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: 11.5,
                          color: '#334155',
                          background: '#F1F5F9',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {experiences.length === 0 && (
          <p
            style={{
              fontSize: 13.5,
              color: '#94A3B8',
              textAlign: 'center',
              padding: '24px 0',
              margin: 0,
            }}
          >
            Chưa có mục kinh nghiệm làm việc nào được thêm.
          </p>
        )}
      </div>
    </div>
  )
}
