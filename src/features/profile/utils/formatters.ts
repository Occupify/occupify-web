/**
 * Format string dates into ISO YYYY-MM-DD for backend compatibility.
 */
export function formatDateForBackend(dateStr?: string): string {
  if (!dateStr || dateStr.toLowerCase().includes('hiện tại')) {
    return new Date().toISOString().split('T')[0]
  }
  const clean = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean
  if (/^\d{2}\/\d{4}$/.test(clean)) {
    const [month, year] = clean.split('/')
    return `${year}-${month.padStart(2, '0')}-01`
  }
  if (/^\d{4}$/.test(clean)) {
    return `${clean}-01-01`
  }
  return new Date().toISOString().split('T')[0]
}

/**
 * Generates fallback email from a given user full name.
 */
export function nameToGmail(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/\s+/g, '') + '@gmail.com'
  )
}

/**
 * Maps Vietnamese or UI employment type options to backend EmploymentType enum.
 */
export function toBackendEmploymentType(type?: string): string {
  if (!type) return 'FULL_TIME'
  const val = type.toLowerCase()
  if (val.includes('freelance') || val.includes('tự do')) return 'FREELANCE'
  if (val.includes('contract') || val.includes('hợp đồng')) return 'CONTRACT'
  if (val.includes('bán thời gian') || val.includes('part')) return 'PART_TIME'
  if (val.includes('khởi nghiệp') || val.includes('self')) return 'SELF_EMPLOYED'
  if (val.includes('thực tập') || val.includes('intern')) return 'INTERNSHIP'
  return 'FULL_TIME'
}

/**
 * Maps backend EmploymentType enum to human-friendly display label.
 */
export function fromBackendEmploymentType(type?: string): string {
  if (!type) return 'Toàn thời gian'
  switch (type.toUpperCase()) {
    case 'FULL_TIME':
      return 'Toàn thời gian'
    case 'PART_TIME':
      return 'Bán thời gian'
    case 'FREELANCE':
      return 'Freelance / Tự do'
    case 'CONTRACT':
      return 'Hợp đồng dự án'
    case 'SELF_EMPLOYED':
      return 'Tự do / Khởi nghiệp'
    case 'INTERNSHIP':
      return 'Thực tập sinh'
    default:
      return type
  }
}

