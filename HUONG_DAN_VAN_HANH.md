# HƯỚNG DẪN QUẢN TRỊ VÀ VẬN HÀNH WEBSITE ASPT
*Tài liệu kỹ thuật nội bộ dành cho Quản trị viên hệ thống (Admin)*

Tài liệu này hướng dẫn chi tiết cách thức quản lý cấu trúc dữ liệu thư mục, quy tắc đặt tên tệp tin phương tiện (hình ảnh, video, tài liệu PDF), quy trình cập nhật nội dung tự động dịch thuật và kịch bản tương tác khách hàng qua AI-Agent trên Website ASPT.

---

## 1. QUY TẮC CẤU TRÚC THƯ MỤC DỮ LIỆU (DIRECTORY STRUCTURE)

Dữ liệu của Website ASPT được thiết kế theo mô hình **File-based CMS** (Quản trị nội dung bằng tệp tin). Để kịch bản dịch thuật tự động (`update_data.py`) hoạt động chuẩn xác, Admin cần lưu trữ dữ liệu tại các vị trí cố định dưới đây:

### A. Quy tắc đặt tên thư mục
Tất cả các thư mục dự án và giải pháp cụ thể phải được đánh số và đặt tên theo định dạng sau:
> **`[x]-[y]-[tên-viết-liền-không-dấu]`**
- **`x`**: Số nhóm chính (từ 1 đến 4).
- **`y`**: Số thứ tự của bài viết hoặc dự án trong nhóm đó (đánh số tăng dần từ cũ đến mới).
- **`tên-viết-liền-không-dấu`**: Tên định danh ngắn gọn bằng tiếng Việt không dấu, kết nối bằng dấu gạch ngang.

*Ví dụ thực tế:*
- `1-1-giai-phap-ham-sau` (Bài viết số 1 của nhóm giải pháp số 1).
- `2-5-khach-san-rosamia` (Dự án số 5 của nhóm dự án số 2).

---

### B. Cấu trúc thư mục cụ thể trên ổ đĩa

#### 1. Mục Giải pháp chuyên ngành (`assets/solutions/`)
Chứa 4 nhóm thư mục con tương ứng với 4 nhóm giải pháp đã thiết lập trên website:
- `/assets/solutions/1/` (Chủ đầu tư Dự án Lớn)
- `/assets/solutions/2/` (Chủ đầu tư Dự án Vừa & Nhỏ)
- `/assets/solutions/3/` (Đối Tác Thiết Kế B2B)
- `/assets/solutions/4/` (Chủ đầu tư Dự án Quy hoạch & Hạ tầng kỹ thuật)

#### 2. Mục Dự án tiêu biểu (`assets/projects/`)
Chứa các thư mục nhóm dự án:
- `/assets/projects/1-Dan-Dung-Cao-Tang/`
- `/assets/projects/2-Nha-Cong-Nghiep/`
- ... (Các nhóm dự án khác)

#### 3. Mục Giới thiệu (Về chúng tôi - `assets/about-us/`)
Chứa 2 thư mục con cố định:
- `/assets/about-us/phap-ly/` (Văn bản pháp lý, license phần mềm)
- `/assets/about-us/van-hoa/` (Album hình ảnh hoạt động doanh nghiệp)

---

## 2. QUY TẮC PHƯƠNG TIỆN VÀ TỆP CẤU HÌNH (MEDIA & CONFIG RULES)

Trong mỗi thư mục bài viết hoặc dự án cụ thể, Admin cần sắp xếp các tệp tin theo quy tắc sau:

### A. Ảnh đại diện (Cover Image)
- **Đối với Dự án**: Tên file ảnh đại diện bắt buộc phải bắt đầu bằng chữ **`Cover`** viết hoa (Ví dụ: `Cover_rosamia.jpg`, `Cover_nha_may.png`).
- **Đối với các mục khác** (Giải pháp, Pháp lý, Văn hóa): Tên file ảnh đại diện bắt buộc phải bắt đầu bằng chữ **`cover`** viết thường (Ví dụ: `cover_chung_chi.jpg`, `cover_hoi_thao.png`).

### B. Tệp thông tin nội dung (`info.json`)
Mỗi thư mục con bắt buộc phải chứa một tệp cấu hình có tên chính xác là **`info.json`**. Admin chỉ cần soạn thảo nội dung bằng Tiếng Việt theo các mẫu sau:

#### 1. Mẫu `info.json` dành cho Dự án:
```json
{
  "title_vi": "Khách sạn Funasea Đà Nẵng",
  "description_vi": "Dự án khách sạn 4 sao với quy mô 22 tầng nổi và 1 tầng hầm..."
}
```

#### 2. Mẫu `info.json` dành cho Giải pháp & Văn hóa (Hỗ trợ nhúng video YouTube):
```json
{
  "title_vi": "Giải pháp thiết kế hầm sâu nhiều tầng hầm",
  "date": "2026-07-03",
  "video_url": "https://www.youtube.com/embed/Mã_Video_YouTube",
  "description_vi": "Hướng dẫn chi tiết về các biện pháp thi công và thiết kế hệ thống tường vây..."
}
```
*Lưu ý: Nếu bài viết không có video (chỉ có tài liệu PDF hoặc Album ảnh), hãy để trống dòng video: `"video_url": ""`.*

#### 3. Mẫu `info.json` dành cho Hồ sơ Pháp lý:
```json
{
  "title_vi": "Chứng chỉ Năng lực Hạng 1 (Thiết kế & Thẩm tra)",
  "desc_vi": "Số BXD-00000650 do Bộ Xây dựng cấp.",
  "type": "pdf" 
}
```
*(Trong đó `type` có giá trị là `"pdf"` hoặc `"license"` để website hiển thị đúng biểu tượng).*

### C. Tài liệu đính kèm (PDF & Album ảnh)
- **Tài liệu PDF**: Thả trực tiếp tệp tin định dạng `.pdf` bất kỳ vào thư mục của bài viết đó. Hệ thống sẽ tự động nhận diện và cung cấp nút mở/tải về cho người xem.
- **Album hình ảnh**: Thả các tệp tin hình ảnh chi tiết vào thư mục (Khuyên dùng từ 3-5 ảnh chất lượng cao).

---

## 3. KỊCH BẢN CẬP NHẬT NỘI DUNG HẰNG NGÀY (ADMIN WORKFLOW)

Quy trình cập nhật nội dung từ máy tính cá nhân của bạn (user "THANH") lên website chính thức chạy trên máy chủ được tối giản hóa qua 4 bước:

```text
[BƯỚC 1: Soạn tệp & JSON] -> [BƯỚC 2: Chạy update_data.py] -> [BƯỚC 3: Đồng bộ GitHub Desktop] -> [Hoàn tất cập nhật web]
```

### Quy tắc Tối ưu hóa Cập nhật nhanh bằng hậu tố thư mục:
Để tăng tốc quá trình đồng bộ và hạn chế việc dịch thuật lặp lại gây mất thời gian, hệ thống hỗ trợ các hậu tố kích hoạt (Rule) sau. Bạn chỉ cần thêm hậu tố tương ứng vào cuối tên thư mục:
- **Thư mục kết thúc bằng `-R1` (Chỉ cập nhật hình ảnh)**: Chỉ quét thư mục đĩa để cập nhật hình ảnh và chọn lại ảnh đại diện (`cover`), bỏ qua tiến trình dịch văn bản.
- **Thư mục kết thúc bằng `-R2` (Chỉ cập nhật văn bản)**: Chỉ đọc file tài liệu `docx`/`info.json` để chạy dịch thuật sang các ngôn ngữ, bỏ qua việc quét lại ảnh.
- **Thư mục kết thúc bằng `-R3` (Cập nhật toàn bộ)**: Thực hiện đồng thời cả hai tiến trình quét hình ảnh và dịch thuật đối với thư mục đã tồn tại.
- **Thư mục kết thúc bằng `-R4` (Thêm mới mục)**: Được dùng khi bổ sung mục giải pháp/dự án mới hoàn toàn. Hệ thống sẽ quét toàn bộ ảnh, tài liệu và thực hiện dịch thuật đầy đủ.
- **Thư mục kết thúc bằng `-RX` (Xóa bỏ mục)**: Dùng khi muốn xóa bỏ hoàn toàn mục này. Hệ thống sẽ **xóa thư mục trên đĩa đĩa** và loại bỏ khỏi cơ sở dữ liệu web.
- **Thư mục không có hậu tố `-R..`**: Hệ thống sẽ lấy trực tiếp thông tin từ bộ nhớ đệm (cực kỳ nhanh, chỉ dưới 2 giây để hoàn thành quét toàn bộ website).

*Lưu ý quan trọng*: Sau khi chạy cập nhật `update_data.py` thành công, hệ thống sẽ **tự động xóa bỏ các hậu tố `-R1`, `-R2`, `-R3`, `-R4`** trên đĩa để đưa thư mục về dạng tên bình thường, giúp bạn nhận biết phần việc đã được xử lý xong. Dữ liệu có hậu tố `-RX` sẽ bị xóa hoàn toàn khỏi đĩa cứng.

### Chi tiết các bước thực hiện:
- **Bước 1**: Tạo thư mục bài viết mới tại máy Client theo đúng quy tắc đánh số ở Mục 1 và thêm hậu tố cập nhật mong muốn (ví dụ: `1-6-giai-phap-moi-R3` nếu muốn cập nhật cả ảnh và dịch text).
- **Bước 2**: Nhấp đúp chuột chạy file kịch bản **`update_data.py`** trên máy tính của bạn.
  - *Tác vụ tự động*: Kịch bản Python sẽ tự động quét các thư mục gắn đuôi `-R..`, thực hiện tác vụ tương ứng, dịch sang các ngôn ngữ tương ứng, lưu trữ vào tệp cơ sở dữ liệu `data.js` và tự động đổi tên thư mục gốc để dọn dẹp hậu tố.
- **Bước 3**: Mở phần mềm **GitHub Desktop** trên máy Client của bạn.
  - Phần mềm sẽ tự động liệt kê các file mới được thay đổi.
  - Nhập một tiêu đề ngắn tại ô Commit (Ví dụ: "Đăng bài giải pháp mới") và nhấn nút **Commit to main**.
  - Nhấn nút **Push origin** ở góc trên để đẩy mã nguồn lên kho chứa GitHub bảo mật.
- **Bước 4**: Máy chủ Server 24/7 của công ty sẽ tự động phát hiện thay đổi trên GitHub qua Webhook, thực hiện lệnh `git pull` để cập nhật mã nguồn mới nhất lên tên miền `aspt.vn` trong vòng vài giây.

---

## 4. KỊCH BẢN CHĂM SÓC KHÁCH HÀNG QUA AI-AGENT & HOTLINE

Để lôi kéo khách hàng đến văn phòng làm việc offline trực tiếp, AI-Agent hoạt động theo kịch bản tương tác tự động:

1. **Giai đoạn 1 (Bộ lọc từ khóa thông minh - Offline Mode)**:
   - Chatbot nổi ở góc phải màn hình sẽ tự động trả lời khách hàng dựa trên các từ khóa chính liên quan đến kỹ thuật kết cấu, tối ưu hóa chi phí hoặc tuyển dụng của công ty.
   - Định hướng khách hàng để lại thông tin liên lạc (Email/Số điện thoại) hoặc đặt lịch họp trực tiếp tại văn phòng.
2. **Giai đoạn 2 (Tích hợp luồng n8n - Online Mode)**:
   - Khi bạn triển khai cài đặt **n8n** trên Server 24/7, luồng chatbot sẽ được kết nối trực tiếp đến Webhook n8n.
   - n8n sẽ kết nối với Trí tuệ nhân tạo (LLM) để đọc hiểu toàn bộ thông tin dự án, năng lực của ASPT để chat chuyên sâu như một kỹ sư chuyên nghiệp thực thụ.
   - Ngay khi khách hàng để lại SĐT hoặc yêu cầu gặp Kỹ sư trưởng, n8n sẽ gửi ngay tin nhắn cảnh báo (Notification) kèm lịch sử chat của khách về Telegram/Zalo của bạn để bạn chuẩn bị cuộc họp.
