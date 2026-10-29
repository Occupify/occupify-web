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

