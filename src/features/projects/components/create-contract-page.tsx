import { useRef, useState } from 'react'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  FileText,
  FolderPlus,
  Paperclip,
  SealCheck,
  X,
} from '@phosphor-icons/react'
import type { MyProject } from '../types'
import { CY_PERIODS, MY_PROJECTS_DATA } from '@/features/mock-data'

export interface CreateContractFormData {
  title: string
  value: string
  period: string
  startDate?: string
  endDate?: string
  role: string
  freelancerEmail: string
  candidateName?: string
  project: string | null
  termsFileName?: string
}

interface CreateContractPageProps {
  onBack: () => void
  onSubmit: (contractData: CreateContractFormData) => void
  initialProject?: string
  initialRole?: string
  initialCandidateName?: string
  initialCandidateEmail?: string
  initialBidValue?: string
  projects?: MyProject[]
}

const STANDARD_TECH_ROLES = [
  'Backend Developer',
  'Frontend Developer',
  'Fullstack Developer',
  'UI/UX Designer',
  'Mobile App Developer',
  'DevOps Engineer',
  'QA / QC Tester',
  'Data / BI Analyst',
  'Project Manager / PO',
]

export function CreateContractPage({
  onBack,
  onSubmit,
  initialProject,
  initialRole,
  initialCandidateName,
  initialCandidateEmail,
  initialBidValue,
  projects = MY_PROJECTS_DATA,
}: CreateContractPageProps) {
  const [title, setTitle] = useState(
    initialProject && initialRole
      ? `Hợp đồng ${initialRole} — ${initialProject}`
      : initialProject
        ? `Hợp đồng dịch vụ — ${initialProject}`
        : '',
  )
  const [value, setValue] = useState(initialBidValue ? initialBidValue.replace(/[^0-9]/g, '') : '')
  const [period, setPeriod] = useState(CY_PERIODS[1])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [termsFileName, setTermsFileName] = useState('')
  const [freelancerEmail, setFreelancerEmail] = useState(
    initialCandidateEmail ??
      (initialCandidateName
        ? `${initialCandidateName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
        : ''),
  )
  const [inviteMsg, setInviteMsg] = useState(
    initialCandidateName
      ? `Chào ${initialCandidateName}, chúng tôi rất ấn tượng với hồ sơ ứng tuyển của bạn cho vị trí ${
          initialRole || 'chuyên môn'
        } và trân trọng gửi bạn dự thảo hợp đồng này.`
      : '',
  )
  const [selectedProject, setSelectedProject] = useState<string | null>(initialProject ?? null)
  const [selectedRole, setSelectedRole] = useState<string>(initialRole ?? '')
  const [customRoleInput, setCustomRoleInput] = useState('')
  const [isCustomRole, setIsCustomRole] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const termsFileRef = useRef<HTMLInputElement>(null)

  const currentProjectObj = selectedProject
    ? projects.find((p) => p.name === selectedProject)
    : null
  const projectRecruitingRoles = currentProjectObj?.recruitingRoles ?? []

  const handleApplyCustomRole = () => {
    const trimmed = customRoleInput.trim()
    if (trimmed) {
      setIsCustomRole(true)
      setSelectedRole('')
      if (selectedProject && (!title || title.startsWith('Hợp đồng'))) {
        setTitle(`Hợp đồng ${trimmed} — ${selectedProject}`)
      }
    }
  }

  const activeRole =
    isCustomRole && customRoleInput.trim()
      ? customRoleInput.trim()
      : selectedRole.trim() || (customRoleInput.trim() ? customRoleInput.trim() : '')

  const canSubmit =
    title.trim().length > 0 &&
    value.trim().length > 0 &&
    freelancerEmail.trim().length > 0 &&
    termsFileName.trim().length > 0 &&
    activeRole.length > 0

  const projectNames = projects.map((p) => p.name)

  return (
    <div className="min-h-full pb-14 !bg-[var(--bg-base)]">
      {/* Top Banner */}
      <div className="py-8 !bg-gradient-to-r from-[var(--color-primary-500)] to-[#084FA0] !text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 flex cursor-pointer items-center gap-1.5 text-xs font-semibold !text-white/80 transition-colors hover:!text-white"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-extrabold sm:text-3xl !text-white">Tạo hợp đồng mới</h1>
          <p className="mt-1.5 text-sm !text-white/80">
            Điền thông tin và chỉ định vai trò để mời freelancer tham gia
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <div className="overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-3 border-b p-5 sm:px-6 !border-[var(--border-subtle)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
              <FileText size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold !text-[var(--text-primary)]">Tạo hợp đồng mới</h2>
              <p className="text-xs !text-[var(--text-secondary)]">
                Thiết lập hợp đồng và chọn vai trò chuyên môn cho freelancer
              </p>
            </div>
          </div>

          <div className="divide-y !divide-[var(--border-subtle)]">
            {/* 1. Chọn dự án */}
            <div className="p-5 sm:px-6">
              <h3 className="mb-3 text-sm font-bold !text-[var(--text-primary)]">
                1. Hợp đồng này dành cho dự án nào?
              </h3>

              {selectedProject && (
                <div className="mb-3 flex items-center justify-between rounded-lg p-2.5 sm:px-3 !bg-[var(--color-primary-50)]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FolderPlus
                      size={18}
                      weight="bold"
                      className="flex-shrink-0 !text-[var(--color-primary-500)]"
                    />
                    <span className="truncate text-xs font-bold !text-[var(--color-primary-500)]">
                      {selectedProject}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(null)
                      if (!isCustomRole) setSelectedRole('')
                    }}
                    className="cursor-pointer p-1 !text-[var(--text-tertiary)] hover:!text-[#C03A2B]"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                className="cursor-pointer rounded-full border px-5 py-2 text-xs font-semibold !border-[var(--color-primary-500)] !text-[var(--color-primary-500)] transition-colors hover:!bg-[var(--color-primary-50)]"
              >
                {selectedProject ? 'Đổi dự án khác' : 'Chọn dự án'}
              </button>
            </div>

            {/* 2. Chọn vai trò */}
            <div className="p-5 sm:px-6">
              <h3 className="mb-1 text-sm font-bold !text-[var(--text-primary)]">
                2. Vai trò (Role) trong hợp đồng *
              </h3>
              <p className="mb-4 text-xs !text-[var(--text-secondary)]">
                Chọn vị trí chuyên môn phù hợp mà freelancer sẽ đảm nhiệm trong dự án
              </p>

              {/* Roles from selected project */}
              {projectRecruitingRoles.length > 0 && (
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-bold !text-[var(--color-primary-500)]">
                    🎯 Các vị trí đang tuyển của dự án "{selectedProject}" (
                    {projectRecruitingRoles.length} vị trí)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectRecruitingRoles.map((r) => {
                      const isSelected = !isCustomRole && selectedRole === r.title
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setSelectedRole(r.title)
                            setIsCustomRole(false)
                          }}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'border-2 !border-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] font-bold'
                              : '!border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] hover:!bg-[var(--bg-subtle)]'
                          }`}
                        >
                          <Briefcase
                            size={14}
                            weight={isSelected ? 'fill' : 'regular'}
                            className={
                              isSelected
                                ? '!text-[var(--color-primary-500)]'
                                : '!text-[var(--text-secondary)]'
                            }
                          />
                          <span>{r.title}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              r.status === 'recruiting'
                                ? '!bg-[var(--color-success-bg)] !text-[var(--color-success-fg)]'
                                : '!bg-[var(--bg-base)] !text-[var(--text-tertiary)]'
                            }`}
                          >
                            {r.status === 'recruiting' ? 'Đang tuyển' : 'Đã có'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Standard Roles */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-bold !text-[var(--text-secondary)]">
                  {projectRecruitingRoles.length > 0
                    ? 'Hoặc chọn vai trò công nghệ phổ biến'
                    : 'Gợi ý vai trò phổ biến'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_TECH_ROLES.map((roleName) => {
                    const isSelected = !isCustomRole && selectedRole === roleName
                    return (
                      <button
                        key={roleName}
                        type="button"
                        onClick={() => {
                          setSelectedRole(roleName)
                          setIsCustomRole(false)
                        }}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? '!border-[var(--color-primary-500)] !bg-[var(--color-primary-500)] !text-white font-bold'
                            : '!border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] hover:!bg-[var(--bg-subtle)]'
                        }`}
                      >
                        {roleName}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Role */}
              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Hoặc tự nhập vai trò khác
                </label>
                <div className="flex max-w-md gap-2">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => {
                      setCustomRoleInput(e.target.value)
                      if (!e.target.value.trim() && isCustomRole) {
                        setIsCustomRole(false)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyCustomRole()
                      }
                    }}
                    placeholder="VD: Smart Contract Engineer, Security Auditor..."
                    className={`w-full rounded border p-2 text-xs !bg-[var(--bg-elevated)] !text-[var(--text-primary)] outline-none ${
                      isCustomRole && customRoleInput.trim()
                        ? 'border-2 !border-[var(--color-primary-500)]'
                        : '!border-[var(--border-default)] focus:!border-[var(--color-primary-500)]'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={!customRoleInput.trim()}
                    onClick={handleApplyCustomRole}
                    className={`whitespace-nowrap rounded px-4 py-2 text-xs font-semibold transition-all ${
                      customRoleInput.trim()
                        ? 'cursor-pointer !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)] !text-white shadow-xs'
                        : 'cursor-not-allowed opacity-50 !bg-[var(--bg-subtle)] !text-[var(--text-tertiary)] border !border-[var(--border-default)]'
                    }`}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Role preview */}
              {activeRole && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg p-2.5 sm:px-3 text-xs !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                  <SealCheck size={16} weight="fill" />
                  <span className="!text-[var(--text-secondary)]">Vai trò đã chọn:</span>
                  <span className="font-bold">{activeRole}</span>
                </div>
              )}
            </div>

            {/* Section 3 — Chi tiết hợp đồng */}
            <div className="p-5 sm:px-6">
              <h3 className="mb-4 text-sm font-bold !text-[var(--text-primary)]">
                Chi tiết hợp đồng
              </h3>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Tiêu đề hợp đồng *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Thiết kế UI/UX cho ứng dụng mobile Fintech"
                  className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                    Giá trị hợp đồng (VNĐ) *
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold !text-[var(--text-tertiary)]">
                      ₫
                    </span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="VD: 45000000"
                      className="w-full rounded border p-2.5 pl-7 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                    Chu kỳ
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full cursor-pointer rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                  >
                    {CY_PERIODS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                  />
                </div>
              </div>

              {/* Upload file */}
              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Tài liệu hợp đồng đính kèm (File) *
                </label>
                <input
                  ref={termsFileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setTermsFileName(f.name)
                  }}
                />
                <div
                  onClick={() => termsFileRef.current?.click()}
                  className={`flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                    termsFileName
                      ? '!border-[var(--color-primary-500)] !bg-[var(--color-primary-50)]'
                      : '!border-[var(--border-default)] !bg-[var(--bg-subtle)] hover:!border-[var(--color-primary-500)]'
                  }`}
                >
                  {termsFileName ? (
                    <>
                      <FileText
                        size={22}
                        weight="bold"
                        className="!text-[var(--color-primary-500)]"
                      />
                      <span className="mt-1 text-xs font-bold !text-[var(--color-primary-500)]">
                        {termsFileName}
                      </span>
                      <span className="text-[11px] !text-[var(--text-tertiary)]">
                        Nhấn để thay thế tài liệu
                      </span>
                    </>
                  ) : (
                    <>
                      <Paperclip size={22} className="!text-[var(--text-tertiary)]" />
                      <span className="mt-1 text-xs font-semibold !text-[var(--text-secondary)]">
                        Tải lên file hợp đồng đính kèm
                      </span>
                      <span className="text-[11px] !text-[var(--text-tertiary)]">
                        PDF, DOC, DOCX, TXT
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mời Freelancer */}
            <div className="p-5 sm:px-6">
              <h3 className="mb-1 text-sm font-bold !text-[var(--text-primary)]">Mời Freelancer</h3>
              <p className="mb-4 text-xs !text-[var(--text-secondary)]">
                Nhập email của freelancer để gửi lời mời tham gia hợp đồng này
              </p>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Email Freelancer *
                </label>
                <input
                  type="email"
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="freelancer@example.com"
                  className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Tin nhắn mời{' '}
                  <span className="font-normal !text-[var(--text-tertiary)]">(tuỳ chọn)</span>
                </label>
                <textarea
                  value={inviteMsg}
                  onChange={(e) => setInviteMsg(e.target.value)}
                  placeholder="Viết tin nhắn giới thiệu về dự án và lý do bạn muốn hợp tác..."
                  className="min-h-[80px] w-full resize-y rounded border p-2.5 text-sm leading-relaxed !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 p-5 sm:px-6 !bg-[var(--bg-subtle)]">
              <button
                type="button"
                onClick={onBack}
                className="cursor-pointer rounded-full border px-5 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] transition-colors hover:!bg-[var(--bg-base)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (canSubmit) {
                    onSubmit({
                      title,
                      value,
                      period,
                      startDate,
                      endDate,
                      role: activeRole,
                      freelancerEmail,
                      candidateName: initialCandidateName,
                      project: selectedProject,
                      termsFileName,
                    })
                  }
                }}
                disabled={!canSubmit}
                className="cursor-pointer rounded-full px-7 py-2 text-xs font-bold !text-white transition-colors !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:!bg-[rgba(0,0,0,0.12)] disabled:!text-[rgba(0,0,0,0.35)]"
              >
                Tạo & Gửi lời mời
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProjectModal(false)
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl !bg-[var(--bg-elevated)]">
            <div className="flex items-center justify-between border-b p-4 px-6 !border-[var(--border-subtle)]">
              <h4 className="text-base font-bold !text-[var(--text-primary)]">Chọn dự án</h4>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="cursor-pointer p-1 !text-[var(--text-tertiary)] hover:!text-[var(--text-primary)]"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto py-2">
              {projectNames.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setSelectedProject(name)
                    setShowProjectModal(false)
                  }}
                  className="flex cursor-pointer items-center justify-between px-6 py-3 transition-colors hover:!bg-[var(--color-primary-50)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                      <FolderPlus size={18} weight="bold" />
                    </div>
                    <span className="text-xs font-semibold !text-[var(--text-primary)]">
                      {name}
                    </span>
                  </div>
                  {selectedProject === name && (
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="!text-[var(--color-success-fg)]"
                    />
                  )}
                </div>
              ))}

              {projectNames.length === 0 && (
                <div className="px-6 py-8 text-center text-xs !text-[var(--text-tertiary)]">
                  Bạn chưa có dự án nào.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
