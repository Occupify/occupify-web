import * as React from 'react'
import { Modal, Button, Input } from '@/components/ui'
import { toast } from '@/components/feedback'
import type { MyProject, UpdateProjectPayload } from '../types'

export interface EditProjectModalProps {
  open: boolean
  onClose: () => void
  project: MyProject
  onSave: (payload: UpdateProjectPayload) => Promise<void> | void
}

interface EditProjectFormProps {
  project: MyProject
  onClose: () => void
  onSave: (payload: UpdateProjectPayload) => Promise<void> | void
}

function EditProjectForm({ project, onClose, onSave }: EditProjectFormProps) {
  const [title, setTitle] = React.useState(project.name || '')
  const [description, setDescription] = React.useState(project.description || '')
  const [dueDate, setDueDate] = React.useState(project.dueDate || '')
  const [bidCloseDate, setBidCloseDate] = React.useState(project.bidCloseDate || '')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên dự án')
      return
    }

    if (bidCloseDate && dueDate && bidCloseDate > dueDate) {
      toast.error('Hạn chót ứng tuyển không được sau ngày hoàn thành dự kiến (Due date)')
      return
    }

    const payload: UpdateProjectPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      bidCloseDate: bidCloseDate || undefined,
    }

    try {
      setIsSaving(true)
      await onSave(payload)
      onClose()
    } catch {
      // Handled by parent or toast
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Header>Chỉnh sửa thông tin dự án</Modal.Header>
      <Modal.Body className="space-y-4">
        <div>
          <Input
            label="Tên dự án"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên dự án..."
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[rgba(0,0,0,0.90)]">
            Mô tả chi tiết
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Mô tả phạm vi và yêu cầu dự án..."
            className="w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--color-primary-500)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Thời gian hoàn thành dự án (Due date)"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Hạn chót ứng tuyển (Bid close date)"
              type="date"
              value={bidCloseDate}
              onChange={(e) => setBidCloseDate(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={isSaving}>
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </form>
  )
}

export function EditProjectModal({ open, onClose, project, onSave }: EditProjectModalProps) {
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content maxWidth="lg">
        <EditProjectForm project={project} onClose={onClose} onSave={onSave} />
      </Modal.Content>
    </Modal>
  )
}
