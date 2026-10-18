import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { WarningCircleIcon, ArrowClockwiseIcon, HouseIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  let errorMessage = 'Đã xảy ra lỗi không mong muốn trong khi tải trang.'
  let errorStatus: number | string = 'Lỗi'

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage =
      error.statusText ||
      (typeof error.data === 'string' ? error.data : error.data?.message) ||
      'Không tìm thấy trang hoặc đã xảy ra lỗi máy chủ.'
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/home')
  }

  return (
    <div
      role="alert"
      className="min-h-screen bg-[#F4F2EE] flex items-center justify-center p-4 font-sans"
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
          <WarningCircleIcon size={32} weight="fill" />
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-[#DC2626] mb-1">
          {errorStatus}
        </div>

        <h1 className="text-xl font-bold text-[rgba(0,0,0,0.90)] mb-2">
          Không thể tải nội dung
        </h1>

        <p className="text-sm text-[rgba(0,0,0,0.60)] mb-6 leading-relaxed">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleReload}
            leftIcon={<ArrowClockwiseIcon size={16} weight="bold" />}
            className="w-full sm:w-auto"
          >
            Tải lại trang
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoHome}
            leftIcon={<HouseIcon size={16} weight="bold" />}
            className="w-full sm:w-auto"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorBoundary
