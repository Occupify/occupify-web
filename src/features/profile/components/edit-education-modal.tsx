import * as React from 'react'
import {
  XIcon,
  BuildingsIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'
import type { ProfileEducation, EducationFormData, EducationalInstitution } from '../types'
import { useInstitutions } from '../hooks/use-institutions'

export interface EditEducationModalProps {
  isOpen: boolean
  educationToEdit?: ProfileEducation | null
  onClose: () => void
  onSubmit: (data: EducationFormData) => void
  isSubmitting?: boolean
}

const DEGREE_OPTIONS = [
  'Cử nhân (Bachelor)',
  'Kỹ sư (Engineer)',
  'Thạc sĩ (Master)',
  'Tiến sĩ (Doctorate / PhD)',
  'Cao đẳng (Associate)',
  'Chứng chỉ nghề (Vocational / Certificate)',
  'Khác (Other)',
]

function EditEducationForm({
  educationToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditEducationModalProps, 'isOpen'>) {
  // Institution selection state
  const [searchKeyword, setSearchKeyword] = React.useState('')
  const [selectedInstitution, setSelectedInstitution] =
    React.useState<EducationalInstitution | null>(() => {
      if (educationToEdit?.institutionId) {
        return {
          id: educationToEdit.institutionId,
          name: educationToEdit.school,
        }
      }
      return null
    })
  const [customSchoolName, setCustomSchoolName] = React.useState(educationToEdit?.school || '')
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Education details state
  const [fieldOfStudy, setFieldOfStudy] = React.useState(educationToEdit?.fieldOfStudy || '')
  const [degree, setDegree] = React.useState(educationToEdit?.degree || DEGREE_OPTIONS[0])
  const [grade, setGrade] = React.useState(educationToEdit?.grade || '')
  const [startDate, setStartDate] = React.useState(
    educationToEdit?.startDate ||
      (educationToEdit?.period ? `${educationToEdit.period.slice(0, 4)}-09-01` : ''),
  )
  const [endDate, setEndDate] = React.useState(educationToEdit?.endDate || '')
  const [isCurrent, setIsCurrent] = React.useState(
    Boolean(educationToEdit?.isCurrent || educationToEdit?.period?.includes('Hiện tại')),
  )
  const [description, setDescription] = React.useState(educationToEdit?.description || '')
  const [documentFile, setDocumentFile] = React.useState<File | null>(null)

  // Query verified institutions from backend catalog
  const { data: institutions = [], isLoading: isSearchingInstitutions } =
    useInstitutions(searchKeyword)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectInstitution = (inst: EducationalInstitution) => {
    setSelectedInstitution(inst)
    setCustomSchoolName(inst.name)
    setIsDropdownOpen(false)
    setSearchKeyword('')
  }

  const handleClearInstitution = () => {
    setSelectedInstitution(null)
    setCustomSchoolName('')
    setSearchKeyword('')
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const chosenInstitutionId =
      selectedInstitution?.id || educationToEdit?.institutionId || 'inst-custom'
    const finalSchoolName = selectedInstitution?.name || customSchoolName.trim()

    if (!finalSchoolName || !fieldOfStudy.trim() || !startDate) return

    onSubmit({
      id: educationToEdit?.id,
      institutionId: chosenInstitutionId,
      school: finalSchoolName,
      fieldOfStudy: fieldOfStudy.trim(),
      degree: degree || undefined,
      grade: grade.trim() || undefined,
      startDate,
      endDate: isCurrent ? undefined : endDate || undefined,
      isCurrent,
      description: description.trim() || undefined,
      document: documentFile,
    })
  }

  const isFormValid =
    (selectedInstitution !== null || customSchoolName.trim().length > 0) &&
    fieldOfStudy.trim().length > 0 &&
    Boolean(startDate)

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 580,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A66C2',
              }}
            >
              <GraduationCapIcon size={20} weight="fill" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                {educationToEdit ? 'Chỉnh sửa học vấn' : 'Thêm thông tin học vấn'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748B' }}>
                Chọn trường đào tạo từ danh mục xác minh và cập nhật bằng cấp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 4,
              display: 'flex',
              borderRadius: 6,
            }}
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Institution Selector */}
          <div ref={dropdownRef} style={{ marginBottom: 16, position: 'relative' }}>
            <label
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Trường học / Cơ sở đào tạo (Institution) <span style={{ color: '#DC2626' }}>*</span>
            </label>

            {selectedInstitution ? (
              // Selected Institution Card
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #0A66C2',
                  background: '#F0F7FF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <BuildingsIcon size={22} weight="duotone" color="#0A66C2" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0A66C2' }}>
                      {selectedInstitution.name}
                    </div>
                    {selectedInstitution.code && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          padding: '1px 6px',
                          borderRadius: 4,
                          display: 'inline-block',
                          marginTop: 2,
                        }}
                      >
                        {selectedInstitution.code}{' '}
                        {selectedInstitution.city ? `• ${selectedInstitution.city}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearInstitution}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Đổi trường
                </button>
              </div>
            ) : (
              // Search Input
              <div>
                <div style={{ position: 'relative' }}>
                  <MagnifyingGlassIcon
                    size={16}
                    weight="bold"
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                    }}
                  />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Tìm trường: UIT, Bách Khoa, FPT, UEH..."
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '10px 12px 10px 36px',
                      fontSize: 13.5,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Dropdown Results */}
                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 60,
                      marginTop: 4,
                      background: '#fff',
                      borderRadius: 8,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      maxHeight: 220,
                      overflowY: 'auto',
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 12px',
                        background: '#F8FAFC',
                        borderBottom: '1px solid #F1F5F9',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#64748B',
                      }}
                    >
                      {isSearchingInstitutions
                        ? 'Đang tìm kiếm trường...'
                        : 'Danh mục cơ sở đào tạo xác minh'}
                    </div>

                    {institutions.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: 13,
                          color: '#94A3B8',
                        }}
                      >
                        Không tìm thấy trường phù hợp.
                      </div>
                    ) : (
                      institutions.map((inst) => (
                        <div
                          key={inst.id}
                          onClick={() => handleSelectInstitution(inst)}
                          style={{
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F8FAFC',
                            transition: 'background 100ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F0F7FF'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BuildingsIcon size={18} color="#0A66C2" weight="duotone" />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                                {inst.name}
                              </div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                                {inst.code ? `${inst.code} • ` : ''}
                                {inst.city || 'Việt Nam'}
                              </div>
                            </div>
                          </div>
                          <CheckCircleIcon size={16} color="#CBD5E1" />
                        </div>
                      ))
                    )}

                    {/* Fallback to custom name */}
                    {searchKeyword.trim() && (
                      <div
                        onClick={() => {
                          setSelectedInstitution({
                            id: 'inst-custom',
                            name: searchKeyword.trim(),
                          })
                          setCustomSchoolName(searchKeyword.trim())
                          setIsDropdownOpen(false)
                        }}
                        style={{
                          padding: '10px 12px',
                          background: '#FAF5FF',
                          borderTop: '1px solid #F3E8FF',
                          cursor: 'pointer',
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: '#7E22CE',
                        }}
                      >
                        Sử dụng tên: &quot;{searchKeyword.trim()}&quot;
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Field of Study */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="edu-field"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Ngành học / Chuyên ngành (Field of Study) <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="edu-field"
              type="text"
              required
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="VD: Khoa học máy tính, Kỹ thuật phần mềm, UI/UX..."
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 13.5,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Degree & Grade Row */}
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}
          >
            <div>
              <label
                htmlFor="edu-degree"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Trình độ / Bằng cấp
              </label>
              <select
                id="edu-degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  padding: '9px 12px',
                  fontSize: 13.5,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  background: '#fff',
                  outline: 'none',
                }}
              >
                {DEGREE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="edu-grade"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Xếp loại / GPA (Tùy chọn)
              </label>
              <input
                id="edu-grade"
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="VD: Giỏi, GPA 3.6/4.0"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  padding: '9px 12px',
                  fontSize: 13.5,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Dates & isCurrent Checkbox */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}
            >
              <div>
                <label
                  htmlFor="edu-start-date"
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 6,
                    color: '#334155',
                  }}
                >
                  Ngày bắt đầu <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="edu-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '9px 12px',
                    fontSize: 13.5,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="edu-end-date"
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 6,
                    color: isCurrent ? '#94A3B8' : '#334155',
                  }}
                >
                  Ngày tốt nghiệp / kết thúc
                </label>
                <input
                  id="edu-end-date"
                  type="date"
                  disabled={isCurrent}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    padding: '9px 12px',
                    fontSize: 13.5,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                    background: isCurrent ? '#F1F5F9' : '#fff',
                    color: isCurrent ? '#94A3B8' : '#0F172A',
                  }}
                />
              </div>
            </div>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => {
                  setIsCurrent(e.target.checked)
                  if (e.target.checked) setEndDate('')
                }}
                style={{ width: 16, height: 16, accentColor: '#0A66C2', cursor: 'pointer' }}
              />
              Hiện tại tôi đang theo học tại đây
            </label>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="edu-desc"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Mô tả quá trình học tập (Tùy chọn)
            </label>
            <textarea
              id="edu-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chia sẻ về hoạt động nghiên cứu, luận văn tốt nghiệp, học bổng hoặc câu lạc bộ sinh viên..."
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 13.5,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Proof Document File */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="edu-doc"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tài liệu minh chứng bằng cấp / thẻ SV (Tùy chọn)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                border: '1px dashed #CBD5E1',
                borderRadius: 8,
                background: '#F8FAFC',
              }}
            >
              <UploadSimpleIcon size={18} color="#0A66C2" weight="bold" />
              <input
                id="edu-doc"
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setDocumentFile(file)
                }}
                style={{ fontSize: 12.5, color: '#475569', flex: 1 }}
              />
              {documentFile && (
                <button
                  type="button"
                  onClick={() => setDocumentFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              paddingTop: 12,
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#fff',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: isFormValid && !isSubmitting ? '#0A66C2' : '#94A3B8',
                color: '#fff',
                cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : educationToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditEducationModal({ isOpen, ...props }: EditEducationModalProps) {
  if (!isOpen) return null
  return (
    <EditEducationForm
      key={props.educationToEdit?.id ?? props.educationToEdit?.school ?? 'new'}
      {...props}
    />
  )
}
