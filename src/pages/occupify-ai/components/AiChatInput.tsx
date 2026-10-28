import * as React from 'react'
import { PaperPlaneTiltIcon, PaperclipIcon, XIcon, FileTextIcon } from '@phosphor-icons/react'
import { QUICK_SUGGESTION_PILLS } from '../occupify-ai-mock-data'

interface AiChatInputProps {
  onSendMessage: (
    content: string,
    file?: File | null,
    attachment?: { name: string; size: string; type?: string },
  ) => void
  disabled?: boolean
  initialPrompt?: string
}

export function AiChatInput({
  onSendMessage,
  disabled = false,
  initialPrompt = '',
}: AiChatInputProps) {
  const [text, setText] = React.useState(initialPrompt)
  const [selectedFile, setSelectedFile] = React.useState<{
    file: File
    name: string
    size: string
    type?: string
  } | null>(null)

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [text])

  const handleSend = () => {
    if ((!text.trim() && !selectedFile) || disabled) return
    onSendMessage(
      text.trim(),
      selectedFile?.file || null,
      selectedFile
        ? { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type }
        : undefined,
    )
    setText('')
    setSelectedFile(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    setSelectedFile({
      file,
      name: file.name,
      size: formatSize(file.size),
      type: file.type,
    })
    // Reset file input value so user can re-select same file if needed
    e.target.value = ''
  }

  const handleSelectQuickPill = (pill: string) => {
    setText((prev) => (prev ? `${prev} - ${pill}` : pill))
    textareaRef.current?.focus()
  }

  const canSend = (text.trim().length > 0 || selectedFile !== null) && !disabled

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* ─── Quick Suggestion Chips ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Gợi ý:</span>
        {QUICK_SUGGESTION_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => handleSelectQuickPill(pill)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-[var(--border-default)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-slate-600 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* ─── Attachment Chip (if file selected) ─── */}
      {selectedFile && (
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-800 shadow-2xs">
          <FileTextIcon size={16} weight="bold" className="text-[var(--color-primary-500)]" />
          <span className="font-semibold truncate max-w-xs">{selectedFile.name}</span>
          <span className="text-[10px] text-slate-500">({selectedFile.size})</span>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="p-0.5 rounded-full hover:bg-sky-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Gỡ bỏ tệp"
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* ─── Main Input Container ─── */}
      <div className="relative rounded-2xl bg-white border border-[var(--border-default)] focus-within:border-[var(--color-primary-500)] focus-within:ring-2 focus-within:ring-[var(--color-primary-50)] shadow-xs transition-all flex flex-col p-2">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhắn tin cho Occupify AI... (Nhấn Enter để gửi, Shift+Enter để xuống dòng)"
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none min-h-[44px] max-h-[160px]"
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          {/* File attach button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-[var(--color-primary-500)] hover:bg-sky-50 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Đính kèm CV hoặc tài liệu (PDF tối đa 10MB)"
            >
              <PaperclipIcon size={17} weight="bold" />
              <span className="hidden sm:inline text-[11px] font-medium text-slate-500">
                Đính kèm PDF
              </span>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              canSend
                ? 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] text-white shadow-2xs hover:scale-105'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title="Gửi tin nhắn"
          >
            <PaperPlaneTiltIcon size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* ─── Disclaimer ─── */}
      <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-2 leading-relaxed">
        Occupify AI có thể đưa ra kết quả tham khảo. Hãy luôn xác thực lại các thỏa thuận và điều
        khoản hợp đồng thực tế.
      </p>
    </div>
  )
}
