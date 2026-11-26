# Claude Video Skills

Hai skill cho [Claude Code](https://claude.com/claude-code) để dựng video dọc 9:16 (Reels, TikTok, Shorts) bằng [Remotion](https://www.remotion.dev/), từ một kịch bản tiếng Việt và file giọng đọc.

| Skill | Phong cách |
|---|---|
| [`video-gold-motion`](skills/video-gold-motion/SKILL.md) | Motion graphics nền đen, nhấn vàng gold, không có người dẫn. Mỗi đề mục có cảnh tiêu đề "01" lớn, cảnh chuyển liên tục (tối đa 6 giây), chữ bay vào từng từ, sơ đồ tự vẽ, phụ đề theo giọng. |
| [`video-character-explainer`](skills/video-character-explainer/SKILL.md) | Nền sáng, nhân vật hoạt hình dẫn chuyện ở góc dưới, mấp máy môi theo giọng, đổi tư thế theo câu. Thẻ viền đậm, phụ đề lớn hiện từng từ. Bạn tự đưa ảnh nhân vật của mình vào (xem [POSES.md](skills/video-character-explainer/POSES.md)). |

Mỗi skill gồm `SKILL.md` (hướng dẫn cho Claude) và `template/`, một dự án Remotion chạy được ngay, có sẵn video ví dụ.

## Cài đặt

**Dạng plugin (khuyên dùng).** Trong Claude Code, chạy:

```
/plugin marketplace add <owner>/claude-video-skills
/plugin install claude-video-skills@claude-video-skills
```

Thay `<owner>` bằng tên tài khoản GitHub chứa repo này.

**Hoặc chép tay.** Chép thư mục `skills/video-gold-motion` và/hoặc `skills/video-character-explainer` vào `~/.claude/skills/`, hoặc vào `.claude/skills/` của dự án.

Sau đó chỉ cần nói với Claude, ví dụ: *"Dựng video phong cách vàng gold từ kịch bản này và file giọng `voice.mp3`"*.

## Yêu cầu

- Node.js 18 trở lên
- [ffmpeg](https://ffmpeg.org/) trong PATH, để nạp giọng và soát khung hình
- Windows PowerShell để chạy `nap-giong.ps1` / `xuat-video.ps1`. Trên macOS/Linux có thể chạy trực tiếp các lệnh `node scripts/...` và `npx remotion ...` mà hai script đó gọi.

## Chạy thử template

```bash
cd skills/video-gold-motion/template      # hoặc video-character-explainer/template
npm install
npm run dev                               # mở Remotion Studio
npx remotion render GoldExample out/example.mp4
```

Video ví dụ chưa kèm giọng đọc (`HAS_VOICE = false`). Nạp giọng của bạn bằng `nap-giong.ps1` (xem SKILL.md).

## Giấy phép

MIT. Âm thanh hiệu ứng tải từ `remotion.media` khi render. Font lấy từ Google Fonts qua `@remotion/google-fonts`. Remotion có [giấy phép riêng](https://www.remotion.dev/docs/license): miễn phí cho cá nhân và công ty nhỏ.
