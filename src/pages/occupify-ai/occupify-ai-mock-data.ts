import type { AiChatSession, PromptTemplate } from '@/features/occupify-ai'

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'p1',
    category: 'jobs',
    badge: 'Hợp đồng & Việc làm',
    title: 'Gợi ý dự án Remote lương cao',
    description: 'Tìm các hợp đồng freelance React, TypeScript hoặc Full-stack làm việc từ xa.',
    prompt:
      'Gợi ý cho tôi các dự án hợp đồng freelance Full-stack / Frontend React làm việc Remote với ngân sách từ 25.000.000 ₫ trở lên.',
    iconName: 'briefcase',
  },
  {
    id: 'p2',
    category: 'cv',
    badge: 'Tối ưu hồ sơ',
    title: 'Đánh giá & Tối ưu hóa CV',
    description: 'Phân tích điểm mạnh, từ khóa ATS và đề xuất cải thiện hồ sơ năng lực.',
    prompt:
      'Hãy giúp tôi rà soát các điểm còn yếu trong CV kỹ sư phần mềm và gợi ý cách làm nổi bật kinh nghiệm dự án thực tế.',
    iconName: 'file-text',
  },
  {
    id: 'p3',
    category: 'project',
    badge: 'Ứng tuyển & Báo giá',
    title: 'Soạn thảo thư chào giá (Proposal)',
    description: 'Viết Cover Letter và lập luận báo giá chuyên nghiệp gửi cho khách hàng.',
    prompt:
      'Hãy viết một bản thư chào giá (Proposal / Cover Letter) ấn tượng cho dự án phát triển cổng thanh toán ký quỹ Escrow.',
    iconName: 'folder-plus',
  },
  {
    id: 'p4',
    category: 'career',
    badge: 'Tư vấn nghề nghiệp',
    title: 'Lộ trình thăng tiến Freelancer',
    description: 'Xây dựng kế hoạch nâng cao kỹ năng và chiến lược tăng thù lao theo giờ.',
    prompt:
      'Tư vấn cho tôi lộ trình phát triển từ Mid-level Freelancer lên Senior Independent Consultant trong 12 tháng tới.',
    iconName: 'lightbulb',
  },
]

export const INITIAL_SESSIONS: AiChatSession[] = [
  {
    id: 'session-1',
    title: 'Tối ưu hồ sơ năng lực & CV',
    lastUpdated: '10 phút trước',
    messages: [
      {
        id: 'm1-1',
        sender: 'user',
        content:
          'Chào bạn! Tôi muốn cải thiện hồ sơ CV ứng tuyển các dự án hợp đồng phần mềm lớn trên Occupify. Bạn có những lời khuyên nào?',
        timestamp: '14:20',
      },
      {
        id: 'm1-2',
        sender: 'ai',
        content: `Chào bạn! Để hồ sơ nổi bật và thu hút các khách hàng doanh nghiệp trên Occupify, bạn nên tối ưu theo các trọng tâm sau:

1. **Định lượng hóa kết quả đạt được (Metrics-driven):**
   * Thay vì chỉ ghi "Phát triển giao diện web", hãy viết: *"Tái cấu trúc hệ thống Frontend React, giảm 42% thời gian tải trang (LCP) và tăng 18% tỷ lệ chuyển đổi đơn hàng"*.

2. **Làm nổi bật kỹ năng then chốt theo từ khóa:**
   * Các khách hàng trên Occupify thường tìm kiếm các tổ hợp kỹ năng như: **React 19, TypeScript, Next.js, Tailwind CSS, RESTful API, Escrow Workflow**. Đảm bảo các từ khóa này xuất hiện ở phần đầu CV.

3. **Cung cấp bằng chứng thực tế (Proof of Work):**
   * Đính kèm liên kết GitHub repository chất lượng cao hoặc sản phẩm đang hoạt động.
   * Liệt kê các dự án có tính năng phức tạp: quản lý trạng thái, xác thực bảo mật, xử lý giao dịch thời gian thực.

Bạn có thể tải tệp CV của mình lên bằng nút đính kèm bên dưới, tôi sẽ hỗ trợ phân tích chi tiết từng phần!`,
        timestamp: '14:21',
      },
      {
        id: 'm1-3',
        sender: 'user',
        content:
          'Rất hữu ích! Tôi nên đặt mức thù lao khởi điểm như thế nào cho các hợp đồng cố định (Fixed-price)?',
        timestamp: '14:25',
      },
      {
        id: 'm1-4',
        sender: 'ai',
        content: `Đối với các hợp đồng **Fixed-price (Trọn gói)** trên Occupify, bạn nên áp dụng nguyên tắc định giá theo mốc bàn giao (Milestone-based):

* **Ước tính giờ làm thực tế x 1.25:** Luôn dự phòng 20-25% thời gian cho việc trao đổi phản hồi (feedback), sửa lỗi và nghiệm thu.
* **Chia nhỏ thanh toán theo Milestone Escrow:**
  * **Cột mốc 1 (30%):** Hoàn thiện Architecture, Wireframe & Prototype.
  * **Cột mốc 2 (40%):** Bàn giao Core Features và kết nối API.
  * **Cột mốc 3 (30%):** Nghiệm thu toàn diện (UAT), bàn giao tài liệu và triển khai.

Cách phân rã này giúp cả bạn và khách hàng luôn an tâm về tính bảo chứng tài chính!`,
        timestamp: '14:26',
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Tìm hợp đồng Freelance React & TS',
    lastUpdated: 'Hôm qua',
    messages: [
      {
        id: 'm2-1',
        sender: 'user',
        content: 'Gợi ý cho tôi các dự án hợp đồng freelance Frontend React làm việc Remote.',
        timestamp: 'Hôm qua',
      },
      {
        id: 'm2-2',
        sender: 'ai',
        content: `Dựa trên dữ liệu thị trường dự án trên Occupify, hiện tại có một số dự án tiềm năng cao phù hợp với chuyên môn React & TypeScript của bạn:

* **Tái thiết kế Cổng Marketplace & Thanh toán Escrow B2B**
  * *Mức ngân sách:* 28.000.000 ₫ (Hợp đồng trọn gói)
  * *Thời gian:* 3 tháng · Làm việc từ xa 100%
  * *Yêu cầu:* React, TypeScript, Tailwind CSS, bảo chứng thanh toán qua Escrow.

* **Nền tảng SaaS Quản lý Hợp đồng Điện tử & Chữ ký số**
  * *Mức ngân sách:* 450.000 ₫ / giờ (Thanh toán theo giờ linh hoạt)
  * *Thời gian:* 6 tháng · 20h/tuần
  * *Yêu cầu:* React, Node.js, Zustand, tối ưu hóa trải nghiệm ký điện tử.

Bạn có thể vào tab **Quản lý dự án** hoặc chuẩn bị bản đề xuất giá (Proposal) để ứng tuyển ngay!`,
        timestamp: 'Hôm qua',
      },
    ],
  },
  {
    id: 'session-3',
    title: 'Soạn thảo thư chào giá (Proposal)',
    lastUpdated: '3 ngày trước',
    messages: [
      {
        id: 'm3-1',
        sender: 'user',
        content: 'Tôi muốn mẫu viết proposal chào thầu dự án thiết kế UI/UX.',
        timestamp: '3 ngày trước',
      },
      {
        id: 'm3-2',
        sender: 'ai',
        content: `Dưới đây là cấu trúc mẫu thư chào thầu (Proposal) chuẩn mực dành cho dự án UI/UX giúp bạn gây ấn tượng mạnh với bên thuê:

1. **Lời chào & Xác nhận thấu hiểu bài toán:** Thể hiện rõ bạn đã đọc kỹ yêu cầu của dự án.
2. **Kế hoạch giải quyết từng bước:** Đưa ra lộ trình làm việc rõ ràng (Research -> Wireframe -> High-fidelity -> Prototype).
3. **Dự án tương đồng đã thực hiện:** 2-3 liên kết sản phẩm hoặc case study thực tế.
4. **Cam kết chất lượng & Bảo hành hậu dự án.**`,
        timestamp: '3 ngày trước',
      },
    ],
  },
]

export const QUICK_SUGGESTION_PILLS = [
  'Lọc việc 100% Remote',
  'Tối ưu từ khóa CV',
  'Mẫu chào giá Proposal',
  'Hợp đồng thanh toán Escrow',
  'Định giá thù lao theo giờ',
]
