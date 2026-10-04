import * as React from 'react'
import { PlusIcon, PencilSimpleIcon, TrashIcon, StarIcon } from '@phosphor-icons/react'
import type { ProfileSkill } from '../types'

export interface ProfileSkillsCardProps {
  skills: ProfileSkill[]
  isOwnProfile?: boolean
  onAddClick?: () => void
  onEditClick?: (skill: ProfileSkill) => void
  onDeleteClick?: (id: string | number) => void
}

export function ProfileSkillsCard({
  skills,
  isOwnProfile = true,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: ProfileSkillsCardProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    skills.forEach((s) => {
      if (s.category) cats.add(s.category)
    })
    return ['all', ...Array.from(cats)]
  }, [skills])

  // Group skills by category for "all" view
  const groupedSkills = React.useMemo(() => {
    const map = new Map<string, ProfileSkill[]>()
    skills.forEach((s) => {
      const cat = s.category || 'Khác'
      const list = map.get(cat) || []
      list.push(s)
      map.set(cat, list)
    })
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }))
  }, [skills])

  const filteredSkills = React.useMemo(() => {
    if (selectedCategory === 'all') return null
    return skills.filter((s) => s.category === selectedCategory)
  }, [skills, selectedCategory])

  const renderSkillBadge = (skill: ProfileSkill) => (
    <div
      key={skill.id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 9999,
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        fontSize: 13,
        fontWeight: 600,
        color: '#1E293B',
        transition: 'all 120ms ease',
      }}
    >
      <span>{skill.name}</span>

      {skill.isTopSkill && (
        <span title="Kỹ năng nổi bật" style={{ display: 'inline-flex' }}>
          <StarIcon size={12} weight="fill" color="#F59E0B" />
        </span>
      )}

      {isOwnProfile && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginLeft: 4,
            paddingLeft: 4,
            borderLeft: '1px solid #CBD5E1',
          }}
        >
          {onEditClick && (
            <button
              type="button"
              onClick={() => onEditClick(skill)}
              title="Chỉnh sửa kỹ năng"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                color: '#64748B',
                display: 'flex',
                borderRadius: 4,
                transition: 'color 120ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0F172A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748B'
              }}
            >
              <PencilSimpleIcon size={12} weight="bold" />
            </button>
          )}
          {onDeleteClick && (
            <button
              type="button"
              onClick={() => onDeleteClick(skill.id)}
              title="Xóa kỹ năng"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                color: '#94A3B8',
                display: 'flex',
                borderRadius: 4,
                transition: 'color 120ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#DC2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8'
              }}
            >
              <TrashIcon size={12} weight="bold" />
            </button>
          )}
        </div>
      )}
    </div>
  )

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            Kỹ năng chuyên môn
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              background: '#F1F5F9',
              color: '#475569',
              padding: '2px 8px',
              borderRadius: 9999,
            }}
          >
            {skills.length}
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
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 6,
              transition: 'all 120ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#0F172A'
              el.style.color = '#fff'
              el.style.borderColor = '#0F172A'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#F8FAFC'
              el.style.color = '#0F172A'
              el.style.borderColor = '#E2E8F0'
            }}
          >
            <PlusIcon size={14} weight="bold" />
            <span>Thêm kỹ năng</span>
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      {categories.length > 2 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 20,
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            const label = cat === 'all' ? 'Tất cả' : cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 9999,
                  border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                  background: isSelected ? '#0F172A' : '#F8FAFC',
                  color: isSelected ? '#fff' : '#475569',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 120ms ease',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Skills rendering */}
      {skills.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: 13,
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px dashed #E2E8F0',
          }}
        >
          Chưa có thông tin kỹ năng chuyên môn.
        </div>
      ) : selectedCategory === 'all' ? (
        /* Categorized clean list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {groupedSkills.map((grp) => (
            <div key={grp.category}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#64748B',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {grp.category}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {grp.items.map(renderSkillBadge)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Filtered single category view */
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filteredSkills && filteredSkills.length > 0 ? (
            filteredSkills.map(renderSkillBadge)
          ) : (
            <div
              style={{
                width: '100%',
                padding: '20px 16px',
                textAlign: 'center',
                color: '#94A3B8',
                fontSize: 13,
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px dashed #E2E8F0',
              }}
            >
              Chưa có kỹ năng nào trong nhóm này.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
