import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONO, SANS } from "../theme";
import { Card, Tag, Cross, Strike, Arrow, Em, Mono, Check } from "../components/ui";
import { Icon, LiveFace, Waveform } from "../components/icons";
import { between } from "../lib";
import { cues } from "./common";

const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16 };

/* 1 · Hook: MC livestream không người dẫn */
export const S1: React.FC = () => {
  const q = cues(0);
  return (
    <>
      <Card at={0} x={90} y={500} w={360} h={540} dark rot={-3} pad={24}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <span style={{ background: "#E0314B", color: "#fff", fontWeight: 700, fontSize: 26, padding: "6px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>● LIVE</span>
          <Mono size={22} color="#BDB8AE">2.4K xem</Mono>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}><LiveFace size={230} /></div>
        <div style={{ textAlign: "center", marginTop: 34, fontSize: 30, fontWeight: 700 }}>MC AI</div>
      </Card>
      <Card at={q("trả lời chat")} x={520} y={510} w={470} pad={22}>
        <Mono size={22}>@khach_moi</Mono>
        <div style={{ fontSize: 32, fontWeight: 600, marginTop: 6 }}>MC ơi, hôm nay live gì vậy?</div>
      </Card>
      <Card at={q("trả lời chat", 0, 8)} x={560} y={660} w={430} pad={22} bg={C.accent}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>Chào bạn! Mình kể chuyện AI nha</div>
      </Card>
      <Tag at={q("người xem quen")} x={540} y={808} tone="light" size={30}>★ Người xem quen · @minhanh</Tag>
      <Tag at={q("theo lịch")} x={540} y={890} tone="ink" size={30} mono>20:00 · lên sóng</Tag>
      <Card at={q("dù phía sau")} x={540} y={965} w={450} pad={18}>
        <div style={row}><Icon name="mic" size={40} /><span style={{ fontSize: 32, fontWeight: 700 }}>Người dẫn trực tiếp</span></div>
      </Card>
      <Strike at={q("không có người dẫn")} x={560} y={1005} w={410} />
    </>
  );
};

/* 2 · Repo open-yoki: nền tảng, không phải MC tải về là chạy */
export const S2: React.FC = () => {
  const q = cues(1);
  const out = q("không phải", 0, -4);
  const blocks = ["Giọng nói", "Hình ảnh", "Chat", "Bộ nhớ"];
  return (
    <>
      <Card at={0} x={90} y={500} w={900} h={230} pad={30}>
        <div style={row}>
          <Icon name="repo" size={52} />
          <span style={{ fontSize: 44 }}>jacke-pp / <b>open-yoki</b></span>
          <span style={{ marginLeft: "auto", border: `2px solid ${C.muted}`, color: C.muted, borderRadius: 999, padding: "4px 16px", fontSize: 24 }}>Public</span>
        </div>
        <div style={{ ...row, marginTop: 34, gap: 30, fontSize: 28, color: C.muted }}>
          <span style={row}><Icon name="star" size={30} color={C.muted} /> Star</span>
          <Mono size={26}>README.md</Mono>
          <Mono size={26}>app/</Mono>
        </div>
      </Card>
      <Tag at={q("github.com/jacke-pp/open-yoki.")} x={110} y={765} tone="ink" mono size={32}>github.com/jacke-pp/open-yoki</Tag>
      {blocks.map((b, k) => (
        <Card key={b} at={q("nền tảng") + k * 4} x={90 + k * 228} y={860} w={200} h={110} pad={16} out={out}>
          <div style={{ fontSize: 30, fontWeight: 700, textAlign: "center", marginTop: 14 }}>{b}</div>
        </Card>
      ))}
      <Tag at={q("của riêng mình,")} x={300} y={990} size={32} rot={-2}>MC AI của riêng bạn</Tag>
      <Card at={q("không phải", 0, 2)} x={150} y={850} w={780} pad={24} rot={1}>
        <div style={row}><Icon name="download" size={52} /><span style={{ fontSize: 38, fontWeight: 700 }}>MC hoàn chỉnh, tải về là chạy</span></div>
      </Card>
      <Cross at={q("tải về là chạy.")} x={800} y={820} size={130} />
    </>
  );
};

/* 3 · Giọng nói */
export const S3: React.FC = () => {
  const q = cues(2);
  const f = useCurrentFrame();
  return (
    <>
      <Card at={0} x={60} y={500} w={430} h={150} pad={24}>
        <div style={row}><Icon name="brain" size={52} /><div><div style={{ fontSize: 34, fontWeight: 700 }}>Mô hình trả lời</div><Mono>câu trả lời</Mono></div></div>
      </Card>
      <Arrow at={q("với")} from={[500, 575]} to={[572, 575]} dur={6} />
      <Card at={q("dịch vụ")} x={585} y={500} w={435} h={150} pad={24}>
        <div style={row}><Icon name="mic" size={52} /><div><div style={{ fontSize: 32, fontWeight: 700 }}>Tổng hợp giọng</div><Mono>+ nhân bản giọng</Mono></div></div>
      </Card>
      <Card at={q("nhân bản giọng.")} x={150} y={690} w={780} h={140} pad={26}>
        <Waveform w={720} h={84} active={f > q("nhân bản giọng.")} />
      </Card>
      {["vui vẻ", "trầm tĩnh", "hào hứng"].map((t, k) => (
        <Tag key={t} at={q("sắc thái") + k * 5} x={110 + k * 290} y={862} tone={k === 2 ? "accent" : "light"} size={32}>{t}</Tag>
      ))}
      <Card at={q("tiếng đệm")} x={110} y={950} w={680} pad={22} rot={-1.5}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <span style={{ fontSize: 36 }}><Em size={40}>“Ừm… để mình xem nha”</Em></span>
          <Mono size={22}>đang chờ…</Mono>
        </div>
      </Card>
    </>
  );
};

/* 4 · Hình ảnh: khuôn mặt số + clip chuẩn bị trước */
export const S4: React.FC = () => {
  const q = cues(3);
  return (
    <>
      <Card at={0} x={70} y={500} w={420} h={540} dark pad={24}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <Mono size={24} color="#BDB8AE">khuôn mặt số</Mono>
          <span style={{ background: "#E0314B", color: "#fff", fontWeight: 700, fontSize: 24, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>● LIVE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}><LiveFace size={300} /></div>
      </Card>
      <Card at={q("vẫy tay")} x={545} y={505} w={460} h={120} pad={20}>
        <div style={row}><Icon name="play" size={46} color={C.accent} /><span style={{ fontFamily: MONO, fontSize: 34 }}>vay-tay.mp4</span></div>
      </Card>
      <Card at={q("nhảy")} x={545} y={650} w={460} h={120} pad={20}>
        <div style={row}><Icon name="play" size={46} color={C.accent} /><span style={{ fontFamily: MONO, fontSize: 34 }}>nhay.mp4</span></div>
      </Card>
      <Tag at={q("chuẩn bị trước")} x={560} y={792} size={30}>clip chuẩn bị trước</Tag>
      <Arrow at={q("được gọi")} from={[560, 830]} to={[500, 700]} bend={0.3} />
      <Tag at={q("ngữ cảnh,")} x={600} y={870} tone="ink" size={30}>gọi theo ngữ cảnh</Tag>
      <Card at={q("không phải mọi")} x={545} y={950} w={460} pad={20}>
        <span style={{ fontSize: 32, fontWeight: 700 }}>Mọi cử động tự sinh tức thì</span>
      </Card>
      <Strike at={q("tự sinh tức thì.")} x={560} y={990} w={420} />
    </>
  );
};

/* 5 · Chat → máy chủ → MC; nguồn đọc chat kết nối riêng */
export const S5: React.FC = () => {
  const q = cues(4);
  const msgs = ["Hello MC!", "Hát một bài đi", "Mai live mấy giờ?"];
  const f = useCurrentFrame();
  const srcAt = q("Nguồn đọc chat");
  const shift = between(f, srcAt - 4, srcAt + 6, 0, 1);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - shift * 0.0, translate: `0px ${-shift * 0}px` }}>
        {msgs.map((m, k) => (
          <Card key={m} at={k * 5} x={60} y={500 + k * 100} w={330} pad={16} rot={k % 2 ? 1.5 : -1.5} out={srcAt - 2}>
            <span style={{ fontSize: 28, fontWeight: 600 }}>{m}</span>
          </Card>
        ))}
        <Arrow at={q("máy chủ", 0, -6)} from={[400, 640]} to={[470, 640]} dur={6} />
        <Card at={q("máy chủ")} x={480} y={530} w={260} h={220} dark pad={22} out={srcAt - 2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 14 }}>
            <Icon name="server" size={80} color="#F4F1EA" /><span style={{ fontSize: 32, fontWeight: 700 }}>Máy chủ</span>
          </div>
        </Card>
        <Arrow at={q("phản hồi.", 0, -4)} from={[750, 640]} to={[800, 640]} dur={6} />
        <Card at={q("phản hồi.")} x={810} y={555} w={200} h={190} pad={14} out={srcAt - 2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><LiveFace size={120} /><b style={{ fontSize: 28 }}>MC</b></div>
        </Card>
      </div>
      <Card at={srcAt} x={70} y={520} w={940} pad={30}>
        <div style={{ fontSize: 38, fontWeight: 700 }}>Nguồn đọc chat · <Em size={44}>kết nối riêng</Em></div>
      </Card>
      <Card at={q("API chính thức")} x={70} y={690} w={940} pad={22}>
        <div style={row}><span style={{ fontSize: 34, fontWeight: 600 }}>API chính thức</span></div>
      </Card>
      <Check at={q("API chính thức", 0, 4)} x={920} y={705} />
      <Card at={q("chương trình")} x={70} y={800} w={940} pad={22}>
        <div style={row}><span style={{ fontSize: 34, fontWeight: 600 }}>Chương trình lấy bình luận hợp lệ</span></div>
      </Card>
      <Check at={q("chương trình", 0, 8)} x={920} y={815} />
      <Card at={q("không tự đăng nhập")} x={70} y={910} w={940} pad={22}>
        <span style={{ fontSize: 34, fontWeight: 600, color: C.muted }}>Bộ mã tự đăng nhập mọi nền tảng</span>
      </Card>
      <Strike at={q("không tự đăng nhập", 0, 6)} x={90} y={950} w={560} />
      <Cross at={q("không tự đăng nhập", 0, 6)} x={905} y={915} size={86} />
    </>
  );
};

/* 6 · Bộ nhớ Markdown */
export const S6: React.FC = () => {
  const q = cues(5);
  const out = q("Nhờ đó,", 0, -3);
  const files = [
    { at: q("tâm trạng,"), name: "tam-trang.md", h: "# Tâm trạng", l: ["- vui: vừa đạt 1k follow", "- hơi mệt sau 3h live"] },
    { at: q("nhật ký,"), name: "nhat-ky.md", h: "# Nhật ký", l: ["- 20/11: kể chuyện AI", "- 21/11: hát theo yêu cầu"] },
    { at: q("ghi chú"), name: "nguoi-xem.md", h: "# Người xem quen", l: ["- @minhanh: thích nhạc", "- @tuan: hỏi về code"] },
  ];
  return (
    <>
      <Tag at={0} x={90} y={500} tone="ink" size={30}>Bộ nhớ (tùy chọn)</Tag>
      {files.map((fl, k) => (
        <Card key={fl.name} at={fl.at} x={70 + k * 320} y={600 - (k === 1 ? 20 : 0)} w={300} h={360} pad={22} rot={[-4, 1, 5][k]} out={out}>
          <div style={row}><Icon name="file" size={34} /><Mono size={22} color={C.ink}>{fl.name}</Mono></div>
          <div style={{ fontFamily: MONO, fontSize: 24, marginTop: 22, color: C.accent }}>{fl.h}</div>
          {fl.l.map((x) => <div key={x} style={{ fontFamily: MONO, fontSize: 20, marginTop: 12, color: "#444" }}>{x}</div>)}
        </Card>
      ))}
      <Tag at={q("Markdown.")} x={640} y={500} size={32}>.md · Markdown</Tag>
      {["Buổi 1", "Buổi 2", "Buổi 3"].map((b, k) => (
        <Card key={b} at={q("tiếp tục") + k * 5} x={90 + k * 330} y={620} w={250} h={130} pad={20}>
          <div style={{ fontSize: 34, fontWeight: 700, textAlign: "center", marginTop: 16 }}>{b}</div>
        </Card>
      ))}
      <Arrow at={q("tiếp tục", 0, 3)} from={[345, 685]} to={[415, 685]} dur={5} />
      <Arrow at={q("tiếp tục", 0, 8)} from={[675, 685]} to={[745, 685]} dur={5} />
      <Tag at={q("trò chuyện,")} x={260} y={790} size={32}>nhớ ngữ cảnh, nói tiếp</Tag>
      <Card at={q("bắt đầu")} x={330} y={890} w={420} h={160} pad={18} rot={-2}>
        <div style={{ ...row, justifyContent: "center" }}><span style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>0</span><span style={{ fontSize: 30 }}>bắt đầu lại từ đầu</span></div>
      </Card>
      <Cross at={q("số không.")} x={640} y={880} size={130} />
    </>
  );
};

export const _unused = SANS;

