// Kịch bản video "5 công cụ cho Claude" bản motion graphics (nền tối, cam). Giọng: public/fivetools/voice.mp3
// Cụm từ trong EMPHASIS hiển thị bằng chữ serif nghiêng màu chủ đạo.
export const PARAGRAPHS: string[] = [
  "Không cần cài cả kho skill để dùng Claude tốt hơn. Năm công cụ này nhắm vào năm việc rất cụ thể: tìm skill, lập kế hoạch code, giữ ngữ cảnh, thiết kế giao diện, và rút kinh nghiệm từ việc lặp lại.",
  "Một, Find Skills. Bạn mô tả nhu cầu, như kiểm tra giao diện hay viết kiểm thử, agent sẽ tìm skill liên quan, trình bày lựa chọn và hỗ trợ cài. Tiện ở chỗ bớt phải lục cả thư viện. Nhưng tìm thấy chưa chắc đáng tin: hãy kiểm tra nguồn, nội dung và quyền trước khi cài.",
  "Hai, Superpowers. Đây là bộ quy trình cho agent lập trình: làm rõ yêu cầu và thiết kế trước, rồi lập kế hoạch, chú trọng kiểm thử, chia việc cho agent phụ và rà soát kết quả. Một số bước còn tùy môi trường của bạn. Giá trị của nó là quy trình bớt làm ẩu, chứ không phải lời hứa code luôn đúng.",
  "Ba, Claude-mem. Nó ghi lại và tổng hợp thông tin quan trọng từ các phiên làm việc, rồi đưa phần ngữ cảnh liên quan vào phiên sau, nên bạn đỡ phải nhắc lại. Nhưng nó không nhớ hoàn hảo, cũng không tự hiểu cả dự án. Với việc nhạy cảm, hãy kiểm tra dữ liệu nào được ghi, lưu ở đâu, dùng nhà cung cấp nào, và chi phí ra sao trước khi bật.",
  "Bốn, UI UX Pro Max. Nó cung cấp tri thức và quy trình thiết kế, giúp agent chọn phong cách, màu sắc, kiểu chữ thay vì tự đoán. Nhưng đẹp hay không vẫn tùy đề bài và cách triển khai, nên hãy kiểm tra trên điện thoại và khả năng tiếp cận.",
  "Năm, Task Observer. Có nhiều bản trùng tên, nên hãy xem đúng repo hiện trên màn hình. Nó quan sát quy trình trong những phiên được kích hoạt, ghi lại điểm vướng và thao tác lặp lại, rồi đề xuất tạo hoặc sửa skill. Quan trọng là nó không tự ý sửa skill bạn đang dùng: bạn rà soát và duyệt, và không có gì thành bản chính thức trước khi bạn cài bản cập nhật. Cài xong cũng chưa chắc chạy, còn cần cấu hình kích hoạt đúng môi trường.",
  "Năm công cụ giải năm nút thắt khác nhau, và không phải cái nào cũng là một skill đơn lẻ. Hãy bắt đầu từ chỗ bạn đang vướng, thử trên dữ liệu không nhạy cảm, kiểm tra quyền và chi phí rồi mới dùng rộng hơn. Không cần cài cả năm cùng lúc, và đừng lấy số sao làm bảo đảm chất lượng hay an toàn.",
  "Bạn đang vướng ở khâu nào: tìm skill, code, ghi nhớ hay thiết kế? Bình luận tên công cụ bạn muốn xem kỹ hơn, và theo dõi để xem thêm cách dùng thực tế.",
];

export const EMPHASIS: string[] = [
  "cả kho skill", "Năm công cụ", "rất cụ thể:",
  "Find Skills.", "mô tả nhu cầu,", "hỗ trợ cài.", "chưa chắc đáng tin:",
  "Superpowers.", "bộ quy trình", "kiểm thử,", "agent phụ", "bớt làm ẩu,", "code luôn đúng.",
  "Claude-mem.", "phiên sau,", "nhắc lại.", "không nhớ hoàn hảo,", "nhạy cảm,", "chi phí",
  "UI UX Pro Max.", "phong cách,", "màu sắc,", "kiểu chữ", "tự đoán.", "điện thoại", "khả năng tiếp cận.",
  "Task Observer.", "trùng tên,", "điểm vướng", "thao tác lặp lại,", "không tự ý sửa", "duyệt,", "cấu hình kích hoạt",
  "năm nút thắt", "chỗ bạn đang vướng,", "quyền và chi phí", "cả năm cùng lúc,", "số sao",
  "tìm skill,", "code,", "ghi nhớ", "thiết kế?", "Bình luận", "theo dõi",
];
