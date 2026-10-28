import { useMutation } from '@tanstack/react-query'
import { reportProfileApi } from '../api'
import type { ReportProfilePayload } from '../types'

export function useReportProfile() {
  return useMutation({
    mutationFn: (payload: ReportProfilePayload) => reportProfileApi(payload),
  })
}
