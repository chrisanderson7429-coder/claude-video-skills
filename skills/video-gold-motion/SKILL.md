---
name: video-gold-motion
description: Dựng video motion graphics dọc 9:16 (Reels/TikTok/Shorts) phong cách nền đen ấm, nhấn vàng gold, không có người dẫn, bằng Remotion, từ một kịch bản và file giọng đọc. Dùng khi người dùng muốn làm video "motion graphic", "phong cách vàng gold", "video giải thích công cụ AI không có nhân vật", hoặc đưa kịch bản + voice và muốn dựng thành video chuyển cảnh nhanh, mượt.
---

# Video motion graphics vàng gold

Video dọc 1080×1920, 30 fps. Mọi hình ảnh là thành phần React trong Remotion, chuyển động tính theo frame. Thư mục `template/` là một dự án Remotion chạy được ngay, có một video ví dụ ("5 công cụ cho Claude", 8 đoạn, 46 cảnh ngắn).

## Phong cách (bắt buộc giữ)

- **Màu**: nền đen ấm `#0C0A07`, màu nhấn vàng gold `#D4A843` / sáng `#F0CE80`. Bảng màu nằm trong `K` ở `src/components/motion/kit.tsx`. Đỏ `K.warn` chỉ dùng cho cảnh báo, xanh `K.ok` cho "đạt".
- **Nền** (`DarkBg`): họa tiết art-deco hình thoi vàng rất nhạt trôi chậm, tia nắng hình quạt từ đáy, quầng vàng "thở", bụi vàng bay lên, vignette. Không đặt nền phẳng.
- **Chữ**: Be Vietnam Pro, in hoa, đậm cho tiêu đề. **Khoảng cách dòng ≥ 1.24** để dấu tiếng Việt không chạm dòng trên.
- **Mỗi đề mục (1, 2, 3…) có cảnh tiêu đề riêng** bằng `TitleCard`: số "01" thật to tô gradient vàng, vòng tia quay phía sau, tên đề mục và link GitHub bên dưới. Sau đó vào thẳng nội dung, **không** ghim lại tiêu đề.
- **Không giống slide**: mỗi cảnh ngắn **tối đa 6 giây**, trung bình khoảng 2,5–3 giây. Cắt cảnh đúng chỗ ngắt câu của giọng đọc. Mỗi ý có một hình ảnh động riêng (radar, sơ đồ nút, đồng hồ đếm, điện thoại, khoá…), không chỉ là thẻ chữ.
- **Phụ đề** (`DarkCaptions`): chữ trắng, căn giữa, khoảng y=1400. Từ trong `EMPHASIS` tô vàng, từng từ hiện ra theo giọng.

## Bộ thành phần (`src/components/motion/kit.tsx`)

| Thành phần | Dùng để |
|---|---|
| `Beats` | Chuỗi cảnh ngắn trong một đoạn: `list=[{ a: frame bắt đầu, t: kiểu chuyển cảnh, el: nội dung }]`. Kiểu chuyển: `whipL`, `whipR`, `zoom`, `rise`, `tilt`, `spin` (có nhòe chuyển động). Luân phiên các kiểu, đừng lặp một kiểu liên tục. |
| `TitleCard` | Cảnh tiêu đề đề mục: `n`, `name`, `repo`. |
| `KWords` | Chữ lớn bay vào từng từ; `hot` = từ tô vàng; xuống dòng bằng `\n`. |
| `Glass` | Thẻ kính tối; `on` = frame bắt đầu sáng viền; `tone="accent"` = thẻ vàng đặc; `tone="warn"` = thẻ đỏ. |
| `In`, `enter()` | Cho phần tử vào cảnh bằng spring + mờ → nét. |
| `Wire` | Đường nối tự vẽ, có chấm sáng chạy dọc (path SVG theo toạ độ 1080×1920). |
| `Tick`, `XMark` | Dấu tick / dấu X tự vẽ. |
| `Chip`, `Kicker`, `Big`, `Mono` | Nhãn viên thuốc, tiêu đề nhỏ, chữ lớn, chữ đơn cách. |
| `Typed`, `Counter`, `Cursor` | Chữ gõ dần, số chạy, con trỏ chuột bay tới và bấm. |
| `Ico`, `IcoTile` | Icon nét mảnh (`search`, `plan`, `brain`, `palette`, `git`, `lock`, `shield`, `gear`, `bug`, `folder`, `cloud`…). |
| `DarkShot` | Ảnh chụp trang web trong khung trình duyệt, có pan/zoom và khoanh vùng. |

## Quy trình

1. **Tạo video mới**: chép `src/videos/example` thành `src/videos/<ten>`, thêm `<Composition>` trong `src/Root.tsx`.
2. **Kịch bản** (`script.ts`): `PARAGRAPHS` gồm mỗi phần tử là một đoạn, viết **đúng nguyên văn lời đọc** để căn chữ khớp. `EMPHASIS` là các cụm cần tô vàng trong phụ đề, phải khớp từng chữ, kể cả dấu câu dính liền.
3. **Chưa có giọng**: `node scripts/fake-timeline.mjs src/videos/<ten>/script.ts src/videos/<ten>/words.json src/videos/<ten>/loudness.json` tạo mốc thời gian ước lượng để dựng và xem trước.
4. **Dựng cảnh** (`Scenes.tsx`): mỗi đoạn là một component nhận `{ end }` và trả về `<Beats end={end} list={[...]} />`. Lấy mốc bằng `const q = cues(p)`, rồi `q("cụm từ", lầnXuấtHiện, lệchFrame)` cho frame khi giọng bắt đầu nói cụm đó. Đoạn mở một đề mục thì cảnh đầu là `TitleCard`. Cập nhật `CUTS` trong `Video.tsx` (cụm mở đầu mỗi cảnh) để có tiếng "vút" lúc chuyển cảnh.
5. **Kiểm độ dài cảnh**: tính khoảng cách giữa các mốc bắt đầu cảnh. Cảnh nào trên 6 giây thì tách thêm.
6. **Nạp giọng**: `.\nap-giong.ps1 -Video <ten> -Giong <file> [-TocDo 0.9]` (cần `ffmpeg` trong PATH, hoặc truyền `-Ffmpeg <đường dẫn>`). Script chép giọng, nhận dạng bằng Whisper, căn chữ, đo âm lượng và bật `HAS_VOICE`. `-TocDo` dùng để làm chậm hoặc nhanh giọng.
7. **Tự soát**: render bản nhẹ `npx remotion render <Id> out/low.mp4 --scale=0.4 --muted`, rồi `node scripts/contact-sheet.mjs out/low.mp4 <mốc giây ở khoảng 75% mỗi cảnh>`. Xem từng ảnh và chấm theo các tiêu chí: chữ chồng chữ, tràn mép, đè phụ đề, dấu chạm dòng trên, con trỏ bấm lệch nút, cảnh trống. Sửa đến khi mọi cảnh đạt ≥ 8/10, rồi kiểm lại khung đã sửa bằng `npx remotion still`.
8. **Xuất**: `.\xuat-video.ps1 -Composition <Id>` → `out/<Id>.mp4`.

## Lưu ý kỹ thuật

- Mọi chuyển động phải dựa trên `useCurrentFrame()`. Không dùng CSS `transition`/`animation`.
- Toạ độ tuyệt đối theo khung 1080×1920. Vùng an toàn cho nội dung là y≈250–1300, vì phụ đề nằm quanh y=1400.
- Trên Windows, whisper.cpp không chạy trong đường dẫn có dấu tiếng Việt. `nap-giong.ps1` đã tự dùng `%LOCALAPPDATA%\remotion-whisper`.
- Tiếng hiệu ứng lấy từ `remotion.media` (cần mạng khi render).
