# Ảnh pose nhân vật

`template/public/poses/` có sẵn bộ 10 pose mẫu (mọi pose trong bảng dưới, trừ `ok`). Muốn dùng nhân vật của bạn thì thay các ảnh này bằng ảnh cùng tên, theo quy cách sau.

## Quy cách ảnh
- File **PNG nền trong suốt**, kích thước **1220 × 1150 px**.
- Mọi ảnh để đầu nhân vật ở cùng vị trí và cùng cỡ (mặc định miệng ở khoảng x=694, y=452). Phần rộng thêm bên phải dành cho bàn tay giơ ra.
- Nên vẽ **miệng ngậm hoặc cười nhẹ**, vì video vẽ đè miệng mấp máy theo giọng.
- Đặt tên file đúng tên pose, ví dụ `think.png`, rồi thả vào `template/public/poses/`.

Có thể tạo bộ pose bằng công cụ tạo ảnh AI từ một ảnh chân dung: giữ cùng nhân vật, trang phục và nền trơn, rồi tách nền và căn cùng cỡ đầu.

## Tên pose

| Tên file | Biểu cảm / tư thế | Hợp với câu |
|---|---|---|
| `neutral.png` | Đứng yên, mặt bình thường | Tư thế chờ, chuyển ý |
| `point.png` | Chỉ tay vào nội dung | Giới thiệu thẻ, chỉ vào ví dụ |
| `palm.png` | Xoè bàn tay giải thích | Giải thích, liệt kê |
| `surprised.png` | Ngạc nhiên, miệng tròn "O" | Bất ngờ, "không phải…" |
| `thumbs.png` | Giơ ngón cái | Kêu gọi like, kết video |
| `think.png` | Tay chống cằm, nhìn lên | Câu hỏi |
| `warn.png` | Giơ tay "dừng / lưu ý" | Cảnh báo |
| `shrug.png` | Nhún vai, hai tay xoè | "Tuỳ bạn", "chưa chắc" |
| `happy.png` | Cười tươi | Điểm cộng, tin tốt |
| `ok.png` | Ngón tay OK | Xác nhận |
| `wave.png` | Vẫy tay chào | Mở đầu, lời chào |

Thiếu pose nào thì video tự dùng pose gần nghĩa (`FALLBACK` trong `src/data/poses.ts`). Chỉ cần 2–3 ảnh (ví dụ `point`, `palm`, `thumbs`) là đã dựng được video.

## Hiệu ứng tự có
- Miệng mấp máy theo âm lượng giọng, chớp mắt, thở, nhún theo nhịp nói, nhún khi gặp từ nhấn.
- Chuyển động riêng khi vừa đổi sang pose: `surprised`/`warn` rung ngang, `thumbs`/`happy`/`ok` nảy lên, `shrug` nhún vai, `point` gật nhẹ, `think`/`wave` lắc lư. Đổi kiểu chuyển động bằng trường `motion` trong `src/data/poses.ts`.

## Thêm pose mới
1. Thả ảnh vào `public/poses/`.
2. Nếu đầu lệch so với các ảnh khác: `npm run dev`, chọn composition **CanhMieng**, chọn pose, kéo các thông số cho dấu thập đỏ nằm giữa miệng (và mắt, nếu cần chớp mắt). Chép dòng hiện dưới khung vào `OVERRIDES` trong `src/data/poses.ts`. Pose nhắm mắt hoặc đeo kính che mắt thì thêm `blink: false`. Màu che miệng/mắt lấy theo màu da trong ảnh (`skin`).
3. Gán pose vào câu trong `buildPoses()` của `src/Video.tsx`.
4. Xuất video bằng `xuat-video.ps1` (script tự quét ảnh pose mới).
