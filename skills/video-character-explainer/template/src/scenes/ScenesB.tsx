import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONO } from "../theme";
import { Card, Tag, Cross, Strike, Em, Mono, Check } from "../components/ui";
import { Icon } from "../components/icons";
import { between, popIn } from "../lib";
import { cues } from "./common";

const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16 };

/* 7 · Lên lịch, bài đăng tự động, cần cấu hình */
export const S7: React.FC = () => {
  const q = cues(6);
  const f = useCurrentFrame();
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <>
      <Card at={0} x={70} y={500} w={470} h={400} pad={24}>
        <div style={row}><Icon name="calendar" size={40} /><b style={{ fontSize: 32 }}>Lịch live</b></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, marginTop: 20 }}>
          {days.map((d, k) => (
            <div key={d} style={{ textAlign: "center", fontFamily: MONO, fontSize: 22, padding: "10px 0", borderRadius: 10, background: k === 2 && f > q("lên lịch phát") ? C.accent : "#F1EEE7", color: k === 2 && f > q("lên lịch phát") ? "#fff" : C.ink }}>{d}</div>
          ))}
        </div>
      </Card>
      <Tag at={q("lên lịch phát")} x={100} y={700} tone="light" mono size={28}>20:00 · bắt đầu</Tag>
      <Tag at={q("kết thúc")} x={100} y={790} tone="ink" mono size={28}>22:00 · kết thúc</Tag>
      {["Thông báo lên sóng", "Tóm tắt buổi live"].map((t, k) => (
        <Card key={t} at={q("bài đăng tự động") + k * 6} x={600} y={500 + k * 135} w={410} h={115} pad={18} rot={k ? 1.5 : -1.5}>
          <Mono size={20}>bài đăng tự động</Mono>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{t}</div>
        </Card>
      ))}
      <Tag at={q("dịch vụ,")} x={600} y={800} size={28}>dịch vụ</Tag>
      <Tag at={q("tài khoản")} x={770} y={800} size={28}>tài khoản</Tag>
      <Tag at={q("quyền")} x={600} y={880} size={28}>quyền cần thiết</Tag>
      <Card at={q("Không phải chỉ")} x={90} y={955} w={900} pad={20} rot={-1}>
        <span style={{ fontSize: 34, fontWeight: 700 }}>Cài repo → tự mở live trên mọi nền tảng</span>
      </Card>
      <Strike at={q("mọi nền tảng.")} x={110} y={993} w={830} />
    </>
  );
};

/* 8 · Thử trên máy: terminal */
const Line: React.FC<{ at: number; text: string; prompt?: boolean; color?: string }> = ({ at, text, prompt = true, color = "#F4F1EA" }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.floor(between(f, at, at + 14, 0, text.length));
  return (
    <div style={{ fontFamily: MONO, fontSize: 30, color, marginTop: 14, whiteSpace: "pre" }}>
      {prompt && <span style={{ color: "#E7A0B3" }}>$ </span>}{text.slice(0, n)}
    </div>
  );
};
export const S8: React.FC = () => {
  const q = cues(7);
  return (
    <>
      <Card at={0} x={60} y={500} w={960} h={560} dark pad={28}>
        <div style={{ ...row, gap: 10 }}>
          {["#E0314B", "#E8B13B", "#3CB371"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
          <Mono size={22} color="#BDB8AE">terminal</Mono>
        </div>
        <Line at={q("vào", 0, 2)} text="github.com/jacke-pp/open-yoki" prompt={false} color="#9FC2FF" />
        <Line at={q("README")} text="README.md  →  Try it locally" prompt={false} color="#F4F1EA" />
        <Line at={q("Node.js 22")} text="✓ Node.js ≥ 22    ✓ ffmpeg" prompt={false} color="#8FD6A4" />
        <Line at={q("vào thư mục")} text="cd app" />
        <Line at={q("npm install,")} text="npm install" />
        <Line at={q("npm test,")} text="npm test" />
        <Line at={q("khởi động")} text="# khởi động host mẫu theo hướng dẫn" prompt={false} color="#BDB8AE" />
      </Card>
      <Tag at={q("Try it locally.")} x={640} y={470} size={28} rot={3}>mục Try it locally</Tag>
    </>
  );
};

/* 9 · Chưa có khóa dịch vụ */
export const S9: React.FC = () => {
  const q = cues(8);
  const f = useCurrentFrame();
  const off = q("chưa hoạt động");
  const feats = ["Trả lời", "Giọng nói", "Khuôn mặt chuyển động"];
  return (
    <>
      <Card at={0} x={70} y={520} w={330} h={330} pad={24} rot={-3}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: 20 }}>
          <Icon name="key" size={120} color={C.accent} />
          <b style={{ fontSize: 32, textAlign: "center" }}>Khóa dịch vụ</b>
          <Mono size={24}>chưa cấp</Mono>
        </div>
      </Card>
      {feats.map((t, k) => (
        <Card key={t} at={q("phần trả lời") + k * 6} x={450} y={520 + k * 130} w={560} h={110} pad={20}>
          <div style={{ ...row, justifyContent: "space-between", opacity: f > off ? 0.45 : 1 }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{t}</span>
          </div>
        </Card>
      ))}
      {feats.map((t, k) => (
        <Tag key={t + "x"} at={off + k * 3} x={700} y={600 + k * 130} tone="accent" size={22} rot={-3}>chưa hoạt động</Tag>
      ))}
    </>
  );
};

/* 10 · Mã nguồn mở ≠ miễn phí */
export const S10: React.FC = () => {
  const q = cues(9);
  const f = useCurrentFrame();
  const neq = popIn(f, q("không đồng nghĩa"));
  return (
    <>
      <Tag at={0} x={90} y={500} tone="ink" size={30}>Lưu ý</Tag>
      <Card at={q("mã nguồn mở")} x={70} y={580} w={940} h={190} pad={26}>
        <div style={{ ...row, justifyContent: "center", gap: 30, marginTop: 6 }}>
          <span style={{ fontSize: 64, fontWeight: 700 }}>Mã nguồn mở</span>
          <span style={{ fontSize: 96, fontWeight: 700, color: C.accent, scale: String(neq), lineHeight: 1 }}>≠</span>
          {f >= q("miễn phí.") && <Em size={80}>miễn phí</Em>}
        </div>
      </Card>
      {["Khuôn mặt số thời gian thực", "Giọng nói", "Mô hình AI"].map((t, k) => (
        <Card key={t} at={q("Khuôn mặt số") + k * 7} x={70 + k * 320} y={815} w={300} h={130} pad={18} rot={[-2, 1, -1][k]}>
          <div style={row}><Icon name="coin" size={42} color={C.accent} /><span style={{ fontSize: 26, fontWeight: 700 }}>{t}</span></div>
        </Card>
      ))}
      <Tag at={q("tính phí;")} x={640} y={958} size={28} rot={-3}>có thể tính phí</Tag>
      <Tag at={q("bảng chi phí")} x={90} y={985} tone="light" mono size={28}>README → bảng chi phí</Tag>
      <Check at={q("trước khi triển khai.")} x={510} y={985} size={60} />
    </>
  );
};

/* 11 · Bản công khai không kèm nhân vật gốc; tự chuẩn bị, chỉ dùng khi có quyền */
export const S11: React.FC = () => {
  const q = cues(10);
  const out = q("Bạn cần", 0, -3);
  const items = [
    { t: "Khuôn mặt", at: q("khuôn mặt,") },
    { t: "Giọng", at: q("giọng,") },
    { t: "Tính cách", at: q("tính cách") },
    { t: "Tài khoản", at: q("tài khoản") },
  ];
  const prep = [
    { t: "Nhân vật", at: q("nhân vật,") },
    { t: "Hình ảnh", at: q("hình ảnh,") },
    { t: "Giọng", at: q("giọng và") },
    { t: "Cấu hình kênh", at: q("cấu hình") },
  ];
  return (
    <>
      <Card at={0} x={70} y={500} w={940} h={300} pad={26} out={out}>
        <div style={row}><Icon name="repo" size={40} /><b style={{ fontSize: 34 }}>Bản công khai</b><Mono size={24}>không kèm của MC gốc:</Mono></div>
      </Card>
      {items.map((it, k) => (
        <React.Fragment key={it.t}>
          <Card at={it.at} x={100 + k * 228} y={620} w={200} h={130} pad={14} out={out}>
            <div style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginTop: 30 }}>{it.t}</div>
          </Card>
          {it.at + 6 < out && <Cross at={it.at + 6} x={150 + k * 228} y={625} size={110} until={out} />}
        </React.Fragment>
      ))}
      <Card at={q("Bạn cần")} x={70} y={500} w={620} h={440} pad={28}>
        <b style={{ fontSize: 36 }}>Bạn <Em size={42}>tự chuẩn bị</Em>:</b>
        {prep.map((p) => (
          <div key={p.t} style={{ ...row, marginTop: 22, height: 56 }}>
            <div style={{ width: 56 }} />
            <span style={{ fontSize: 34, fontWeight: 600 }}>{p.t}</span>
          </div>
        ))}
      </Card>
      {prep.map((p, k) => <Check key={p.t} at={p.at} x={100} y={588 + k * 78} />)}
      <Card at={q("chỉ dùng")} x={560} y={960} w={460} pad={20} rot={2} bg={C.accent}>
        <div style={{ ...row, color: "#fff" }}><Icon name="shield" size={48} color="#fff" /><b style={{ fontSize: 32 }}>Chỉ dùng khi có quyền</b></div>
      </Card>
    </>
  );
};

/* 12 · CTA: A/B + bình luận, chia sẻ, theo dõi */
export const S12: React.FC = () => {
  const q = cues(11);
  const f = useCurrentFrame();
  const aOn = f >= q("nhớ người xem") && f < q("hay");
  const bOn = f >= q("hay");
  const pill = (on: boolean) => ({ width: 74, height: 74, borderRadius: 18, border: `4px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700, background: on ? C.accent : "#F1EEE7", color: on ? "#fff" : C.ink, flexShrink: 0 } as React.CSSProperties);
  return (
    <>
      <Card at={0} x={70} y={500} w={940} h={400} pad={30}>
        <Mono size={24}>vote · bạn chọn gì?</Mono>
        <div style={{ ...row, marginTop: 28, opacity: f >= q("nhớ người xem") ? 1 : 0.25 }}>
          <div style={pill(aOn)}>A</div><span style={{ fontSize: 40, fontWeight: 700 }}>MC <Em size={46}>nhớ người xem</Em></span>
        </div>
        <div style={{ ...row, marginTop: 30, opacity: f >= q("trả lời chat") ? 1 : 0.25 }}>
          <div style={pill(bOn)}>B</div><span style={{ fontSize: 40, fontWeight: 700 }}>MC <Em size={46}>trả lời chat tốt hơn</Em></span>
        </div>
      </Card>
      <Tag at={q("Bình luận")} x={90} y={950} size={32}><span style={row}><Icon name="comment" size={34} color="#fff" />Bình luận</span></Tag>
      <Tag at={q("chia sẻ")} x={380} y={950} tone="light" size={32}><span style={row}><Icon name="share" size={34} />Chia sẻ</span></Tag>
      <Tag at={q("theo dõi")} x={90} y={1040} tone="ink" size={32}><span style={row}><Icon name="bell" size={34} color="#fff" />Theo dõi kênh</span></Tag>
    </>
  );
};
