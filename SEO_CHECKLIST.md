# 🚀 SEO CHECKLIST & HƯỚNG DẪN TỐI ƯU HÓA WEBSITE

**Website:** [https://haquangminhduc.github.io/](https://haquangminhduc.github.io/)  
**Chủ sở hữu:** Hà Quang Minh Đức  
**Lĩnh vực:** Lập trình Web & Portfolio Cá Nhân  
**Nền tảng:** Static Site (GitHub Pages)  
**Ngày cập nhật:** 24/10/2026  

---

## ✅ I. NHỮNG MỤC ĐÃ HOÀN THÀNH TỰ ĐỘNG

Dưới đây là các hạng mục Technical & On-Page SEO đã được thiết lập trực tiếp vào mã nguồn:

### 1. File Điều Hướng Bot Tìm Kiếm (`robots.txt`)
- [x] Tạo file [robots.txt](robots.txt) tại thư mục gốc.
- [x] Cấu hình cho phép mọi bot hợp lệ thu thập dữ liệu: `User-agent: *`, `Allow: /`.
- [x] Khai báo chính xác đường dẫn sitemap: `Sitemap: https://haquangminhduc.github.io/sitemap.xml`.

### 2. Sơ Đồ Trang Web Chuẩn (`sitemap.xml`)
- [x] Tạo file [sitemap.xml](sitemap.xml) theo chuẩn schema `sitemaps.org/schemas/sitemap/0.9`.
- [x] Quét và liệt kê toàn bộ 5 trang HTML công khai của website:
  - Trang chủ (`/`): `priority = 1.0`, `changefreq = weekly`
  - Mùa Xuân (`/spring.html`): `priority = 0.8`, `changefreq = monthly`
  - Mùa Hạ (`/summer.html`): `priority = 0.8`, `changefreq = monthly`
  - Mùa Thu (`/autumn.html`): `priority = 0.8`, `changefreq = monthly`
  - Mùa Đông (`/winter.html`): `priority = 0.8`, `changefreq = monthly`
- [x] Cập nhật mốc thời gian `<lastmod>` theo định dạng chuẩn ISO `YYYY-MM-DD`.

### 3. Tối Ưu Thẻ Meta Trong `<head>` Toàn Bộ 5 Trang HTML
- [x] **Ngôn ngữ trang:** Đảm bảo toàn bộ tài liệu HTML đều có thuộc tính `<html lang="vi">`.
- [x] **Thẻ `<title>`:** Duy nhất cho từng trang, mô tả rõ ràng (Tên + Chủ đề/Lĩnh vực), chuẩn độ dài vàng 50–60 ký tự:
  - `index.html`: `Hà Quang Minh Đức | Lập trình Web & Portfolio Cá Nhân` *(53 ký tự)*
  - `spring.html`: `Hà Quang Minh Đức 🌸 | Mùa Xuân - Portfolio Cá Nhân` *(51 ký tự)*
  - `summer.html`: `Hà Quang Minh Đức ☀️ | Mùa Hạ - Web Portfolio Cá Nhân` *(53 ký tự)*
  - `autumn.html`: `Hà Quang Minh Đức 🍁 | Mùa Thu - Portfolio Cá Nhân` *(50 ký tự)*
  - `winter.html`: `Hà Quang Minh Đức ❄️ | Mùa Đông - Portfolio Cá Nhân` *(51 ký tự)*
- [x] **Thẻ `<meta name="description">`:** Viết hấp dẫn, súc tích, độ dài chuẩn 150–160 ký tự, chứa từ khóa chính và địa điểm (Nghệ An, VN):
  - `index.html` *(157 ký tự)*
  - `spring.html` *(153 ký tự)*
  - `summer.html` *(156 ký tự)*
  - `autumn.html` *(152 ký tự)*
  - `winter.html` *(157 ký tự)*
- [x] **Canonical Tag (`<link rel="canonical">`):** Trỏ đúng URL tuyệt đối của từng trang, ngăn chặn trùng lặp nội dung khi truy cập qua các tham số query (như `?classic`).
- [x] **Open Graph Meta Tags (Facebook, Zalo, Messenger):**
  - `og:type` = `website`
  - `og:url` = URL tương ứng từng trang
  - `og:title` & `og:description` đồng bộ
  - `og:image` = `https://haquangminhduc.github.io/social-preview.png` (kích thước chuẩn 1200x630)
  - `og:locale` = `vi_VN`
- [x] **Twitter / X Cards:**
  - `twitter:card` = `summary_large_image`
  - `twitter:title`, `twitter:description`, `twitter:image` đầy đủ.

### 4. Dữ Liệu Có Cấu Trúc Schema JSON-LD (Rich Results)
- [x] Tích hợp mã JSON-LD chuẩn `schema.org` vào `<head>` của trang chủ [index.html](index.html):
  - **Schema `Person`:** Tên đầy đủ ("Hà Quang Minh Đức"), nghệ danh ("Ha Quang Minh Duc"), chức danh ("Lập trình viên Web"), quê quán ("Nghệ An, VN"), liên kết mạng xã hội `sameAs` trỏ tới GitHub (`https://github.com/haquangminhduc`).
  - **Schema `WebSite`:** Tên website, URL, mô tả và liên kết sở hữu với entity `Person`.

### 5. Tự Động Hóa Ping Sitemap (GitHub Actions)
- [x] Tạo workflow [.github/workflows/seo-ping.yml](.github/workflows/seo-ping.yml).
- [x] Tự động gửi ping thông báo cập nhật sitemap tới Google và Bing mỗi khi push lên nhánh `main`.

---

## ⏳ II. NHỮNG VIỆC BẠN (USER) CẦN LÀM THỦ CÔNG (PHASE 3)

Vì GitHub Pages cần thời gian deploy và các dịch vụ của bên thứ ba yêu cầu quyền sở hữu tài khoản cá nhân, bạn hãy thực hiện theo các bước sau:

### 1. Chuẩn Bị File Ảnh Xem Trước Khi Chia Sẻ (`social-preview.png`)
- [ ] Thiết kế hoặc xuất 1 file ảnh có tỉ lệ **1200 x 630 px** (tỉ lệ 1.91:1 chuẩn Open Graph cho Facebook, Zalo, Twitter, LinkedIn).
- [ ] Nội dung đề xuất: Chân dung của bạn, dòng chữ *"Hà Quang Minh Đức - Web Developer Portfolio"*, cùng background aesthetic đồng bộ với trang web.
- [ ] Đặt tên file là `social-preview.png` và lưu trực tiếp vào thư mục gốc của repository (cùng cấp với `index.html`).
- [ ] Commit và push lên GitHub.

### 2. Commit & Push Code Lên GitHub
- [ ] Mở terminal và chạy lệnh:
  ```bash
  git add robots.txt sitemap.xml SEO_CHECKLIST.md index.html spring.html summer.html autumn.html winter.html
  git commit -m "feat(seo): optimize meta tags, add robots.txt, sitemap.xml, json-ld schema and checklist"
  git push origin main
  ```
- [ ] Chờ 1–2 phút để GitHub Actions hoàn tất việc deploy trang mới lên GitHub Pages.

### 3. Đăng Ký & Khai Báo Với Google Search Console
- [ ] Truy cập [Google Search Console](https://search.google.com/search-console).
- [ ] Đăng nhập tài khoản Google của bạn.
- [ ] Chọn **Add property** (Thêm tài nguyên) -> Chọn loại **URL prefix** (Tiền tố URL) -> Điền:
  ```
  https://haquangminhduc.github.io/
  ```
- [ ] Xác minh quyền sở hữu:
  - Phương pháp nhanh nhất: Chọn **HTML tag** -> Copy mã `<meta name="google-site-verification" content="..." />` dán vào thẻ `<head>` của `index.html` rồi commit push; HOẶC dùng liên kết tài khoản GitHub/Google Analytics nếu có.
- [ ] Sau khi xác minh thành công:
  - Vào mục **Sitemaps** (Sơ đồ trang web) ở menu bên trái.
  - Điền `sitemap.xml` vào ô *Thêm sơ đồ trang web mới* và bấm **Submit** (Gửi).

### 4. Khai Báo Với Bing Webmaster Tools (Tùy chọn nhưng khuyến khích)
- [ ] Truy cập [Bing Webmaster Tools](https://www.bing.com/webmasters).
- [ ] Đăng nhập và chọn **Import from Google Search Console** (Đồng bộ trực tiếp cực kỳ nhanh chóng mà không cần xác minh lại).

---

## 📝 III. HƯỚNG DẪN KIỂM TRA (VERIFY) TỪNG HẠNG MỤC

### 1. Kiểm Tra File Trực Tiếp Trên Trình Duyệt
Sau khi GitHub Pages build xong, hãy mở trực tiếp các đường dẫn sau:
- **robots.txt:** [https://haquangminhduc.github.io/robots.txt](https://haquangminhduc.github.io/robots.txt)
  *(Phải hiển thị nội dung `User-agent: *` và dòng trỏ tới `sitemap.xml`)*
- **sitemap.xml:** [https://haquangminhduc.github.io/sitemap.xml](https://haquangminhduc.github.io/sitemap.xml)
  *(Trình duyệt hiển thị cây XML gồm 5 URL)*

### 2. Kiểm Tra Hiển Thị Chia Sẻ Mạng Xã Hội (Social Preview / Open Graph)
- **Facebook Sharing Debugger:**
  1. Truy cập [Facebook Debugger](https://developers.facebook.com/tools/debug/)
  2. Dán link `https://haquangminhduc.github.io/` và bấm **Debug** (hoặc **Scrape Again** nếu link cũ còn lưu cache).
  3. Kiểm tra xem Tiêu đề, Mô tả và Ảnh đại diện đã hiển thị đúng chưa.
- **Trình xem trước OpenGraph:**
  1. Truy cập [OpenGraph.xyz](https://www.opengraph.xyz/url/https%3A%2F%2Fhaquangminhduc.github.io%2F)
  2. Xem giao diện xem trước đồng thời trên Facebook, Twitter/X, LinkedIn, Discord.

### 3. Kiểm Tra Dữ Liệu Có Cấu Trúc (Schema JSON-LD)
- **Google Rich Results Test:**
  1. Mở công cụ [Google Rich Results Test](https://search.google.com/test/rich-results)
  2. Nhập URL `https://haquangminhduc.github.io/` hoặc dán trực tiếp đoạn mã code của `index.html`.
  3. Bấm **Test URL** -> Đảm bảo không có lỗi (0 Errors, 0 Warnings).
- **Schema Markup Validator:**
  1. Mở [validator.schema.org](https://validator.schema.org/)
  2. Nhập URL trang web để kiểm tra thực thể `Person` và `WebSite`.

### 4. Yêu Cầu Thu Thập Dữ Liệu Ngay Lập Tức (Request Indexing)
- Trong Google Search Console, dán URL `https://haquangminhduc.github.io/` vào thanh tìm kiếm trên cùng (URL Inspection).
- Bấm **Request Indexing** (Yêu cầu lập chỉ mục) để bot của Google ghé thăm website trong vòng 24–48h thay vì phải chờ quét tự nhiên.
