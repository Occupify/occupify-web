import { useNavigate } from 'react-router-dom'
import {
  FileTextIcon,
  CompassIcon,
  UsersIcon,
  BriefcaseMetalIcon,
  FolderPlusIcon,
  ArrowRightIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { AI_FEATURES, type AiFeatureItem } from './occupify-ai-constants'

export function OccupifyAiPage() {
  const navigate = useNavigate()

  const renderIcon = (iconKey: string) => {
    const props = {
      size: 24,
      weight: 'fill' as const,
      className: 'text-[#0A66C2]',
    }
    switch (iconKey) {
      case 'file-text':
        return <FileTextIcon {...props} />
      case 'compass':
        return <CompassIcon {...props} />
      case 'users':
        return <UsersIcon {...props} />
      case 'briefcase':
        return <BriefcaseMetalIcon {...props} />
      case 'folder-plus':
        return <FolderPlusIcon {...props} />
      default:
        return <SparkleIcon {...props} />
    }
  }

  const handleNavigate = (feature: AiFeatureItem) => {
    navigate(feature.route)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-8">
      <div className="mx-auto max-w-[1128px] px-4 sm:px-6">
        {/* ─── Header Section ─── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0A66C2] border border-sky-200 mb-3 shadow-2xs">
            <SparkleIcon size={14} weight="fill" />
            <span>Occupify AI Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Occupify AI
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Chọn một trong các công cụ trí tuệ nhân tạo dưới đây để bắt đầu trải nghiệm và tối ưu
            hóa quy trình của bạn.
          </p>
        </div>

        {/* ─── 5 Navigation Buttons / Feature Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {AI_FEATURES.map((feature, index) => {
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => handleNavigate(feature)}
                className={`group relative text-left rounded-2xl p-6 bg-white border border-slate-200 hover:border-[#084fa0] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  index === 3 || index === 4 ? 'md:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-sky-100/70 transition-all">
                      {renderIcon(feature.iconKey)}
                    </div>
                  </div>

                  {/* Feature Title */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#084fa0] transition-colors mb-1.5 flex items-center gap-2">
                    <span>{feature.title}</span>
                  </h2>

                  {/* Feature Subtitle */}
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    {feature.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A66C2] group-hover:text-[#084fa0] transition-colors">
                  <span>Truy cập tính năng</span>
                  <div className="w-7 h-7 rounded-full bg-sky-50 group-hover:bg-[#084fa0] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRightIcon
                      size={13}
                      weight="bold"
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OccupifyAiPage
