import { test } from 'node:test'
import assert from 'node:assert'
import { mapReportReasonToCategory } from '../types/report-mapping.ts'

test('mapReportReasonToCategory maps Vietnamese reasons to backend enums correctly', () => {
  assert.strictEqual(mapReportReasonToCategory('Nội dung vi phạm / Lừa đảo'), 'FRAUD')
  assert.strictEqual(mapReportReasonToCategory('Yêu cầu thanh toán ngoài sàn'), 'OUTSIDE_PAYMENT')
  assert.strictEqual(mapReportReasonToCategory('Thông tin dự án giả mạo'), 'FAKE_INFORMATION')
  assert.strictEqual(mapReportReasonToCategory('Spam hoặc quảng cáo'), 'SPAM')
  assert.strictEqual(mapReportReasonToCategory('Quấy rối / Đe dọa'), 'HARASSMENT')
  assert.strictEqual(mapReportReasonToCategory('Lý do khác'), 'OTHER')
  assert.strictEqual(mapReportReasonToCategory(''), 'OTHER')
})

test('mapReportReasonToCategory is case-insensitive and handles partial keywords', () => {
  assert.strictEqual(mapReportReasonToCategory('phát hiện dấu hiệu lừa đảo tiền đặt cọc'), 'FRAUD')
  assert.strictEqual(mapReportReasonToCategory('bắt chuyển khoản outside sàn'), 'OUTSIDE_PAYMENT')
  assert.strictEqual(mapReportReasonToCategory('tài khoản fake thông tin'), 'FAKE_INFORMATION')
  assert.strictEqual(mapReportReasonToCategory('nhắn tin spam liên tục'), 'SPAM')
})
