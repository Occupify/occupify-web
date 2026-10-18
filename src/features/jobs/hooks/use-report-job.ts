import { useMutation } from '@tanstack/react-query'
import { reportJob } from '../api/report-job'
import type { ReportJobInput, ReportJobResponse } from '../types'

export function useReportJob() {
  return useMutation<ReportJobResponse, Error, ReportJobInput>({
    mutationFn: (input) => reportJob(input),
  })
}
