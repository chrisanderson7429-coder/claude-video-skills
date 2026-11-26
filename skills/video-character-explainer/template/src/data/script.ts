// Kịch bản gốc, mỗi phần tử là một đoạn (một cảnh).
// Cụm từ trong EMPHASIS được hiển thị bằng chữ serif nghiêng màu đỏ rượu, như video gốc.
export const PARAGRAPHS: string[] = [
  "Một MC livestream có thể trả lời chat, nhận ra người xem quen và lên sóng theo lịch, dù phía sau không có người dẫn trực tiếp.",
  "Bộ mã đứng sau ý tưởng đó là open-yoki, tại github.com/jacke-pp/open-yoki. Repo này cung cấp nền tảng để bạn dựng MC AI của riêng mình, không phải một MC hoàn chỉnh tải về là chạy.",
  "Về giọng nói, hệ thống kết hợp mô hình trả lời với dịch vụ tổng hợp, nhân bản giọng. Cách nói có thể thay đổi theo sắc thái câu trả lời, thậm chí chèn tiếng đệm ngắn trong lúc chờ phản hồi.",
  "Về hình ảnh, khuôn mặt số có thể chuyển động lúc phát trực tiếp. Những động tác như vẫy tay hoặc nhảy dùng các clip chuẩn bị trước và được gọi theo ngữ cảnh, không phải mọi cử động đều tự sinh tức thì.",
  "Chat từ phòng live được đưa vào máy chủ để MC phản hồi. Nguồn đọc chat cần được kết nối riêng, chẳng hạn qua API chính thức hoặc một chương trình lấy bình luận hợp lệ; bộ mã không tự đăng nhập mọi nền tảng để đọc chat.",
  "Phần bộ nhớ tùy chọn lưu tâm trạng, nhật ký, ghi chú về người xem quen bằng các tệp Markdown. Nhờ đó, MC có ngữ cảnh để tiếp tục trò chuyện, thay vì mỗi buổi phát lại bắt đầu từ số không.",
  "Hệ thống còn hỗ trợ lên lịch phát và kết thúc buổi live, cùng luồng bài đăng tự động khi bạn cấu hình dịch vụ, tài khoản và quyền cần thiết. Không phải chỉ cài repo là nó tự mở live trên mọi nền tảng.",
  "Muốn thử, vào github.com/jacke-pp/open-yoki, đọc README và mục Try it locally. Máy cần Node.js 22 trở lên cùng ffmpeg; vào thư mục app, chạy npm install, npm test, rồi khởi động host mẫu theo hướng dẫn.",
  "Khi chưa cấp khóa dịch vụ, phần trả lời, giọng nói và khuôn mặt chuyển động chưa hoạt động đầy đủ.",
  "Lưu ý: mã nguồn mở không đồng nghĩa vận hành miễn phí. Khuôn mặt số thời gian thực, giọng nói và mô hình AI có thể dùng dịch vụ tính phí; hãy kiểm tra bảng chi phí trong README trước khi triển khai.",
  "Bản công khai cũng không kèm khuôn mặt, giọng, tính cách hay tài khoản của MC gốc. Bạn cần tự chuẩn bị nhân vật, hình ảnh, giọng và cấu hình cho kênh của mình, đồng thời chỉ dùng hình ảnh và giọng nói khi có quyền.",
  "Nếu bạn làm kênh live bằng AI, bạn muốn MC nhớ người xem hay trả lời chat tốt hơn? Bình luận lựa chọn của bạn, chia sẻ video cho người đang tìm hiểu và theo dõi kênh nhé.",
];

export const EMPHASIS: string[] = [
  "trả lời chat", "người xem quen", "theo lịch", "không có người dẫn",
  "open-yoki,", "nền tảng", "của riêng mình,", "tải về là chạy.",
  "giọng nói,", "nhân bản giọng.", "sắc thái", "tiếng đệm",
  "hình ảnh,", "khuôn mặt số", "chuẩn bị trước", "ngữ cảnh,", "tự sinh tức thì.",
  "máy chủ", "kết nối riêng,", "API chính thức", "không tự đăng nhập",
  "bộ nhớ", "Markdown.", "số không.",
  "lên lịch phát", "bài đăng tự động", "mọi nền tảng.",
  "README", "Try it locally.", "Node.js 22", "ffmpeg;", "npm install,", "npm test,",
  "khóa dịch vụ,", "chưa hoạt động",
  "mã nguồn mở", "miễn phí.", "tính phí;", "bảng chi phí",
  "không kèm", "tự chuẩn bị", "có quyền.",
  "nhớ người xem", "trả lời chat tốt hơn?", "Bình luận", "chia sẻ", "theo dõi",
];
