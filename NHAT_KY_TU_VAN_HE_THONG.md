# NHẬT KÝ TƯ VẤN VÀ CẤU HÌNH HỆ THỐNG WEBSITE ASPT
*Tài liệu tổng hợp lịch sử cấu hình, chẩn đoán lỗi mạng và thiết lập an ninh giữa máy Client và Server.*

Tài liệu này ghi lại toàn bộ các giải pháp kỹ thuật, câu lệnh chẩn đoán và hướng dẫn cấu hình đã thực hiện trong phiên làm việc để Quản trị viên (Admin) tiện tra cứu trực tiếp trong tương lai mà không cần mở lại lịch sử chat.

---

## 1. THÔNG TIN MẠNG NỘI BỘ (LAN)
- **IP Máy Client (THANH - Windows 10):** `192.168.1.172`
- **IP Máy chủ Server (Administrator - Windows Server 2016):** `192.168.1.254` (Được cấu hình gộp cạc mạng Team NIC).
- **Tên miền:** `aspt.vn` (phân giải nội bộ ra IP máy chủ `192.168.1.254` nhờ DNS của Modem/Router).

---

## 2. NHẬT KÝ CHẨN ĐOÁN LỖI KẾT NỐI REMOTE DESKTOP (RDP)
Khi kết nối Remote Desktop từ Client vào Server báo lỗi, các bước chẩn đoán đã thực hiện gồm:

### Bước 1: Kiểm tra kết nối mạng và Cổng 3389 (Chạy tại Client)
Sử dụng PowerShell tại máy Client để ping và kiểm tra cổng RDP trên Server:
```powershell
Test-NetConnection -ComputerName 192.168.1.254 -Port 3389
```
- Nếu `PingSucceeded: True` nhưng `TcpTestSucceeded: False` -> Máy chủ hoạt động nhưng cổng RDP 3389 đang bị đóng/chặn.

### Bước 2: Kiểm tra dịch vụ RDP có lắng nghe không (Chạy tại Server)
Mở Command Prompt trên Server và gõ:
```cmd
netstat -ano | findstr 3389
```
- Nếu không hiện kết quả -> Dịch vụ Remote Desktop trên Windows Server chưa khởi động thực sự.
- Cách xử lý: Mở `services.msc` -> Tìm `Remote Desktop Services` -> Chuyển sang `Automatic` -> Bấm `Start` dịch vụ này và dịch vụ `Remote Desktop Services UserMode Port Redirector` bên cạnh.

---

## 3. CẤU HÌNH TƯỜNG LỬA KASPERSKY PRO TRÊN SERVER
Để Remote Desktop hoạt động qua Kaspersky (khi cần mở), hoặc để khóa chặn (khi cần bảo mật):
1. Mở **Kaspersky** -> **Thiết lập** (Bánh răng) -> **Thiết lập bảo mật** -> **Tường lửa**.
2. Chọn **Quy tắc gói (Packet Rules)**.
3. Tìm dòng **Remote Desktop** (Cổng TCP 3389):
   - **Để sử dụng:** Chuyển sang **Cho phép (Allow - Tích xanh)**.
   - **Để bảo mật tối đa:** Chuyển sang **Chặn (Block - Vòng tròn đỏ gạch chéo)**.

---

## 4. PHƯƠNG ÁN BẢO MẬT TUYỆT ĐỐI (KHÓA RDP)
Sau khi đã thiết lập trang web hoạt động ổn định, khuyến nghị tắt Remote Desktop trên cả 2 máy (Client và Server) để tránh hacker quét cổng mạng:

- **Lớp 1 (Cài đặt hệ thống):** Nhấn `Windows + R` -> gõ `sysdm.cpl` -> Tab `Remote` -> Chọn `"Don't allow remote connections to this computer"`.
- **Lớp 2 (Vô hiệu hóa dịch vụ):** Nhấn `Windows + R` -> gõ `services.msc` -> Chuột phải vào `Remote Desktop Services` -> chọn `Properties` -> Chuyển Startup type thành `Disabled` -> Bấm `Stop` dịch vụ.
- **Lớp 3 (Khóa cổng Firewall):** Chuyển quy tắc gói **Remote Desktop** trong Kaspersky sang trạng thái **Chặn (Block)**.

---

## 5. CẤU HÌNH CÁC FILE LỆNH VẬN HÀNH

### A. File đồng bộ thủ công trên máy chủ Server (1-Click Update)
Được đặt tại Desktop của Server với tên là **`Cap_Nhat_Web.bat`**:
```bat
@echo off
echo [ASPT] Dang lay du lieu moi nhat tu GitHub...
cd /d "D:\Server\WebServer\www.aspt.vn_html"
git pull origin main
echo ===========================================
echo DONG BO THANH CONG! WEBSITE DA DUOC CAP NHAT!
echo ===========================================
pause
```

### B. File biên dịch dữ liệu cục bộ trên máy Client (THANH)
Được gọi thông qua kịch bản Python **`deploy_testing.py`** tại máy Client:
- **Nhiệm vụ:** Quét các thư mục có đuôi `-R..`, dịch thuật tự động sang 3 ngôn ngữ, cập nhật file dữ liệu `data.js`, dọn dẹp xóa đuôi `-R..` và dừng lại để Admin mở file `index.html` kiểm tra trước khi dùng GitHub Desktop để đẩy lên mạng.
