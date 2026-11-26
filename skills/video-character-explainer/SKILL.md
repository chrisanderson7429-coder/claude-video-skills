---
name: video-character-explainer
description: Dựng video giải thích dọc 9:16 (Reels/TikTok/Shorts) có nhân vật hoạt hình dẫn chuyện ở góc dưới, mấp máy môi theo giọng đọc và đổi tư thế theo ý câu, nền sáng, phụ đề hiện từng từ, bằng Remotion. Dùng khi người dùng muốn video "có nhân vật", "có MC hoạt hình", "nhân vật nói theo voice", hoặc đưa kịch bản + giọng đọc + bộ ảnh pose nhân vật.
---

# Video giải thích có nhân vật

Video dọc 1080×1920, 30 fps. Nội dung nằm ở nửa trên (thẻ, sơ đồ, ảnh chụp có khung). Nhân vật hoạt hình đứng góc dưới bên phải, miệng mấp máy theo âm lượng giọng, chớp mắt, nhún theo nhịp nói, đổi pose theo câu. Phụ đề lớn hiện từng từ ở phía trên. Thư mục `template/` là dự án Remotion chạy được ngay, có một video ví dụ 12 đoạn.

## Phong cách

- **Nền** sáng có chấm halftone mịn (`Background`). Màu chủ đạo và màu nền chỉnh được bằng props `mauChuDao`, `mauNen` (mặc định xanh ngọc `#0B6E6E` trên `#EAF0EE`).
- **Thẻ** viền đen đậm, bóng cứng lệch (kiểu neo-brutalism): `Card`, `Tag`, `Cross`, `Check`, `Arrow` trong `src/components/ui.tsx`.
- **Phụ đề** (`Captions`): chữ không chân, từ nhấn (`EMPHASIS`) dùng chữ serif nghiêng màu chủ đạo.
- **Ảnh chụp nguồn** (`Shot`): chỉ hiện ảnh chụp trang repo hoặc tài liệu đúng lúc giọng đọc **nhắc tên** công cụ, rồi chuyển sang giao diện mô phỏng dễ hiểu (bong bóng chat, hộp cài đặt, sơ đồ). Không chiếu README dài giữa phần giải thích.

## Nhân vật

- Ảnh pose đặt trong `public/poses/<tên-pose>.png`: PNG nền trong suốt, khung 1220×1150, đầu cùng vị trí giữa các ảnh. Danh sách tên pose và cách làm nằm trong `POSES.md`. Repo **không kèm ảnh**: người dùng tự đưa nhân vật của mình vào.
- Chưa có ảnh nào thì video vẫn chạy, chỉ không có nhân vật. Thiếu một pose thì tự dùng pose gần nghĩa (`FALLBACK` trong `src/data/poses.ts`).
- Ảnh mới lệch miệng hoặc mắt: mở Studio (`npm run dev`), chọn composition **CanhMieng**, kéo thông số cho dấu thập nằm giữa miệng, rồi chép dòng kết quả vào `OVERRIDES` trong `src/data/poses.ts`.
- Gán pose theo câu trong `buildPoses()` của `src/Video.tsx`: `{ at: P(đoạn, "cụm từ"), pose: "think" }`. Body language tự chạy theo pose: `warn`/`surprised` rung, `thumbs`/`happy` nảy, `shrug` nhún vai, `point` gật, `think`/`wave` lắc lư.

## Quy trình

1. **Kịch bản**: `src/data/script.ts` (`PARAGRAPHS` gồm mỗi phần tử là một đoạn/cảnh, viết đúng nguyên văn lời đọc; `EMPHASIS` là các cụm nhấn). Có thể làm nhiều video bằng cách tạo `src/videos/<ten>/` với `script.ts`, `Scenes.tsx`, `Video.tsx`, `words.json`, `loudness.json`, theo mẫu `src/Video.tsx`.
2. **Chưa có giọng**: `node scripts/fake-timeline.mjs src/data/script.ts src/data/words.json src/data/loudness.json` tạo mốc ước lượng để dựng trước.
3. **Dựng cảnh**: mỗi đoạn là một component trong `src/scenes/`. Lấy mốc bằng `const q = cues(p)` rồi `q("cụm từ")`. Cho phần tử vào đúng lúc giọng nhắc tới (`popIn`, `fadeIn`, `between` trong `src/lib.ts`).
4. **Nạp giọng**: `.\nap-giong.ps1 -Giong <file> [-TocDo 0.9]` cho video ví dụ, hoặc thêm `-Video <ten>` cho video trong `src/videos/<ten>`. Script nhận dạng bằng Whisper, căn chữ theo kịch bản, đo âm lượng cho khẩu hình và bật `HAS_VOICE`. Cần `ffmpeg` trong PATH, hoặc truyền `-Ffmpeg`.
5. **Tự soát**: render bản nhẹ (`--scale=0.4 --muted`), rồi `node scripts/contact-sheet.mjs out/low.mp4 <mốc giây>`. Kiểm: nhân vật che nội dung, chữ tràn khung, thẻ đè phụ đề, pose sai ý câu. Sửa đến khi đạt ≥ 8/10.
6. **Xuất**: `.\xuat-video.ps1 -Composition CharacterExample` (tự quét ảnh pose trước khi render). Đổi màu bằng props trong Remotion Studio.

## Lưu ý kỹ thuật

- Mọi chuyển động dựa trên `useCurrentFrame()`. Không dùng CSS animation.
- Vùng nội dung y≈450–1250. Nhân vật chiếm góc dưới phải, phụ đề nằm quanh y=250.
- URL dài trong kịch bản nên tách bằng dấu cách (ví dụ `github.com/user/ repo-name`) để phụ đề không tràn khung.
- Trên Windows, whisper.cpp không chạy trong đường dẫn có dấu tiếng Việt. Script đã tự dùng `%LOCALAPPDATA%\remotion-whisper`.
