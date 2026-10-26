import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileTextIcon,
  UploadSimpleIcon,
  PaperclipIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PaperPlaneTiltIcon,
  TrashIcon,
  ArrowLeftIcon,
  ClockIcon,
  BuildingsIcon,
  SparkleIcon,
  BriefcaseMetalIcon,
} from '@phosphor-icons/react'
import { useProfile } from '@/features/profile'
import { toast } from '@/components/feedback'
import {
  SEED_CONTRACTS,
  INITIAL_CHAT_MESSAGES,
  SUGGESTED_PROMPTS,
  type ChatMessage,
} from './occupify-ai-mock-data'

export function JobRecommendationPage() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()

  // ─── CV Upload & Selection State ───
  const [selectedCvFile, setSelectedCvFile] = React.useState<{
    name: string
    size: string
    source: 'upload' | 'profile'
  } | null>(null)

  // Simulation switch for testing whether user has profile CV
  const [simulateNoProfileCv, setSimulateNoProfileCv] = React.useState(false)
  const [profileCvError, setProfileCvError] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // ─── Search & Results State ───
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(true) // Set true initially so seed data is immediately visible
  const [savedContractIds, setSavedContractIds] = React.useState<number[]>([101])
  const [contractFilter, setContractFilter] = React.useState<'all' | 'remote' | 'fixed' | 'hourly'>(
    'all',
  )

  // ─── AI Chat Box State ───
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES)
  const [chatInput, setChatInput] = React.useState('')
  const chatBottomRef = React.useRef<HTMLDivElement>(null)
  const messageIdRef = React.useRef(10)

  // Auto scroll chat
  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // ─── CV Handlers ───
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setSelectedCvFile({
        name: file.name,
        size: `${sizeMb} MB`,
        source: 'upload',
      })
      setProfileCvError(false)
      toast.success(`Đã đính kèm file CV: ${file.name}`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setSelectedCvFile({
        name: file.name,
        size: `${sizeMb} MB`,
        source: 'upload',
      })
      setProfileCvError(false)
      toast.success(`Đã đính kèm file CV: ${file.name}`)
    }
  }

  const handleUseProfileCv = () => {
    // If simulation toggle is on or profile doesn't have CV
    const hasProfileCv = !simulateNoProfileCv && Boolean(profile?.cvFileName)

    if (hasProfileCv && profile?.cvFileName) {
      setSelectedCvFile({
        name: profile.cvFileName,
        size: '2.4 MB',
        source: 'profile',
      })
      setProfileCvError(false)
      toast.success(`Đã tải CV từ hồ sơ cá nhân: ${profile.cvFileName}`)
    } else {
      setProfileCvError(true)
      setSelectedCvFile(null)
    }
  }

  const handleRemoveCv = () => {
    setSelectedCvFile(null)
    setProfileCvError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFindJobs = () => {
    if (!selectedCvFile) {
      toast.warning('Vui lòng tải file CV hoặc chọn "Dùng CV hiện tại" trước khi tìm việc.')
      return
    }

    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
      toast.success('Đã hoàn tất đối soát CV. 6 hợp đồng phù hợp nhất đã được đề xuất!')
    }, 450)
  }

  // ─── Bookmark Contract ───
  const handleToggleSaveContract = (contractId: number) => {
    setSavedContractIds((prev) =>
      prev.includes(contractId) ? prev.filter((id) => id !== contractId) : [...prev, contractId],
    )
    const isNowSaved = !savedContractIds.includes(contractId)
    toast.info(isNowSaved ? 'Đã lưu hợp đồng vào danh sách quan tâm' : 'Đã bỏ lưu hợp đồng')
  }

  // ─── Chat Handlers ───
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? chatInput).trim()
    if (!text) return

    const nextId = messageIdRef.current++
    const userMsg: ChatMessage = {
      id: `u-${nextId}`,
      sender: 'user',
      text,
      timestamp: 'Vừa xong',
    }

    setChatMessages((prev) => [...prev, userMsg])
    if (!textToSend) setChatInput('')

    // Simulate AI response & filtering
    setTimeout(() => {
      let replyText =
        'Tôi đã ghi nhận yêu cầu của bạn và đang cập nhật lại danh sách hợp đồng đề xuất phù hợp nhất.'
      const lower = text.toLowerCase()

      if (lower.includes('remote')) {
        setContractFilter('remote')
        replyText = 'Đã lọc các hợp đồng 100% làm việc từ xa (Remote) cho bạn.'
      } else if (lower.includes('giờ') || lower.includes('hourly')) {
        setContractFilter('hourly')
        replyText = 'Đã hiển thị các hợp đồng thanh toán theo giờ.'
      } else if (lower.includes('cố định') || lower.includes('trọn gói')) {
        setContractFilter('fixed')
        replyText = 'Đã hiển thị các hợp đồng theo gói cố định.'
      } else if (lower.includes('lương') || lower.includes('ngân sách') || lower.includes('tiền')) {
        replyText = 'Đã ưu tiên các hợp đồng có mức ngân sách cao từ 28.000.000 ₫ trở lên.'
      }

      const aiNextId = messageIdRef.current++
      const aiMsg: ChatMessage = {
        id: `ai-${aiNextId}`,
        sender: 'ai',
        text: replyText,
        timestamp: 'Vừa xong',
      }
      setChatMessages((prev) => [...prev, aiMsg])
    }, 500)
  }

  // Filtered Contracts
  const filteredContracts = React.useMemo(() => {
    return SEED_CONTRACTS.filter((item) => {
      if (contractFilter === 'remote') return item.workingMode === 'Remote'
      if (contractFilter === 'fixed') return item.salaryType === 'fixed'
      if (contractFilter === 'hourly') return item.salaryType === 'hourly'
      return true
    })
  }, [contractFilter])

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6">
      <div className="mx-auto max-w-[1128px] px-4 sm:px-6">
        {/* ─── Breadcrumb / Back button ─── */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/occupify-ai')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0A66C2] transition-colors cursor-pointer group"
          >
            <ArrowLeftIcon
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Quay lại Occupify AI</span>
          </button>
        </div>

        {/* ─── Page Title Header ─── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-sky-50 text-[#0A66C2] border border-sky-100 flex items-center justify-center shrink-0">
                <BriefcaseMetalIcon size={16} weight="bold" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Job recommendation
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              Đối soát hồ sơ CV với dữ liệu các dự án đang tuyển dụng và gợi ý hợp đồng có độ khớp
              cao nhất.
            </p>
          </div>
        </div>

        {/* ─── Main 2-Column Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ═══════════════════════════════════════════════════════
              CỘT TRÁI: KHUNG CV VÀ CHAT BOX (5 Cột)
             ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Card 1: Khung CV & Tải lên */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileTextIcon size={18} className="text-[#0A66C2]" weight="bold" />
                  <span>Hồ sơ năng lực (CV)</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Tải lên file CV hoặc dùng hồ sơ đã lưu để tìm kiếm hợp đồng phù hợp.
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Dropzone Area */}
              {!selectedCvFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#0A66C2] bg-sky-50/50'
                      : 'border-slate-300 hover:border-[#0A66C2] bg-slate-50/60 hover:bg-sky-50/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-[#0A66C2] flex items-center justify-center mx-auto mb-2.5 border border-sky-100">
                    <UploadSimpleIcon size={20} weight="bold" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    Kéo thả file CV vào đây, hoặc{' '}
                    <span className="text-[#0A66C2] underline">duyệt từ máy</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Định dạng hỗ trợ: PDF, DOCX, DOC (Tối đa 5MB)
                  </div>
                </div>
              ) : (
                /* Attached CV File Preview */
                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                      <FileTextIcon size={20} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {selectedCvFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{selectedCvFile.size}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">
                          {selectedCvFile.source === 'profile'
                            ? 'Lấy từ hồ sơ cá nhân'
                            : 'Tải lên từ máy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCv}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                    title="Gỡ bỏ CV này"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              )}

              {/* Secondary Action: "Dùng CV hiện tại" */}
              <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleUseProfileCv}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 hover:border-[#0A66C2] hover:bg-slate-50 text-slate-700 hover:text-[#0A66C2] text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <PaperclipIcon size={15} weight="bold" />
                    <span>Dùng CV hiện tại</span>
                  </button>

                  {/* Developer/Tester quick toggle for profile CV presence */}
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateNoProfileCv(!simulateNoProfileCv)
                      setProfileCvError(false)
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    title="Chuyển đổi trạng thái có/không có CV trong hồ sơ để kiểm thử"
                  >
                    {simulateNoProfileCv ? '[Mô phỏng: Chưa có CV]' : '[Mô phỏng: Đã có CV]'}
                  </button>
                </div>

                {/* Red error text if user has not uploaded CV in profile */}
                {profileCvError && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center justify-between gap-2">
                    <span>Bạn chưa upload CV trong profile.</span>
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="text-[11px] font-bold text-red-700 underline hover:text-red-800 cursor-pointer"
                    >
                      Đến trang Profile →
                    </button>
                  </div>
                )}
              </div>

              {/* Main Action: Button "Tìm việc" */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleFindJobs}
                  disabled={isSearching}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084fa0] active:bg-[#06407f] disabled:opacity-70 text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MagnifyingGlassIcon size={16} weight="bold" />
                  <span>{isSearching ? 'Đang phân tích và đối soát hợp đồng...' : 'Tìm việc'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Khung Chat Box Hỗ trợ AI */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">Trợ lý Occupify AI</span>
                </div>
                <span className="text-[11px] text-slate-400">Tự động gợi ý</span>
              </div>

              {/* Message History */}
              <div className="p-4 max-h-[260px] min-h-[180px] overflow-y-auto flex flex-col gap-3 text-xs">
                {chatMessages.map((msg) => {
                  const isAi = msg.sender === 'ai'
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end justify-end'}`}
                    >
                      {isAi && (
                        <div className="w-6 h-6 rounded-md bg-sky-50 text-[#0A66C2] flex items-center justify-center shrink-0 border border-sky-100 mt-0.5">
                          <SparkleIcon size={13} weight="fill" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                          isAi
                            ? 'bg-slate-50 border border-slate-200/80 text-slate-700'
                            : 'bg-[#0A66C2] text-white font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggested Prompts Strip */}
              <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#0A66C2] transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="p-3 border-t border-slate-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập yêu cầu thêm về hợp đồng mong muốn..."
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-sky-200"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg bg-[#0A66C2] hover:bg-[#084fa0] disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
                  title="Gửi tin nhắn"
                >
                  <PaperPlaneTiltIcon size={15} weight="bold" />
                </button>
              </form>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              CỘT PHẢI: DANH SÁCH CÁC HỢP ĐỒNG PHÙ HỢP (7 Cột)
             ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Toolbar & Filter Strip */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  Danh sách Hợp đồng Đề xuất
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {filteredContracts.length} hợp đồng phù hợp dựa trên phân tích hồ sơ năng lực
                </div>
              </div>
            </div>

            {/* Notice if CV is not selected yet */}
            {!selectedCvFile && !hasSearched && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <strong>Gợi ý:</strong> Chọn CV ở cột bên trái và bấm <strong>Tìm việc</strong> để
                AI so khớp chính xác các kỹ năng trong CV với yêu cầu từng hợp đồng.
              </div>
            )}

            {/* Contract Cards List */}
            <div className="flex flex-col gap-3.5">
              {filteredContracts.map((contract) => {
                const isSaved = savedContractIds.includes(contract.id)

                return (
                  <article
                    key={contract.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all p-5"
                  >
                    {/* Main Title & Client Details */}
                    <div className="mb-2">
                      <h3
                        onClick={() => navigate(`/home?jobId=${contract.id}`)}
                        className="text-base font-bold text-slate-900 hover:text-[#0A66C2] transition-colors cursor-pointer"
                      >
                        {contract.roleTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-800 inline-flex items-center gap-1">
                          <BuildingsIcon size={14} />
                          <span>{contract.clientName}</span>
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon size={14} />
                          <span>{contract.duration}</span>
                        </span>
                        <span>·</span>
                        <span className="text-slate-400">{contract.postedAgo}</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {contract.description}
                    </p>

                    {/* Required Skills */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                      {[...contract.matchedSkills, ...contract.otherSkills].map((skill) => (
                        <span
                          key={skill}
                          className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-semibold border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row: Budget & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {contract.salaryTypeLabel}
                        </div>
                        <div className="text-base font-extrabold text-slate-900">
                          {contract.budget}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Bookmark */}
                        <button
                          type="button"
                          onClick={() => handleToggleSaveContract(contract.id)}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-sky-50 border-sky-200 text-[#0A66C2]'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                          }`}
                          title={isSaved ? 'Bỏ lưu hợp đồng' : 'Lưu hợp đồng'}
                        >
                          <BookmarkIcon size={15} weight={isSaved ? 'fill' : 'regular'} />
                        </button>

                        {/* View details */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/jobs/${contract.id}?roleTitle=${encodeURIComponent(contract.roleTitle)}`,
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobRecommendationPage
