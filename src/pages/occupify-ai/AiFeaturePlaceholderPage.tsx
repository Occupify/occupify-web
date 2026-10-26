import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  BriefcaseMetalIcon,
  CompassIcon,
  FileTextIcon,
  FolderPlusIcon,
  SparkleIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { AI_FEATURES } from './occupify-ai-constants'

export function AiFeaturePlaceholderPage() {
  const navigate = useNavigate()
  const { featureId } = useParams<{ featureId: string }>()

  const currentFeature =
    AI_FEATURES.find((f) => f.id === featureId) ?? {
      id: 'improve-cv',
      title: 'Occupify AI Feature',
      subtitle: 'Tính năng trí tuệ nhân tạo',
      description: 'Công cụ hỗ trợ tối ưu hóa quy trình làm việc và phát triển sự nghiệp.',
      iconKey: 'file-text' as const,
      route: '/occupify-ai',
      isAvailable: false,
    }

  const renderIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'file-text':
        return <FileTextIcon size={28} weight="fill" />
      case 'compass':
        return <CompassIcon size={28} weight="fill" />
      case 'users':
        return <UsersIcon size={28} weight="fill" />
      case 'folder-plus':
        return <FolderPlusIcon size={28} weight="fill" />
      default:
        return <SparkleIcon size={28} weight="fill" />
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6">
      <div className="mx-auto max-w-[1128px] px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/occupify-ai')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0A66C2] transition-colors cursor-pointer group"
          >
            <ArrowLeftIcon size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Quay lại Occupify AI</span>
          </button>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-14 text-center shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0A66C2] border border-sky-100 mx-auto flex items-center justify-center mb-5">
            {renderIcon(currentFeature.iconKey)}
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            Tính năng đang được phát triển (Coming Soon)
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            {currentFeature.title}
          </h1>

          <p className="text-sm font-semibold text-[#0A66C2] mb-3">
            {currentFeature.subtitle}
          </p>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
            {currentFeature.description} Đội ngũ kỹ sư Occupify đang hoàn thiện mô hình và sẽ cập nhật sớm trong phiên bản tới.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/occupify-ai/job-recommendation')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#084fa0] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <BriefcaseMetalIcon size={16} weight="bold" />
              <span>Khám phá Job recommendation</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/occupify-ai')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Xem tất cả công cụ AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiFeaturePlaceholderPage
