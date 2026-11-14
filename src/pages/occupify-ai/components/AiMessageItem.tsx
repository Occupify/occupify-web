import * as React from 'react'
import {
  SparkleIcon,
  CopyIcon,
  CheckIcon,
  FileTextIcon,
  ArrowsClockwiseIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  UserIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react'
import { AI_AGENTIC_BASE_URL, type AiChatMessage } from '@/features/occupify-ai'

interface AiMessageItemProps {
  message: AiChatMessage
  onRegenerate?: () => void
}

export function AiMessageItem({ message, onRegenerate }: AiMessageItemProps) {
  const isAi = message.sender === 'ai'
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Formatting helper for markdown-like text (headings, bold, list items, paragraphs)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />
      }

      // Headings
      if (line.trim().startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm mt-3 mb-1">
            {renderInlineFormatted(line.trim().slice(4))}
          </h4>
        )
      }
      if (line.trim().startsWith('## ')) {
        return (
          <h3
            key={idx}
            className="font-bold text-slate-900 text-sm sm:text-base mt-3.5 mb-1.5 border-b border-slate-100 pb-1"
          >
            {renderInlineFormatted(line.trim().slice(3))}
          </h3>
        )
      }

      // Bullet line
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const text = line.trim().replace(/^[*|-]\s+/, '')
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1">
            <span className="text-[var(--color-primary-500)] text-sm leading-none mt-1">●</span>
            <span className="flex-1 leading-relaxed">{renderInlineFormatted(text)}</span>
          </div>
        )
      }

      // Numbered list
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/)
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1.5">
            <span className="font-bold text-[var(--color-primary-500)] text-xs min-w-[16px]">
              {numMatch[1]}.
            </span>
            <span className="flex-1 leading-relaxed">{renderInlineFormatted(numMatch[2])}</span>
          </div>
        )
      }

      return (
        <p key={idx} className="leading-relaxed my-1">
          {renderInlineFormatted(line)}
        </p>
      )
    })
  }

  const resolveUrl = (rawUrl: string): string => {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl
    }
    const baseUrl = (AI_AGENTIC_BASE_URL || '').replace(/\/+$/, '')
    const path = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
    return `${baseUrl}${path}`
  }

  // Parse markdown links [label](url), **bold**, *italic*, and `code`
  const renderInlineFormatted = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (!part) return null

      // Markdown Link: [label](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const [, label, rawUrl] = linkMatch
        const resolvedUrl = resolveUrl(rawUrl)
        const isDownload =
          rawUrl.includes('/download/') || /\.(pdf|tex|docx?|zip|png|jpe?g)$/i.test(rawUrl)

        return (
          <a
            key={i}
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={isDownload ? true : undefined}
            className={
              isDownload
                ? 'inline-flex items-center gap-1.5 font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-200)] px-2.5 py-0.5 rounded-md text-xs transition-colors my-0.5 align-middle cursor-pointer'
                : 'font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline underline-offset-2 transition-colors cursor-pointer'
            }
          >
            {isDownload && <DownloadSimpleIcon size={13} weight="bold" className="shrink-0" />}
            <span>{label}</span>
          </a>
        )
      }

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        )
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-700">
            {part.slice(1, -1)}
          </em>
        )
      }

      // Inline code: `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-mono"
          >
            {part.slice(1, -1)}
          </code>
        )
      }

      return part
    })
  }

  return (
    <div
      className={`group flex gap-3.5 py-3 transition-colors ${
        isAi ? 'items-start' : 'items-start flex-row-reverse'
      }`}
    >
      {/* ─── Avatar ─── */}
      <div className="shrink-0 mt-0.5">
        {isAi ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-primary-400)] text-white flex items-center justify-center shadow-xs">
            <SparkleIcon size={16} weight="fill" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs">
            <UserIcon size={16} weight="bold" />
          </div>
        )}
      </div>

      {/* ─── Bubble & Content ─── */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isAi ? '' : 'items-end'}`}>
        {/* Name & Time */}
        <div
          className={`flex items-center gap-2 mb-1 text-[11px] text-slate-400 ${
            isAi ? '' : 'flex-row-reverse'
          }`}
        >
          <span className="font-semibold text-slate-700">{isAi ? 'Occupify AI' : 'Bạn'}</span>
          <span>·</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Attachment Card (if present) */}
        {message.attachment && (
          <div className="mb-2 p-2.5 rounded-xl border border-sky-100 bg-sky-50/80 flex items-center gap-2.5 max-w-sm">
            <div className="w-8 h-8 rounded-lg bg-white border border-sky-200 text-[var(--color-primary-500)] flex items-center justify-center shrink-0">
              <FileTextIcon size={18} weight="bold" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {message.attachment.name}
              </div>
              <div className="text-[10px] text-slate-500">
                {message.attachment.size ? `${message.attachment.size} · ` : ''}Đã đính kèm
              </div>
            </div>
          </div>
        )}

        {/* Message Body */}
        <div
          className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
            isAi
              ? message.error
                ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-sm'
                : 'bg-white border border-[var(--border-default)] text-slate-800 rounded-tl-sm'
              : 'bg-[var(--color-primary-500)] text-white font-medium rounded-tr-sm'
          }`}
        >
          {isAi ? (
            <>
              {renderFormattedContent(message.content)}
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-[var(--color-primary-500)] animate-pulse align-middle" />
              )}
            </>
          ) : (
            message.content
          )}
        </div>

        {/* ─── Bottom Actions for AI Messages ─── */}
        {isAi && !message.isStreaming && !message.error && (
          <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Sao chép nội dung"
            >
              {copied ? (
                <>
                  <CheckIcon size={13} weight="bold" className="text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Đã chép</span>
                </>
              ) : (
                <CopyIcon size={13} />
              )}
            </button>

            {/* Regenerate button */}
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Tạo lại phản hồi"
              >
                <ArrowsClockwiseIcon size={13} />
              </button>
            )}

            {/* Feedback thumbs */}
            <button
              type="button"
              onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
              className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                feedback === 'like' ? 'text-[var(--color-primary-500)]' : 'hover:text-slate-700'
              }`}
              title="Phản hồi hữu ích"
            >
              <ThumbsUpIcon size={13} weight={feedback === 'like' ? 'fill' : 'regular'} />
            </button>
            <button
              type="button"
              onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
              className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                feedback === 'dislike' ? 'text-red-500' : 'hover:text-slate-700'
              }`}
              title="Phản hồi chưa phù hợp"
            >
              <ThumbsDownIcon size={13} weight={feedback === 'dislike' ? 'fill' : 'regular'} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
