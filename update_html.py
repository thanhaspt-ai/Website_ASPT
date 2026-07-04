import re

html = open('index.html', encoding='utf-8').read()
replacements = [
(r'<li><a href="#trang-chu">Trang Chủ</a></li>', r'<li><a href="#trang-chu" data-i18n="nav-home">Trang Chủ</a></li>'),
(r'<li><a href="#ve-chung-toi">Giới thiệu</a></li>', r'<li><a href="#ve-chung-toi" data-i18n="nav-about">Giới thiệu</a></li>'),
(r'<li><a href="#giai-phap">Giải pháp Khách hàng</a></li>', r'<li><a href="#giai-phap" data-i18n="nav-solutions">Giải pháp Khách hàng</a></li>'),
(r'<li><a href="#du-an">Dự án Tiêu biểu</a></li>', r'<li><a href="#du-an" data-i18n="nav-projects">Dự án Tiêu biểu</a></li>'),
(r'<li><a href="#nang-luc">Năng lực</a></li>', r'<li><a href="#nang-luc" data-i18n="nav-capabilities">Năng lực</a></li>'),
(r'<li><a href="#lien-he" class="btn-primary">Liên hệ ngay</a></li>', r'<li><a href="#lien-he" class="btn-primary" data-i18n="nav-contact">Liên hệ ngay</a></li>'),

(r'<h1>Giải Pháp Thiết Kế Xây Dựng <span>Hạng 1</span></h1>', r'<h1 data-i18n="hero-title">Giải Pháp Thiết Kế Xây Dựng <span>Hạng 1</span></h1>'),
(r'<p>15 năm kinh nghiệm. Hơn 100 dự án lớn. Ứng dụng BIM chuyên sâu.</p>', r'<p data-i18n="hero-desc">15 năm kinh nghiệm. Hơn 100 dự án lớn. Ứng dụng BIM chuyên sâu.</p>'),
(r'<p class="sub-text">Đồng hành cùng Chủ đầu tư giải quyết bài toán phức tạp về Kiến trúc, Kết cấu, Cơ điện và Pháp lý.</p>', r'<p class="sub-text" data-i18n="hero-sub">Đồng hành cùng Chủ đầu tư giải quyết bài toán phức tạp về Kiến trúc, Kết cấu, Cơ điện và Pháp lý.</p>'),
(r'<a href="#giai-phap" class="btn-primary">Khám phá Giải pháp</a>', r'<a href="#giai-phap" class="btn-primary" data-i18n="hero-btn-primary">Khám phá Giải pháp</a>'),
(r'<a href="#du-an" class="btn-secondary">Xem Dự án</a>', r'<a href="#du-an" class="btn-secondary" data-i18n="hero-btn-secondary">Xem Dự án</a>'),

(r'<p>Năm kinh nghiệm</p>', r'<p data-i18n="stat-exp">Năm kinh nghiệm</p>'),
(r'<p>\+ Dự án tiêu biểu</p>', r'<p data-i18n="stat-projects">+ Dự án tiêu biểu</p>'),
(r'<p>Triệu m² sàn thiết kế</p>', r'<p data-i18n="stat-area">Triệu m² sàn thiết kế</p>'),
(r'<p>Tầng \(Công trình cao nhất\)</p>', r'<p data-i18n="stat-floors">Tầng (Công trình cao nhất)</p>'),

(r'<h2>Giới Thiệu Về A.S.P.T</h2>', r'<h2 data-i18n="about-title">Giới Thiệu Về A.S.P.T</h2>'),
(r'<p>Công ty TNHH MTV Tư vấn & Xây dựng A.S.P.T</p>', r'<p data-i18n="about-subtitle">Công ty TNHH MTV Tư vấn & Xây dựng A.S.P.T</p>'),

(r'<p><strong>1\. Trụ sở công ty:.*?mobile: 098\.214\.5011</p>', r'<p data-i18n="about-p1"><strong>1. Trụ sở công ty:</strong> 82 & 84 đường Ngô Tất Tố, phường Hòa Cường, thành phố Đà Nẵng.<br><strong>Điện thoại giao dịch:</strong> (0236)-362.46.96 | <strong>Website:</strong> www.aspt.vn<br><strong>Chủ doanh nghiệp:</strong> Lê Viết Thành (CEO), mobile: 098.214.5011</p>'),
(r'<p><strong>2\. Ngày thành lập:.*?Sở Kế hoạch Đầu tư Tp Đà Nẵng\.</p>', r'<p data-i18n="about-p2"><strong>2. Ngày thành lập:</strong> 11/05/2011, theo giấy chứng nhận đăng ký kinh doanh số 0401423059 của Sở Kế hoạch Đầu tư Tp Đà Nẵng.</p>'),
(r'<p><strong>3\. Ngành nghề kinh doanh:</strong></p>', r'<p data-i18n="about-p3"><strong>3. Ngành nghề kinh doanh:</strong></p>'),
(r'<li>Thiết kế Kiến trúc công trình Dân dụng & Công nghiệp\.</li>', r'<li data-i18n="about-l3-1">Thiết kế Kiến trúc công trình Dân dụng & Công nghiệp.</li>'),
(r'<li>Thiết kế Kết cấu công trình Dân dụng & Công nghiệp\.</li>', r'<li data-i18n="about-l3-2">Thiết kế Kết cấu công trình Dân dụng & Công nghiệp.</li>'),
(r'<li>Thiết kế Cơ-Điện công trình Dân dụng & Công nghiệp\.</li>', r'<li data-i18n="about-l3-3\">Thiết kế Cơ-Điện công trình Dân dụng & Công nghiệp.</li>'),
(r'<li>Lập quy hoạch 1/500 và hỗ trợ pháp lý trong quá trình thẩm định PCCC và xin cấp GPXD\.</li>', r'<li data-i18n="about-l3-4">Lập quy hoạch 1/500 và hỗ trợ pháp lý trong quá trình thẩm định PCCC và xin cấp GPXD.</li>'),

(r'<p><strong>4\. Giới thiệu công ty:</strong></p>', r'<p data-i18n="about-p4"><strong>4. Giới thiệu công ty:</strong></p>'),
(r'<p style="margin-bottom: 15px;">Công ty TNHH MTV Tư vấn.*?nhiều công trình đặc thù khác\.</p>', r'<p style="margin-bottom: 15px;" data-i18n="about-p4-desc1">Công ty TNHH MTV Tư vấn và Xây dựng A.S.P.T chuyên thiết kế các công trình dân dụng, công nghiệp, đặc biệt là nhà cao tầng và các dự án có kết cấu phức tạp. Chúng tôi đã thực hiện nhiều công trình quy mô lớn, bao gồm các khách sạn tiêu chuẩn quốc tế, nhà máy và nhiều công trình đặc thù khác.</p>'),
(r'<p style="margin-bottom: 15px;">Thế mạnh của công ty chúng tôi.*?chất lượng cao với chi phí hợp lý\.</p>', r'<p style="margin-bottom: 15px;" data-i18n="about-p4-desc2">Thế mạnh của công ty chúng tôi nổi bật ở các điểm sau: Đội ngũ chủ trì thiết kế đều có chứng chỉ hạng 1 và giàu kinh nghiệm, giúp phối hợp công việc hiệu quả. Toàn bộ quá trình thiết kế được thực hiện đồng bộ trên nền tảng BIM, đảm bảo sản phẩm chính xác và chất lượng. Chúng tôi có bề dày kinh nghiệm trong việc thiết kế các kết cấu phức tạp và hệ thống MEP, HVAC quy mô lớn. Sự am hiểu pháp luật và thực tiễn giúp công ty hỗ trợ pháp lý tối ưu cho các dự án. Ngoài ra, việc hợp tác với các đối tác kiến trúc uy tín tại Nhật Bản giúp chúng tôi cung cấp dịch vụ tổng thầu thiết kế chất lượng cao với chi phí hợp lý.</p>'),

(r'<p><strong>Công ty A\.S\.P\.T đã được cấp:</strong></p>', r'<p data-i18n="about-p5"><strong>Công ty A.S.P.T đã được cấp:</strong></p>'),
(r'<li>Chứng chỉ Năng lực Hoạt động Xây dựng số 00000650 Hạng 1 ở nội dung thiết kế và thẩm tra công trình Dân dụng\.</li>', r'<li data-i18n="about-l5-1">Chứng chỉ Năng lực Hoạt động Xây dựng số 00000650 Hạng 1 ở nội dung thiết kế và thẩm tra công trình Dân dụng.</li>'),
(r'<li>Chứng chỉ Năng lực Hoạt động Xây dựng số DNA-00000650 Hạng 2 ở nội dung thiết kế và thẩm tra công trình Nhà Công nghiệp\.</li>', r'<li data-i18n="about-l5-2">Chứng chỉ Năng lực Hoạt động Xây dựng số DNA-00000650 Hạng 2 ở nội dung thiết kế và thẩm tra công trình Nhà Công nghiệp.</li>'),
(r'<li>Chứng chỉ Năng lực Hoạt động Xây dựng số HCM-00000650 Hạng 3 ở nội dung lập thiết kế quy hoạch xây dựng và thiết kế, thẩm tra công trình Hạ tầng kỹ thuật\.</li>', r'<li data-i18n="about-l5-3">Chứng chỉ Năng lực Hoạt động Xây dựng số HCM-00000650 Hạng 3 ở nội dung lập thiết kế quy hoạch xây dựng và thiết kế, thẩm tra công trình Hạ tầng kỹ thuật.</li>'),

(r'<p><strong>5\. Tiêu chí thiết kế:.*?linh hoạt cập nhật thay đổi của dự án\.</p>', r'<p data-i18n="about-p6"><strong>5. Tiêu chí thiết kế:</strong> Tập trung nâng cao năng lực nhân sự và công cụ để cung cấp hồ sơ thiết kế chất lượng cao. Áp dụng giải pháp kỹ thuật tối ưu giúp chủ đầu tư tiết kiệm chi phí xây dựng, duy trì mức phí cạnh tranh, đảm bảo tiến độ nhanh và linh hoạt cập nhật thay đổi của dự án.</p>'),

(r'<p><strong>6\. Đối tượng khách hàng tiềm năng:</strong></p>', r'<p data-i18n="about-p7"><strong>6. Đối tượng khách hàng tiềm năng:</strong></p>'),
(r'<li>Các chủ đầu tư dự án dân dụng quy mô từ trung bình tới lớn \(đến cấp 1\), bao gồm cả nội dung quy hoạch và thiết kế hạ tầng kỹ thuật\.</li>', r'<li data-i18n="about-l7-1">Các chủ đầu tư dự án dân dụng quy mô từ trung bình tới lớn (đến cấp 1), bao gồm cả nội dung quy hoạch và thiết kế hạ tầng kỹ thuật.</li>'),
(r'<li>Các chủ đầu tư công trình căn hộ dòng tiền, biệt thự quy mô trung bình\.</li>', r'<li data-i18n="about-l7-2">Các chủ đầu tư công trình căn hộ dòng tiền, biệt thự quy mô trung bình.</li>'),
(r'<li>Các chủ đầu tư các nhà máy, xí nghiệp, công trình công nghiệp quy mô từ nhỏ tới lớn \(đến cấp 2\), bao gồm cả nội dung quy hoạch và thiết kế hạ tầng kỹ thuật\.</li>', r'<li data-i18n="about-l7-3">Các chủ đầu tư các nhà máy, xí nghiệp, công trình công nghiệp quy mô từ nhỏ tới lớn (đến cấp 2), bao gồm cả nội dung quy hoạch và thiết kế hạ tầng kỹ thuật.</li>'),
(r'<li>Những đơn vị thiết kế chỉ chuyên sâu vào một lĩnh vực duy nhất đang có mong muốn liên kết thành lập liên danh nhằm cùng nhau đảm nhận thiết kế tổng thể dự án\.</li>', r'<li data-i18n="about-l7-4">Những đơn vị thiết kế chỉ chuyên sâu vào một lĩnh vực duy nhất đang có mong muốn liên kết thành lập liên danh nhằm cùng nhau đảm nhận thiết kế tổng thể dự án.</li>'),
(r'<li>Các đơn vị thi công đang tìm kiếm nhà thầu thiết kế để lập liên doanh D&B\.</li>', r'<li data-i18n="about-l7-5">Các đơn vị thi công đang tìm kiếm nhà thầu thiết kế để lập liên doanh D&B.</li>'),

(r'<p><strong>7\. Công trình tiêu biểu đã thiết kế:.*?phạm vi cả nước,…</p>', r'<p data-i18n="about-p8"><strong>7. Công trình tiêu biểu đã thiết kế:</strong> Với hơn 15 năm kinh nghiệm, chúng tôi đã thiết kế hơn 100 công trình có quy mô từ trung bình đến lớn, tiêu biểu như khách sạn Regis Bay, Brilliant, Vanda, Rosamia, Mường Thanh, TMS Luxury, tòa tháp PA Tower, vòng quay Sun Wheel, du thuyền Marina, Bệnh viện Gia đình, Đại học Đông Á, Tòa tháp văn phòng Danapha, nhà máy Danapha tại khu công nghệ cao, các dự án trường học FPT tại nhiều địa phương trên phạm vi cả nước,…</p>'),
(r'<p style=\"margin-top: 15px;\"><strong>8\. Công cụ:.*?CADEWA, …\.</p>', r'<p style="margin-top: 15px;" data-i18n="about-p9"><strong>8. Công cụ:</strong> Công ty đã đầu tư nhiều phần mềm bản quyền như: Etabs Ultimate v23, Adapt Builder 2020, Autodesk AEC (gồm Revit, Autocad, Naviswork, RSAP, Advance Steel, Civil 3D,…), Dbim & Dbim Steel, Ketcausoft, G8, CADEWA, ….</p>'),

(r'<h2>Giải Pháp Dành Cho Khách Hàng</h2>', r'<h2 data-i18n="sol-title">Giải Pháp Dành Cho Khách Hàng</h2>'),
(r'<p>ASPT không chỉ cung cấp bản vẽ, chúng tôi mang đến giải pháp toàn diện, giải quyết mọi bài toán kỹ thuật và pháp lý\.</p>', r'<p data-i18n="sol-subtitle">ASPT không chỉ cung cấp bản vẽ, chúng tôi mang đến giải pháp toàn diện, giải quyết mọi bài toán kỹ thuật và pháp lý.</p>'),
(r'<h3>CĐT Dự án Lớn \(Cấp 1, Cấp 2\)</h3>', r'<h3 data-i18n="sol-1-t">CĐT Dự án Lớn (Cấp 1, Cấp 2)</h3>'),
(r'<p>Tổng thầu thiết kế Kiến trúc, Kết cấu, MEP\. Kinh nghiệm xử lý hầm sâu, nền đất yếu, cầu trục 100 tấn và thủ tục pháp lý phức tạp\.</p>', r'<p data-i18n="sol-1-d">Tổng thầu thiết kế Kiến trúc, Kết cấu, MEP. Kinh nghiệm xử lý hầm sâu, nền đất yếu, cầu trục 100 tấn và thủ tục pháp lý phức tạp.</p>'),
(r'<h3>Dự án Vừa & Nhỏ</h3>', r'<h3 data-i18n="sol-2-t">Dự án Vừa & Nhỏ</h3>'),
(r'<p>Giải pháp tối ưu chi phí và không gian cho căn hộ cho thuê \(6-9 tầng\), khách sạn mini, biệt thự cao cấp\.</p>', r'<p data-i18n="sol-2-d">Giải pháp tối ưu chi phí và không gian cho căn hộ cho thuê (6-9 tầng), khách sạn mini, biệt thự cao cấp.</p>'),
(r'<h3>Đối Tác Thiết Kế \(B2B\)</h3>', r'<h3 data-i18n="sol-3-t">Đối Tác Thiết Kế (B2B)</h3>'),
(r'<p>Hợp tác thiết kế chuyên sâu Kết cấu, Cơ điện, Lập dự toán, và triển khai mô hình BIM \(LOD 300 - 400\)\.</p>', r'<p data-i18n="sol-3-d">Hợp tác thiết kế chuyên sâu Kết cấu, Cơ điện, Lập dự toán, và triển khai mô hình BIM (LOD 300 - 400).</p>'),
(r'<h3>Quy hoạch & Hạ tầng</h3>', r'<h3 data-i18n="sol-4-t">Quy hoạch & Hạ tầng</h3>'),
(r'<p>Lập quy hoạch chi tiết 1/500, thiết kế cơ sở hạ tầng kỹ thuật \(cấp 3\) nhanh chóng, chuẩn xác\.</p>', r'<p data-i18n="sol-4-d">Lập quy hoạch chi tiết 1/500, thiết kế cơ sở hạ tầng kỹ thuật (cấp 3) nhanh chóng, chuẩn xác.</p>'),

(r'<h2>Dự Án Tiêu Biểu</h2>', r'<h2 data-i18n="proj-title">Dự Án Tiêu Biểu</h2>'),
(r'<p>Những công trình khẳng định năng lực Hạng 1 của ASPT trên khắp cả nước\.</p>', r'<p data-i18n="proj-subtitle">Những công trình khẳng định năng lực Hạng 1 của ASPT trên khắp cả nước.</p>'),
(r'<a href=\"#\" class=\"btn-primary\">Xem tất cả dự án</a>', r'<a href="#" class="btn-primary" data-i18n="proj-btn">Xem tất cả dự án</a>'),

(r'<h2 style=\"color: white;\">Năng Lực Cốt Lõi</h2>', r'<h2 style="color: white;" data-i18n="cap-title">Năng Lực Cốt Lõi</h2>'),
(r'<p style=\"color: rgba\(255,255,255,0\.8\);\">Sở hữu đội ngũ chuyên gia và phần mềm bản quyền hàng đầu\.</p>', r'<p style="color: rgba(255,255,255,0.8);" data-i18n="cap-subtitle">Sở hữu đội ngũ chuyên gia và phần mềm bản quyền hàng đầu.</p>'),
(r'<h3>Chứng chỉ Hạng 1</h3>', r'<h3 data-i18n="cap-1-t">Chứng chỉ Hạng 1</h3>'),
(r'<p>BXD-00000650: Thiết kế & Thẩm tra Dân dụng Hạng 1\. Đội ngũ chủ trì cơ hữu giàu kinh nghiệm\.</p>', r'<p data-i18n="cap-1-d">BXD-00000650: Thiết kế & Thẩm tra Dân dụng Hạng 1. Đội ngũ chủ trì cơ hữu giàu kinh nghiệm.</p>'),
(r'<h3>Công nghệ BIM</h3>', r'<h3 data-i18n="cap-2-t">Công nghệ BIM</h3>'),
(r'<p>Ứng dụng triệt để BIM trong thiết kế giúp phát hiện xung đột sớm, tối ưu khối lượng và chi phí thi công\.</p>', r'<p data-i18n="cap-2-d">Ứng dụng triệt để BIM trong thiết kế giúp phát hiện xung đột sớm, tối ưu khối lượng và chi phí thi công.</p>'),
(r'<h3>Pháp lý Vững vàng</h3>', r'<h3 data-i18n="cap-3-t">Pháp lý Vững vàng</h3>'),
(r'<p>Đồng hành xử lý các thủ tục cấp phép, thẩm định PCCC nhanh chóng theo quy định mới nhất\.</p>', r'<p data-i18n="cap-3-d">Đồng hành xử lý các thủ tục cấp phép, thẩm định PCCC nhanh chóng theo quy định mới nhất.</p>'),

(r'<p>Công ty TNHH MTV Tư vấn & Xây dựng A\.S\.P\.T - Giải pháp thiết kế xây dựng Hạng 1 toàn diện cho mọi công trình\.</p>', r'<p data-i18n="footer-about">Công ty TNHH MTV Tư vấn & Xây dựng A.S.P.T - Giải pháp thiết kế xây dựng Hạng 1 toàn diện cho mọi công trình.</p>'),
(r'<h4>Liên hệ</h4>', r'<h4 data-i18n="footer-contact-title">Liên hệ</h4>'),
(r'<p><i class=\"fas fa-map-marker-alt\"></i> 82 & 84 Ngô Tất Tố, phường Hòa Cường, Thành phố Đà Nẵng, Việt Nam</p>', r'<p><i class="fas fa-map-marker-alt"></i> <span data-i18n="footer-contact-address">82 & 84 Ngô Tất Tố, phường Hòa Cường, Thành phố Đà Nẵng, Việt Nam</span></p>'),
(r'<h4>Kết nối</h4>', r'<h4 data-i18n="footer-connect">Kết nối</h4>')
]
for old, new in replacements:
    html = re.sub(old, new, html, flags=re.DOTALL)

# Add language switcher in navbar
nav_addition = r'''
            <ul class="nav-links">
                <li class="lang-switcher">
                    <select id="lang-select" onchange="changeLanguage(this.value)" style="background: transparent; border: 1px solid var(--primary-color); border-radius: 4px; padding: 4px; font-weight: 600; cursor: pointer; color: var(--text-color);">
                        <option value="vi">🇻🇳 VN</option>
                        <option value="en">🇬🇧 EN</option>
                        <option value="ja">🇯🇵 JP</option>
                        <option value="zh">🇨🇳 CN</option>
                    </select>
                </li>
'''
html = html.replace('<ul class="nav-links">', nav_addition)

# Add lang.js include
html = html.replace('<script src="script.js"></script>', '<script src="lang.js"></script>\n    <script src="script.js"></script>')

open('index.html', 'w', encoding='utf-8').write(html)
