import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from '@/components/feedback'
import {
  useProfile,
  useReportProfile,
  useUploadCv,
  useUpdateBasicInfo,
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  useAddCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
  useAddProject,
  useUpdateProject,
  useDeleteProject,
  useAddSkill,
  useUpdateSkill,
  useDeleteSkill,
  ProfileHeaderCard,
  ProfileIntroCard,
  ProfileCvCard,
  ProfileExperienceCard,
  ProfileSkillsCard,
  ProfileEducationCard,
  ProfileCertificatesCard,
  ProfileReviewsCard,
  ProfileProjectsCard,
  ReportProfileModal,
  EditBasicInfoModal,
  EditExperienceModal,
  EditSkillModal,
  EditEducationModal,
  EditCertificateModal,
  EditProjectModal,
  type ProfileExperience,
  type ProfileEducation,
  type ProfileCertificate,
  type ProfileProject,
  type ProfileSkill,
  type ExperienceFormData,
  type EducationFormData,
  type CertificateFormData,
  type ProjectFormData,
  type SkillFormData,
  type UpdateBasicInfoPayload,
} from '@/features/profile'

export interface ProfilePageProps {
  userName?: string
  isOwnProfile?: boolean
}

export function ProfilePage({
  userName: propUserName,
  isOwnProfile: propIsOwnProfile,
}: ProfilePageProps) {
  const [searchParams] = useSearchParams()

  const paramName = searchParams.get('name')
  const targetUserName = propUserName ?? paramName ?? undefined

  const isOwnProfile =
    propIsOwnProfile ?? (!targetUserName || targetUserName === 'Nguyễn Minh Khoa')

  const { data: profile, isLoading } = useProfile(targetUserName)

  // Mutations
  const reportMutation = useReportProfile()
  const uploadCvMutation = useUploadCv()
  const updateBasicInfoMutation = useUpdateBasicInfo()
  const addExpMutation = useAddExperience()
  const updateExpMutation = useUpdateExperience()
  const deleteExpMutation = useDeleteExperience()
  const addEduMutation = useAddEducation()
  const updateEduMutation = useUpdateEducation()
  const deleteEduMutation = useDeleteEducation()
  const addCertMutation = useAddCertificate()
  const updateCertMutation = useUpdateCertificate()
  const deleteCertMutation = useDeleteCertificate()
  const addProjMutation = useAddProject()
  const updateProjMutation = useUpdateProject()
  const deleteProjMutation = useDeleteProject()
  const addSkillMutation = useAddSkill()
  const updateSkillMutation = useUpdateSkill()
  const deleteSkillMutation = useDeleteSkill()

  // Modal dialog states
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [editBasicInfoOpen, setEditBasicInfoOpen] = React.useState(false)
  const [experienceModal, setExperienceModal] = React.useState<{
    open: boolean
    item?: ProfileExperience | null
  }>({ open: false, item: null })
  const [skillModal, setSkillModal] = React.useState<{
    open: boolean
    item?: ProfileSkill | null
  }>({ open: false, item: null })
  const [educationModal, setEducationModal] = React.useState<{
    open: boolean
    index?: number
    item?: ProfileEducation | null
  }>({ open: false, index: undefined, item: null })
  const [certificateModal, setCertificateModal] = React.useState<{
    open: boolean
    index?: number
    item?: ProfileCertificate | null
  }>({ open: false, index: undefined, item: null })
  const [projectModal, setProjectModal] = React.useState<{
    open: boolean
    item?: ProfileProject | null
  }>({ open: false, item: null })

  // Basic Info Handlers
  const handleUpdateBasicInfo = async (data: UpdateBasicInfoPayload) => {
    try {
      await updateBasicInfoMutation.mutateAsync(data)
      setEditBasicInfoOpen(false)
      toast.success('Đã cập nhật thông tin cá nhân thành công!')
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân.')
    }
  }

  // Experience Handlers
  const handleSaveExperience = async (data: ExperienceFormData) => {
    try {
      if (experienceModal.item) {
        await updateExpMutation.mutateAsync({
          id: experienceModal.item.id,
          data,
        })
        toast.success('Đã cập nhật kinh nghiệm làm việc!')
      } else {
        await addExpMutation.mutateAsync(data)
        toast.success('Đã thêm kinh nghiệm làm việc mới!')
      }
      setExperienceModal({ open: false, item: null })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu kinh nghiệm.')
    }
  }

  const handleDeleteExperience = async (id: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục kinh nghiệm này?')) return
    try {
      await deleteExpMutation.mutateAsync(id)
      toast.info('Đã xóa mục kinh nghiệm làm việc.')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa kinh nghiệm.')
    }
  }

  // Skill Handlers
  const handleSaveSkill = async (data: SkillFormData) => {
    try {
      if (skillModal.item) {
        await updateSkillMutation.mutateAsync({
          id: skillModal.item.id,
          data,
        })
        toast.success('Đã cập nhật kỹ năng chuyên môn thành công!')
      } else {
        await addSkillMutation.mutateAsync(data)
        toast.success('Đã thêm kỹ năng chuyên môn mới!')
      }
      setSkillModal({ open: false, item: null })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu kỹ năng.')
    }
  }

  const handleDeleteSkill = async (id: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kỹ năng này khỏi hồ sơ?')) return
    try {
      await deleteSkillMutation.mutateAsync(id)
      toast.info('Đã xóa kỹ năng.')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa kỹ năng.')
    }
  }

  // Education Handlers
  const handleSaveEducation = async (data: EducationFormData) => {
    try {
      if (educationModal.index !== undefined) {
        await updateEduMutation.mutateAsync({
          index: educationModal.index,
          data,
        })
        toast.success('Đã cập nhật thông tin học vấn!')
      } else {
        await addEduMutation.mutateAsync(data)
        toast.success('Đã thêm thông tin học vấn mới!')
      }
      setEducationModal({ open: false, index: undefined, item: null })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu học vấn.')
    }
  }

  const handleDeleteEducation = async (index: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục học vấn này?')) return
    try {
      await deleteEduMutation.mutateAsync(index)
      toast.info('Đã xóa mục học vấn.')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa học vấn.')
    }
  }

  // Certificate Handlers
  const handleSaveCertificate = async (data: CertificateFormData) => {
    try {
      if (certificateModal.index !== undefined) {
        await updateCertMutation.mutateAsync({
          index: certificateModal.index,
          data,
        })
        toast.success('Đã cập nhật chứng chỉ chuyên môn!')
      } else {
        await addCertMutation.mutateAsync(data)
        toast.success('Đã thêm chứng chỉ chuyên môn mới!')
      }
      setCertificateModal({ open: false, index: undefined, item: null })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu chứng chỉ.')
    }
  }

  const handleDeleteCertificate = async (index: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) return
    try {
      await deleteCertMutation.mutateAsync(index)
      toast.info('Đã xóa chứng chỉ chuyên môn.')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa chứng chỉ.')
    }
  }

  // Project Handlers
  const handleSaveProject = async (data: ProjectFormData) => {
    try {
      if (projectModal.item) {
        await updateProjMutation.mutateAsync({
          id: projectModal.item.id,
          data,
        })
        toast.success('Đã cập nhật dự án thành công!')
      } else {
        await addProjMutation.mutateAsync(data)
        toast.success('Đã thêm dự án thực tế mới!')
      }
      setProjectModal({ open: false, item: null })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu dự án.')
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này khỏi hồ sơ?')) return
    try {
      await deleteProjMutation.mutateAsync(id)
      toast.info('Đã xóa dự án khỏi hồ sơ.')
    } catch {
      toast.error('Có lỗi xảy ra khi xóa dự án.')
    }
  }

  // Report & CV Handlers
  const handleReportSubmit = async (reason: string, imageFileName?: string) => {
    if (!profile) return
    try {
      const res = await reportMutation.mutateAsync({
        reportedUserName: profile.name,
        reason,
        imageFileName,
      })
      setReportModalOpen(false)
      toast.success(res.message)
    } catch {
      toast.error('Có lỗi xảy ra khi gửi báo cáo người dùng.')
    }
  }

  const handleUploadCv = async (file: File) => {
    try {
      const res = await uploadCvMutation.mutateAsync(file)
      toast.success(`Đã tải lên tệp CV "${res.fileName}" thành công!`)
    } catch {
      toast.error('Có lỗi xảy ra khi tải lên tệp CV.')
    }
  }

  if (isLoading || !profile) {
    return (
      <div style={{ background: '#F4F2EE', minHeight: '100vh', padding: '40px 16px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div
            style={{
              height: 220,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid var(--border-default)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Đang tải dữ liệu hồ sơ...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#F4F2EE',
        minHeight: '100vh',
        padding: '24px 16px 48px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* 1. Header Card (Avatar, Verified, Cover, Headline, Email, Stats) */}
        <ProfileHeaderCard
          profile={profile}
          isOwnProfile={isOwnProfile}
          onReportClick={() => setReportModalOpen(true)}
          onEditClick={() => setEditBasicInfoOpen(true)}
        />

        {/* 2. Giới thiệu (Bio / Intro) */}
        <ProfileIntroCard
          intro={profile.intro}
          isOwnProfile={isOwnProfile}
          onEditClick={() => setEditBasicInfoOpen(true)}
        />

        {/* 3. CV & Năng lực */}
        <ProfileCvCard
          isOwnProfile={isOwnProfile}
          cvFileName={profile.cvFileName}
          cvUrl={profile.cvUrl}
          userName={profile.name}
          onUploadCv={handleUploadCv}
        />

        {/* 4. Kinh nghiệm làm việc (LinkedIn Style) */}
        <ProfileExperienceCard
          experiences={profile.experiences}
          isOwnProfile={isOwnProfile}
          onAddClick={() => setExperienceModal({ open: true, item: null })}
          onEditClick={(exp) => setExperienceModal({ open: true, item: exp })}
          onDeleteClick={handleDeleteExperience}
        />

        {/* 5. Kỹ năng chuyên môn */}
        <ProfileSkillsCard
          skills={profile.skills || []}
          isOwnProfile={isOwnProfile}
          onAddClick={() => setSkillModal({ open: true, item: null })}
          onEditClick={(skill) => setSkillModal({ open: true, item: skill })}
          onDeleteClick={handleDeleteSkill}
        />

        {/* 6. Học vấn */}
        <ProfileEducationCard
          education={profile.education}
          isOwnProfile={isOwnProfile}
          onAddClick={() => setEducationModal({ open: true, index: undefined, item: null })}
          onEditClick={(idx, item) => setEducationModal({ open: true, index: idx, item })}
          onDeleteClick={handleDeleteEducation}
        />

        {/* 6. Bằng cấp & Chứng chỉ */}
        <ProfileCertificatesCard
          certificates={profile.certificates}
          isOwnProfile={isOwnProfile}
          onAddClick={() => setCertificateModal({ open: true, index: undefined, item: null })}
          onEditClick={(idx, item) => setCertificateModal({ open: true, index: idx, item })}
          onDeleteClick={handleDeleteCertificate}
        />

        {/* 7. Đánh giá & Phản hồi (Sanitized non-sensitive information) */}
        <ProfileReviewsCard reviews={profile.reviews} />

        {/* 8. Danh sách các dự án đã tham gia */}
        <ProfileProjectsCard
          projects={profile.projects}
          isOwnProfile={isOwnProfile}
          onAddClick={() => setProjectModal({ open: true, item: null })}
          onEditClick={(item) => setProjectModal({ open: true, item })}
          onDeleteClick={handleDeleteProject}
        />

        {/* ─── Modals ─── */}
        {/* Report Modal */}
        <ReportProfileModal
          isOpen={reportModalOpen}
          reportedUserName={profile.name}
          onClose={() => setReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          isSubmitting={reportMutation.isPending}
        />

        {/* Edit Basic Information Modal */}
        <EditBasicInfoModal
          isOpen={editBasicInfoOpen}
          initialData={{
            name: profile.name,
            headline: profile.headline,
            location: profile.location,
            intro: profile.intro,
          }}
          onClose={() => setEditBasicInfoOpen(false)}
          onSubmit={handleUpdateBasicInfo}
          isSubmitting={updateBasicInfoMutation.isPending}
        />

        {/* Add/Edit Experience Modal */}
        <EditExperienceModal
          isOpen={experienceModal.open}
          experienceToEdit={experienceModal.item}
          onClose={() => setExperienceModal({ open: false, item: null })}
          onSubmit={handleSaveExperience}
          isSubmitting={addExpMutation.isPending || updateExpMutation.isPending}
        />

        {/* Add/Edit Skill Modal */}
        <EditSkillModal
          isOpen={skillModal.open}
          skillToEdit={skillModal.item}
          onClose={() => setSkillModal({ open: false, item: null })}
          onSubmit={handleSaveSkill}
          isSubmitting={addSkillMutation.isPending || updateSkillMutation.isPending}
        />

        {/* Add/Edit Education Modal */}
        <EditEducationModal
          isOpen={educationModal.open}
          educationToEdit={educationModal.item}
          onClose={() => setEducationModal({ open: false, index: undefined, item: null })}
          onSubmit={handleSaveEducation}
          isSubmitting={addEduMutation.isPending || updateEduMutation.isPending}
        />

        {/* Add/Edit Certificate Modal */}
        <EditCertificateModal
          isOpen={certificateModal.open}
          certificateToEdit={certificateModal.item}
          onClose={() => setCertificateModal({ open: false, index: undefined, item: null })}
          onSubmit={handleSaveCertificate}
          isSubmitting={addCertMutation.isPending || updateCertMutation.isPending}
        />

        {/* Add/Edit Project Modal */}
        <EditProjectModal
          isOpen={projectModal.open}
          projectToEdit={projectModal.item}
          onClose={() => setProjectModal({ open: false, item: null })}
          onSubmit={handleSaveProject}
          isSubmitting={addProjMutation.isPending || updateProjMutation.isPending}
        />
      </div>
    </div>
  )
}

export default ProfilePage
