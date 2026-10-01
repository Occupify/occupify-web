/**
 * Formats a numeric value into Vietnamese Dong (VND) currency string.
 * e.g., 52450000 -> "52.450.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.abs(amount)) + ' ₫'
}
