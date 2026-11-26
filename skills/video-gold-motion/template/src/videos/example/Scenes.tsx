// Video "5 công cụ" bản motion graphics nền tối. Mỗi đoạn kịch bản được chia thành nhiều cảnh ngắn (≤ 5 giây),
// cắt đúng chỗ ngắt câu của giọng đọc. q("cụm từ") = frame (trong đoạn) khi giọng bắt đầu nói cụm đó.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cues } from "../../scenes/common";
import {
  K, FONT, Beats, Big, Chip, Counter, Cursor, Glass, Ico, IcoTile, In, Kicker, KWords, Mono, Tick, TitleCard, Typed, Wire, XMark, enter, lerp, spr,
} from "../../components/motion/kit";

type SceneProps = { end: number };
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 22 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" };

/** Dòng bước: ô icon + nhãn, sáng viền khi tới lượt, tick khi xong. */
const StepRow: React.FC<{ at: number; on: number; off?: number; y: number; icon: string; label: string; sub?: string; x?: number; w?: number; h?: number; done?: number }> = ({ at, on, off, y, icon, label, sub, x = 90, w = 900, h = 124, done }) => {
  const f = useCurrentFrame();
  const lit = f >= on && (off === undefined || f < off);
  return (
    <Glass at={at} x={x} y={y} w={w} h={h} pad={22} r={26} on={on} off={off} style={{ ...row }}>
      <IcoTile name={icon} size={h - 44} on={lit} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: lit ? K.text : "#D8D1C7" }}>{label}</div>
        {sub && <Mono size={24}>{sub}</Mono>}
      </div>
      {done !== undefined && <Tick at={done} size={48} />}
    </Glass>
  );
};

/** Nút tròn phát sáng (nút sơ đồ). */
const Node: React.FC<{ at: number; x: number; y: number; icon: string; label: string; on?: number; r?: number }> = ({ at, x, y, icon, label, on, r = 92 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const lit = on === undefined || f >= on;
  const a = on === undefined ? 1 : lerp(f, on, on + 8, 0, 1);
  return (
    <div style={{ position: "absolute", left: x - 160, top: y - r, width: 320, ...col, ...enter(f, at, { y: 30, s: 0.4, damping: 11 }) }}>
      <div style={{ width: r * 2, height: r * 2, borderRadius: 999, ...col, background: lit ? `radial-gradient(circle at 35% 30%, rgba(240,206,128,${0.35 * a}), rgba(212,168,67,${0.12 * a}) 60%, rgba(255,255,255,0.04))` : "rgba(255,255,255,0.05)", border: `2px solid ${lit ? K.accent : K.line}`, boxShadow: lit ? `0 0 ${50 * a}px ${K.accentGlow}` : "none" }}>
        <Ico name={icon} size={r * 0.9} color={lit ? K.accentHi : K.muted} />
      </div>
      <div style={{ marginTop: 16, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: lit ? K.text : K.muted }}>{label}</div>
    </div>
  );
};

/** Số đếm lớn tô gradient cam. */
const GradNum: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1, background: "linear-gradient(180deg, #FFF1CC 0%, #E6BE63 40%, #D4A843 65%, #7E5C17 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 40px rgba(212,168,67,0.5))", ...style }}>{children}</div>
);

/* ═════════════ 1 · Mở đầu ═════════════ */
export const M1: React.FC<SceneProps> = ({ end }) => {
  const q = cues(0);
  const f = useCurrentFrame();
  const kill = q("cả kho skill", 0, 6);
  const tasks: [string, string, string, string][] = [
    ["search", "Tìm skill", "Find Skills", "tìm skill,"],
    ["plan", "Lập kế hoạch code", "Superpowers", "lập kế hoạch code,"],
    ["brain", "Giữ ngữ cảnh", "Claude-mem", "giữ ngữ cảnh,"],
    ["palette", "Thiết kế giao diện", "UI UX Pro Max", "thiết kế giao diện,"],
    ["loop", "Rút kinh nghiệm", "Task Observer", "rút kinh nghiệm"],
  ];
  const camAt = (fr: number) => tasks.slice(1).reduce((s, t) => s + 820 * spr(fr, q(t[3], 0, -4), 15, 150), 0);
  const cam = camAt(f), vel = Math.abs(cam - camAt(f - 1));
  const cur = tasks.filter((t) => f >= q(t[3], 0, -2)).length - 1;
  return (
    <Beats noIntro end={end} list={[
      {
        a: q("Không cần cài"), t: "zoom", el: (
          <>
            <In at={q("Không cần cài")} x={90} y={250} w={900}><Kicker>Claude · Skills</Kicker></In>
            <KWords at={q("Không cần cài")} y={310} size={112} text={"Không cần\ncả kho skill"} hot={["cả", "kho", "skill"]} />
            <AbsoluteFill style={{ transform: "perspective(1200px) rotateX(24deg)", transformOrigin: "540px 900px" }}>
              {Array.from({ length: 20 }).map((_, k) => {
                const c = k % 4, r = Math.floor(k / 4);
                const at = 4 + random01(k) * 18;
                const p = spr(f, at, 13, 110);
                const dead = lerp(f, kill + c * 2, kill + 10 + c * 2, 0, 1);
                return (
                  <div key={k} style={{ position: "absolute", left: 100 + c * 225, top: 640 + r * 135, width: 205, height: 115, borderRadius: 22, boxSizing: "border-box", border: `1.5px solid ${dead > 0.5 ? "rgba(255,77,77,0.45)" : K.line}`, background: "rgba(255,255,255,0.06)", ...col, opacity: f < at ? 0 : Math.min(1, p * 1.5) * (1 - 0.7 * dead), translate: `0px ${(1 - p) * 500}px`, scale: String(0.4 + 0.6 * p), filter: p < 0.95 ? `blur(${(1 - p) * 10}px)` : undefined }}>
                    <Ico name={["file", "box", "puzzle", "gear", "star"][k % 5]} size={50} color={k % 6 === 0 ? K.accentHi : K.muted} />
                  </div>
                );
              })}
            </AbsoluteFill>
            <XMark at={kill} x={290} y={600} size={500} />
          </>
        ),
      },
      {
        a: q("Năm công cụ", 0, -2), t: "zoom", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 300, width: 1080, ...col, ...enter(f, q("Năm công cụ", 0, -2), { y: 0, s: 2.2, blur: 24, damping: 13 }) }}>
              <GradNum size={560}>5</GradNum>
            </div>
            <KWords at={q("Năm công cụ", 0, 4)} y={930} size={96} text={"công cụ\ncho 5 việc"} hot={["5"]} />
            <Chip at={q("rất cụ thể:")} x={340} y={1215}>Rất cụ thể</Chip>
          </>
        ),
      },
      {
        a: q("tìm skill,", 0, -4), t: "whipL", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: vel > 3 ? `blur(${Math.min(14, vel * 0.25)}px)` : undefined }}>
              {tasks.map(([ic, t, tool], k) => {
                const x = 160 + k * 820 - cam;
                const lit = k === cur;
                return (
                  <Glass key={t} at={0} x={x} y={380} w={760} h={820} pad={50} on={lit ? 0 : undefined} style={{ ...col, rotate: `${(x - 160) / 820 * 6}deg` }}>
                    <Mono size={34} color={K.accentHi}>{String(k + 1).padStart(2, "0")} / 05</Mono>
                    <div style={{ marginTop: 50 }}><IcoTile name={ic} size={240} on={lit} /></div>
                    <Big size={68} style={{ marginTop: 60 }}>{t}</Big>
                    <div style={{ marginTop: 22 }}><Mono size={34} color={K.muted}>{tool}</Mono></div>
                  </Glass>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, top: 1260, width: 1080, ...row, justifyContent: "center", gap: 18 }}>
              {tasks.map((_, k) => <div key={k} style={{ width: k === cur ? 56 : 16, height: 16, borderRadius: 8, background: k <= cur ? K.accent : K.line, boxShadow: k === cur ? `0 0 20px ${K.accentGlow}` : "none" }} />)}
            </div>
          </>
        ),
      },
    ]} />
  );
};

/** Số giả ngẫu nhiên 0..1 cố định theo chỉ số (cho thời điểm xuất hiện lệch nhau). */
const random01 = (k: number) => ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1;

/* ═════════════ 2 · Find Skills ═════════════ */
export const M2: React.FC<SceneProps> = ({ end }) => {
  const q = cues(1);
  const f = useCurrentFrame();
  const pick = q("hỗ trợ cài.");
  const opts = [["ui-review", "Rà giao diện"], ["test-writer", "Viết kiểm thử"], ["e2e-testing", "Kiểm thử đầu-cuối"]];
  const lib = ["react-perf", "seo-audit", "pdf-tools", "test-writer", "changelog", "docker-deploy", "ui-review", "api-docs", "e2e-testing", "lint-fix", "i18n-helper", "git-flow", "db-migrate", "a11y-check", "csv-clean", "slack-bot", "k8s-deploy", "copy-edit"];
  const easy = q("Tiện ở chỗ", 0, -3), stop = q("bớt phải", 0, 2);
  const sc = spr(f, easy, 30, 40) * 2600;
  return (
    <Beats end={end} list={[
      { a: q("Một,"), t: "zoom", el: <TitleCard at={q("Một,")} n={1} name="Find Skills" repo="github.com/vercel-labs/skills" /> },
      {
        a: q("Bạn mô tả", 0, -3), t: "whipL", el: (
          <>
            <KWords at={q("Bạn mô tả", 0, -3)} y={330} size={92} text={"Bạn mô tả\nnhu cầu"} hot={["nhu", "cầu"]} />
            <Glass at={q("Bạn mô tả")} x={70} y={640} w={940} h={170} pad={30} on={q("Bạn mô tả", 0, 4)} style={{ ...row }}>
              <IcoTile name="user" size={90} />
              <div style={{ fontSize: 46, fontWeight: 600, flex: 1 }}><Typed at={q("Bạn mô tả", 0, 4)} text="Tìm skill để viết kiểm thử" cps={1.3} /></div>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: K.accent, ...col, boxShadow: `0 0 30px ${K.accentGlow}` }}><Ico name="play" size={38} color="#1A1306" /></div>
            </Glass>
            <Chip at={q("kiểm tra giao diện")} x={110} y={890} tone="glass" size={34} rot={-3}>“kiểm tra giao diện”</Chip>
            <Chip at={q("viết kiểm thử")} x={480} y={1010} tone="glass" size={34} rot={2}>“viết kiểm thử”</Chip>
          </>
        ),
      },
      {
        a: q("agent sẽ tìm", 0, -3), t: "zoom", el: (
          <>
            <div style={{ position: "absolute", left: 540 - 230, top: 300, width: 460, height: 460, borderRadius: 999, border: `2px solid rgba(212,168,67,0.4)`, background: `conic-gradient(from ${f * 9}deg, rgba(212,168,67,0.55), transparent 22%)`, boxShadow: `0 0 60px rgba(212,168,67,0.25)`, ...enter(f, q("agent sẽ tìm", 0, -3), { y: 0, s: 0.3 }) }}>
              {[0.33, 0.66].map((s) => <div key={s} style={{ position: "absolute", inset: `${(1 - s) * 50}%`, borderRadius: 999, border: "1.5px solid rgba(212,168,67,0.3)" }} />)}
              {[[120, 140], [300, 110], [230, 330]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: 20, height: 20, borderRadius: 10, background: K.accentHi, boxShadow: `0 0 20px ${K.accent}`, opacity: f > q("agent sẽ tìm", 0, 6 + k * 6) ? 1 : 0 }} />)}
              <div style={{ position: "absolute", inset: 0, ...col }}><Ico name="search" size={110} color={K.text} /></div>
            </div>
            {opts.map(([id, t], k) => {
              const at = q("trình bày lựa chọn", 0, k * 4);
              const on = k === 1 && f >= pick;
              return (
                <div key={id} style={{ position: "absolute", left: 70, top: 850 + k * 140, width: 940, height: 120, boxSizing: "border-box", padding: "0 30px", borderRadius: 26, ...row, border: `2px solid ${on ? K.accent : K.line}`, background: on ? "rgba(212,168,67,0.16)" : "rgba(255,255,255,0.05)", boxShadow: on ? `0 0 40px ${K.accentGlow}` : "none", fontFamily: FONT, ...enter(f, at, { y: -200, s: 0.6, blur: 10 }) }}>
                  <Mono size={36} color={K.text} style={{ flex: 1 }}>{id}</Mono>
                  <span style={{ fontSize: 28, color: K.muted }}>{t}</span>
                  {k === 1 && <div style={{ padding: "14px 26px", borderRadius: 16, background: on ? K.accent : "rgba(255,255,255,0.10)", color: on ? "#1A1306" : K.text, fontWeight: 800, fontSize: 30, ...row, gap: 8 }}><Ico name="download" size={30} color={on ? "#1A1306" : K.text} />Cài</div>}
                </div>
              );
            })}
            <Cursor at={pick - 16} click={pick} from={[640, 1340]} to={[915, 1060]} />
          </>
        ),
      },
      {
        a: easy, t: "tilt", el: (
          <>
            <In at={easy} x={90} y={240} w={900} style={{ ...col }}>
              <GradNum size={170}><Counter at={easy} dur={30} from={0} to={1000} />+</GradNum>
              <Kicker color={K.muted} size={28}>skill trong thư viện</Kicker>
            </In>
            <div style={{ position: "absolute", left: 80, top: 0, width: 920, height: 1920, overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <AbsoluteFill style={{ left: -80, width: 1080, transform: "perspective(1400px) rotateX(18deg)", transformOrigin: "540px 900px", maskImage: "linear-gradient(transparent 30%, black 38%, black 60%, transparent 69%)" }}>
              {[0, 1, 2].map((c) => (
                <div key={c} style={{ position: "absolute", left: 120 + c * 300, top: 600 - (sc * (1 + c * 0.15)) % 1152, width: 280, filter: f < stop ? `blur(${Math.max(0, 4 - (f - easy) * 0.05)}px)` : undefined }}>
                  {[...lib, ...lib, ...lib].map((s, k) => {
                    const hit = f >= stop && ["test-writer", "e2e-testing", "ui-review"].includes(s);
                    return <div key={k} style={{ height: 64, ...row, gap: 12, opacity: f >= stop && !hit ? 0.25 : 1 }}><Ico name="file" size={26} color={hit ? K.accentHi : K.dim} /><Mono size={28} color={hit ? K.accentHi : K.muted}>{s}</Mono></div>;
                  })}
                </div>
              ))}
            </AbsoluteFill>
            </div>
            <Chip at={q("lục cả thư viện.")} x={290} y={1220} size={38}>Bớt lục cả thư viện</Chip>
          </>
        ),
      },
      {
        a: q("Nhưng tìm thấy", 0, -3), t: "spin", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 330, width: 1080, ...col, ...enter(f, q("Nhưng tìm thấy", 0, -3), { y: 0, s: 0.3, damping: 9 }) }}>
              <div style={{ width: 230, height: 230, borderRadius: 999, ...col, background: "rgba(255,77,77,0.12)", border: `2px solid ${K.warn}`, boxShadow: `0 0 ${50 + 20 * Math.sin(f / 4)}px rgba(255,77,77,0.45)` }}><Ico name="warn" size={130} color={K.warn} /></div>
            </div>
            <KWords at={q("tìm thấy", 0, 2)} y={680} size={110} text={"Tìm thấy\n≠ đáng tin"} hot={["≠"]} />
          </>
        ),
      },
      {
        a: q("hãy kiểm tra", 0, -3), t: "rise", el: (
          <>
            <KWords at={q("hãy kiểm tra", 0, -3)} y={300} size={78} text="Kiểm tra trước khi cài" hot={["trước"]} step={2} />
            {([["git", "Nguồn", "ai đăng, repo nào", "nguồn,"], ["file", "Nội dung", "SKILL.md làm gì", "nội dung"], ["key", "Quyền", "đọc/ghi file, chạy lệnh", "quyền trước"]] as const).map(([ic, lb, val, ph], k) => (
              <StepRow key={lb} at={q(ph, 0, -6)} on={q(ph)} y={560 + k * 190} h={160} icon={ic} label={lb} sub={val} done={q(ph, 0, 5)} />
            ))}
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 3 · Superpowers ═════════════ */
export const M3: React.FC<SceneProps> = ({ end }) => {
  const q = cues(2);
  const f = useCurrentFrame();
  const sp = q("chia việc", 0, -3);
  const subs = [230, 540, 850];
  return (
    <Beats end={end} list={[
      { a: q("Hai,"), t: "zoom", el: <TitleCard at={q("Hai,")} n={2} name="Superpowers" repo="github.com/obra/superpowers" /> },
      {
        a: q("Đây là", 0, -3), t: "zoom", el: (
          <>
            <AbsoluteFill style={{ transform: "perspective(1600px) rotateX(55deg) rotateZ(-38deg)", transformOrigin: "540px 640px" }}>
              {[0, 1, 2, 3].map((k) => {
                const at = q("Đây là", 0, k * 5);
                const p = spr(f, at, 12, 120);
                return <div key={k} style={{ position: "absolute", left: 340, top: 440, width: 400, height: 400, borderRadius: 40, border: `2px solid ${k === 3 ? K.accent : "rgba(240,206,128,0.5)"}`, background: k === 3 ? "rgba(212,168,67,0.30)" : "rgba(255,255,255,0.06)", boxShadow: k === 3 ? `0 0 60px ${K.accentGlow}` : "none", translate: `0px ${-k * 70 - (1 - p) * 600}px`, opacity: f < at ? 0 : Math.min(1, p * 1.5) }} />;
              })}
            </AbsoluteFill>
            <KWords at={q("bộ quy trình")} y={960} size={110} text="Bộ quy trình" hot={["quy", "trình"]} />
            <In at={q("agent lập trình", 0, -4)} x={90} y={1110} w={900} style={{ textAlign: "center" }}><Mono size={40} color={K.muted}>cho agent lập trình</Mono></In>
          </>
        ),
      },
      {
        a: q("làm rõ yêu cầu", 0, -3), t: "whipL", el: (
          <>
            <Wire at={q("thiết kế trước,", 0, -12)} d="M300 470 C 300 640, 780 560, 780 740" dur={12} dots={2} />
            <Wire at={q("lập kế hoạch,", 0, -12)} d="M780 920 C 780 1090, 300 1010, 300 1190" dur={12} dots={2} />
            <Node at={q("làm rõ yêu cầu", 0, -3)} on={q("làm rõ yêu cầu")} x={300} y={380} icon="chat" label="Làm rõ yêu cầu" />
            <Node at={q("thiết kế trước,", 0, -4)} on={q("thiết kế trước,")} x={780} y={830} icon="palette" label="Thiết kế" />
            <Node at={q("lập kế hoạch,", 0, -4)} on={q("lập kế hoạch,")} x={300} y={1100} icon="plan" label="Lập kế hoạch" />
          </>
        ),
      },
      {
        a: q("kiểm thử,", 0, -8), t: "whipL", el: (
          <Glass at={q("kiểm thử,", 0, -8)} x={90} y={420} w={900} pad={40} on={q("kiểm thử,")}>
            <div style={{ ...row }}><IcoTile name="test" size={100} on /><Big size={64}>Kiểm thử</Big></div>
            {["đăng nhập", "giỏ hàng", "thanh toán", "gửi email"].map((t, k) => (
              <div key={t} style={{ ...row, gap: 18, marginTop: 26, ...enter(f, q("kiểm thử,", 0, -7 + k * 3), { y: 20, x: 60, blur: 6 }) }}>
                <Tick at={q("kiểm thử,", 0, -3 + k * 3)} size={46} color={K.ok} /><Mono size={36} color={K.text}>test: {t}</Mono>
              </div>
            ))}
            <div style={{ marginTop: 34, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${lerp(f, q("kiểm thử,", 0, -7), q("kiểm thử,", 0, 10), 0, 100)}%`, background: K.ok, boxShadow: `0 0 20px ${K.ok}` }} />
            </div>
          </Glass>
        ),
      },
      {
        a: sp, t: "zoom", el: (
          <>
            {subs.map((x, k) => <Wire key={k} at={q("agent phụ", 0, -10)} d={`M540 520 C 540 640, ${x} 600, ${x} 740`} dur={10} dots={1} />)}
            {subs.map((x, k) => <Wire key={`r${k}`} at={q("rà soát kết quả.", 0, -10)} d={`M${x} 920 C ${x} 1040, 540 1000, 540 1110`} dur={10} dots={1} />)}
            <Node at={sp} on={sp} x={540} y={420} icon="brain" label="Agent chính" r={86} />
            {subs.map((x, k) => <Node key={k} at={q("agent phụ", 0, -4 + k * 3)} on={q("agent phụ", 0, k * 3)} x={x} y={820} icon="user" label={`Agent phụ ${k + 1}`} r={70} />)}
            <Node at={q("rà soát kết quả.", 0, -4)} on={q("rà soát kết quả.")} x={540} y={1190} icon="eye" label="Rà soát kết quả" r={76} />
          </>
        ),
      },
      {
        a: q("Một số bước", 0, -3), t: "rise", el: (
          <>
            <KWords at={q("Một số bước", 0, -3)} y={330} size={88} text={"Một số bước\ntùy môi trường"} hot={["tùy", "môi", "trường"]} />
            {([["Môi trường A", "Có", K.ok], ["Môi trường B", "Tùy cấu hình", K.accentHi], ["Môi trường C", "Chưa hỗ trợ", K.dim]] as const).map(([t, s, c], k) => (
              <Glass key={t} at={q("môi trường", 0, -6 + k * 4)} x={90} y={640 + k * 170} w={900} h={140} pad={30} style={{ ...row }}>
                <Ico name="box" size={56} color={K.text} />
                <span style={{ fontSize: 40, fontWeight: 700, flex: 1 }}>{t}</span>
                <span style={{ fontSize: 32, fontWeight: 700, color: c }}>{s}</span>
              </Glass>
            ))}
          </>
        ),
      },
      {
        a: q("Giá trị", 0, -3), t: "zoom", el: (
          <>
            <In at={q("Giá trị", 0, -3)} x={90} y={300} w={900} style={{ textAlign: "center" }}><Kicker size={32}>Giá trị thật</Kicker></In>
            <Glass at={q("Giá trị")} x={190} y={400} w={700} h={760} tone="accent" pad={50} r={60} style={{ ...col }}>
              <div style={{ scale: String(1 + 0.05 * Math.sin(f / 5)) }}><Ico name="shield" size={260} color="#1A1306" /></div>
              <Big size={92} color="#1A1306" style={{ marginTop: 40 }}>Bớt<br />làm ẩu</Big>
            </Glass>
          </>
        ),
      },
      {
        a: q("chứ không phải", 0, -3), t: "whipR", el: (
          <>
            <Glass at={q("chứ không phải", 0, -3)} x={90} y={360} w={900} h={620} pad={36}>
              <div style={{ ...row, gap: 10 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}<Mono size={26} style={{ marginLeft: 16 }}>app.ts</Mono></div>
              {["function thanhToan(gio) {", "  const tong = tinhTong(gio)", "  if (tong > 0) {", "    return guiDon(tong)", "  }", "}"].map((l, k) => (
                <div key={k} style={{ marginTop: 18, opacity: lerp(f, q("chứ không phải", 0, k * 2), q("chứ không phải", 0, k * 2 + 6), 0, 1) }}><Mono size={34} color={k === 2 && f >= q("code luôn đúng.", 0, -6) ? "#FF9C9C" : "#D8D1C7"} style={{ whiteSpace: "pre" }}>{l}</Mono></div>
              ))}
              {f >= q("code luôn đúng.", 0, -6) && <div style={{ position: "absolute", right: 60, top: 250, ...enter(f, q("code luôn đúng.", 0, -6), { y: -40, s: 0.3, damping: 9 }) }}><Ico name="bug" size={120} color={K.warn} /></div>}
            </Glass>
            <KWords at={q("lời hứa")} y={1050} size={78} text={"≠ lời hứa\ncode luôn đúng"} hot={["≠"]} step={2} />
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 4 · Claude-mem ═════════════ */
export const M4: React.FC<SceneProps> = ({ end }) => {
  const q = cues(3);
  const f = useCurrentFrame();
  const gl = q("Nó ghi lại", 0, -3);
  const pulse = 1 + 0.05 * Math.sin(f / 5);
  const orb = (x: number, y: number, r: number, at: number) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: 999, ...col, background: `radial-gradient(circle at 35% 30%, ${K.accentHi}, ${K.accent} 55%, #6E4F12)`, boxShadow: `0 0 ${110 * pulse}px ${K.accentGlow}, 0 0 0 18px rgba(212,168,67,0.10)`, ...enter(f, at, { y: 0, s: 0.3, damping: 10 }) }}>
      <Ico name="brain" size={r * 0.85} color="#1A1306" />
    </div>
  );
  const ctx = ["Dự án dùng Remotion", "Màu chủ đạo: vàng gold", "Đã xong cảnh 1–3"];
  const cells = Array.from({ length: 24 });
  return (
    <Beats end={end} list={[
      { a: q("Ba,"), t: "zoom", el: <TitleCard at={q("Ba,")} n={3} name="Claude-mem" repo="github.com/thedotmack/claude-mem" /> },
      {
        a: gl, t: "zoom", el: (
          <>
            {orb(540, 760, 170, gl)}
            {["Phiên 1", "Phiên 2", "Phiên 3"].map((t, k) => {
              const st = q("ghi lại", 0, k * 10);
              const p = lerp(f, st + 14, st + 40, 0, 1);
              const x0 = [200, 880, 540][k], y0 = [380, 420, 1230][k];
              const x = x0 + (540 - x0) * p, y = y0 + (760 - y0) * p;
              return f >= st && p < 1 ? (
                <div key={t} style={{ position: "absolute", left: x - 140, top: y - 60, width: 280, height: 120, borderRadius: 26, ...row, gap: 14, justifyContent: "center", background: "rgba(255,255,255,0.08)", border: `1.5px solid ${K.line}`, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: K.text, scale: String(1 - 0.7 * p), opacity: 1 - p * 0.6, ...(p === 0 ? enter(f, st, { y: 30, s: 0.5 }) : {}) }}>
                  <Ico name="chat" size={40} color={K.accentHi} />{t}
                </div>
              ) : null;
            })}
            <KWords at={q("tổng hợp", 0, -2)} y={1010} size={72} text="Ghi lại · tổng hợp" hot={["tổng", "hợp"]} step={2} />
          </>
        ),
      },
      {
        a: q("rồi đưa", 0, -3), t: "whipL", el: (
          <>
            {orb(540, 340, 90, q("rồi đưa", 0, -3))}
            <Wire at={q("rồi đưa")} d="M540 440 L540 540" dur={8} dots={2} />
            <Glass at={q("rồi đưa", 0, 2)} x={90} y={560} w={900} h={500} pad={36} on={q("phiên sau,")}>
              <div style={{ ...row, gap: 14 }}><Ico name="chat" size={44} color={K.accentHi} /><span style={{ fontSize: 40, fontWeight: 700 }}>Phiên mới</span></div>
              {ctx.map((c, k) => (
                <div key={c} style={{ marginTop: 22, padding: "18px 24px", borderRadius: 20, background: "rgba(212,168,67,0.10)", border: "1.5px solid rgba(212,168,67,0.45)", ...row, gap: 14, ...enter(f, q("ngữ cảnh", 0, k * 6), { y: -60, s: 0.8, blur: 8 }) }}>
                  <Ico name="brain" size={34} color={K.accentHi} /><span style={{ fontSize: 34, fontWeight: 600 }}>{c}</span>
                </div>
              ))}
            </Glass>
            <Chip at={q("nhắc lại.")} x={300} y={1210} size={40}>Đỡ phải nhắc lại</Chip>
          </>
        ),
      },
      {
        a: q("Nhưng nó", 0, -3), t: "spin", el: (
          <>
            <div style={{ position: "absolute", left: 150, top: 330, width: 780, display: "flex", flexWrap: "wrap", gap: 16 }}>
              {cells.map((_, k) => {
                const gone = random01(k + 7) < 0.35 && f >= q("không nhớ hoàn hảo,", 0, 4 + (k % 5) * 2);
                const flick = gone ? (Math.floor(f / 3 + k) % 2 ? 0.08 : 0.25) : 1;
                return <div key={k} style={{ width: 115, height: 80, borderRadius: 16, background: gone ? "rgba(255,77,77,0.10)" : "rgba(212,168,67,0.22)", border: `1.5px solid ${gone ? "rgba(255,77,77,0.5)" : "rgba(212,168,67,0.5)"}`, opacity: flick, ...enter(f, q("Nhưng nó", 0, -3 + k * 0.6), { y: 20, s: 0.6, blur: 6 }) }} />;
              })}
            </div>
            <Chip at={q("không nhớ hoàn hảo,")} x={230} y={740} tone="warn" size={40}>Không nhớ hoàn hảo</Chip>
            <Glass at={q("không tự hiểu", 0, -4)} x={90} y={870} w={900} h={360} pad={30}>
              <Kicker size={22} color={K.muted}>Dự án</Kicker>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16 }}>
                {["src/", "scenes/", "data/", "public/", "scripts/", "tests/"].map((d, k) => (
                  <div key={d} style={{ ...row, gap: 10, padding: "12px 18px", borderRadius: 16, background: k < 2 ? "rgba(212,168,67,0.14)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${k < 2 ? "rgba(212,168,67,0.5)" : K.line}`, opacity: k < 2 ? 1 : 0.35 }}>
                    <Ico name="folder" size={32} color={k < 2 ? K.accentHi : K.dim} /><Mono size={28} color={k < 2 ? K.text : K.dim}>{d}</Mono>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22, fontSize: 32, fontWeight: 700, color: "#FFB3B3", ...enter(f, q("cả dự án.", 0, -4), { y: 10, blur: 4 }) }}>Không tự hiểu cả dự án</div>
            </Glass>
          </>
        ),
      },
      {
        a: q("Với việc nhạy cảm,", 0, -3), t: "rise", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 300, width: 1080, ...col, ...enter(f, q("Với việc nhạy cảm,", 0, -3), { y: 0, s: 0.3, damping: 9 }) }}>
              <div style={{ width: 240, height: 240, borderRadius: 999, ...col, background: "rgba(255,77,77,0.10)", border: `2px solid ${K.warn}`, boxShadow: `0 0 ${50 + 20 * Math.sin(f / 5)}px rgba(255,77,77,0.4)` }}><Ico name="lock" size={130} color={K.warn} /></div>
            </div>
            <KWords at={q("nhạy cảm,")} y={590} size={88} text="Việc nhạy cảm?" hot={["nhạy", "cảm?"]} step={2} />
            <Glass at={q("dữ liệu nào", 0, -4)} x={90} y={760} w={900} pad={30} on={q("dữ liệu nào")}>
              <div style={{ ...row, gap: 14 }}><Ico name="file" size={44} color={K.accentHi} /><span style={{ fontSize: 40, fontWeight: 700, flex: 1 }}>Dữ liệu nào được ghi?</span><Tick at={q("được ghi,", 0, 4)} size={48} /></div>
              {["prompt & câu trả lời", "đường dẫn file", "kết quả lệnh"].map((r, k) => {
                const scan = Math.floor((f - q("dữ liệu nào")) / 6) % 3 === k && f >= q("dữ liệu nào");
                return <div key={r} style={{ marginTop: 16, padding: "14px 20px", borderRadius: 16, background: scan ? "rgba(212,168,67,0.16)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${scan ? K.accent : K.line}` }}><Mono size={30} color={scan ? K.text : K.muted}>{r}</Mono></div>;
              })}
            </Glass>
          </>
        ),
      },
      {
        a: q("lưu ở đâu,", 0, -3), t: "whipL", el: (
          <>
            <KWords at={q("lưu ở đâu,", 0, -3)} y={300} size={80} text="Trước khi bật" hot={["bật"]} step={2} />
            {([["folder", "Lưu ở đâu", "lưu ở đâu,"], ["cloud", "Dùng nhà cung cấp nào", "nhà cung cấp"], ["coin", "Chi phí ra sao", "chi phí ra sao"]] as const).map(([ic, t, ph], k) => (
              <StepRow key={t} at={q(ph, 0, -6)} on={q(ph)} y={470 + k * 230} h={190} icon={ic} label={t} done={q(ph, 0, 6)} />
            ))}
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 5 · UI UX Pro Max ═════════════ */
export const M5: React.FC<SceneProps> = ({ end }) => {
  const q = cues(4);
  const f = useCurrentFrame();
  const tStyle = q("phong cách,"), tColor = q("màu sắc,"), tType = q("kiểu chữ");
  const st = lerp(f, tStyle, tStyle + 12, 0, 1), co = lerp(f, tColor, tColor + 12, 0, 1), ty = f >= tType;
  const sw = ["#D4A843", "#F2E2B4", "#2B1A12", "#F5F1EA"];
  const lineC = co > 0.5 ? "rgba(43,26,18,0.25)" : "rgba(255,255,255,0.15)";
  const tk = q("Nó cung cấp", 0, -3);
  const tokens: [number, React.ReactNode][] = [
    [0, <div style={{ ...row, gap: 8 }}>{sw.map((c) => <div key={c} style={{ width: 46, height: 46, borderRadius: 12, background: c }} />)}</div>],
    [1, <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70 }}>Aa</span>],
    [2, <div style={{ width: 90, height: 90, borderRadius: 28, border: `3px solid ${K.accentHi}` }} />],
    [3, <Mono size={30} color={K.text}>8 · 16 · 24</Mono>],
    [4, <Ico name="layers" size={80} color={K.accentHi} />],
    [5, <div style={{ padding: "14px 26px", borderRadius: 999, background: K.accent, color: "#1A1306", fontFamily: FONT, fontWeight: 800, fontSize: 30 }}>Nút</div>],
  ];
  const phoneSpin = Math.sin((f - q("nên hãy")) / 22) * 22;
  return (
    <Beats end={end} list={[
      { a: q("Bốn,"), t: "zoom", el: <TitleCard at={q("Bốn,")} n={4} name="UI UX Pro Max" repo="github.com/nextlevelbuilder/ui-ux-pro-max-skill" /> },
      {
        a: tk, t: "zoom", el: (
          <>
            {tokens.map(([k, node]) => {
              const ang = (k / tokens.length) * Math.PI * 2 + (f - tk) / 45;
              const x = 540 + Math.cos(ang) * 300, y = 760 + Math.sin(ang) * 340;
              return (
                <div key={k} style={{ position: "absolute", left: x - 100, top: y - 65, width: 200, height: 130, borderRadius: 30, ...col, background: "rgba(255,255,255,0.07)", border: `1.5px solid ${K.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", ...enter(f, tk + k * 3, { y: 0, s: 0.2, blur: 12 }) }}>{node}</div>
              );
            })}
            <div style={{ position: "absolute", left: 0, top: 690, width: 1080, ...col, ...enter(f, tk + 6, { y: 0, s: 0.5 }) }}>
              <Big size={52}>Tri thức</Big><Big size={52} color={K.accent}>thiết kế</Big>
            </div>
          </>
        ),
      },
      {
        a: q("giúp agent", 0, -3), t: "whipL", el: (
          <>
            {([["Phong cách", tStyle, "Kính mờ · bo góc"], ["Màu sắc", tColor, "Vàng · kem · nâu"], ["Kiểu chữ", tType, "Be Vietnam Pro"]] as const).map(([lb, at, v], k) => {
              const on = f >= at;
              return (
                <Glass key={lb} at={q("giúp agent", 0, -3 + k * 3)} x={60} y={420 + k * 230} w={470} h={200} pad={26} on={at}>
                  <div style={{ ...row, justifyContent: "space-between" }}><Kicker size={22} color={on ? K.accentHi : K.muted}>{lb}</Kicker>{on && <Tick at={at} size={40} />}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, marginTop: 18, opacity: on ? 1 : 0.4 }}>{v}</div>
                </Glass>
              );
            })}
            <In at={q("giúp agent", 0, 4)} x={580} y={380} w={440} dx={80}>
              <div style={{ width: 440, height: 860, borderRadius: 64, border: "3px solid rgba(255,255,255,0.25)", background: "#151210", padding: 18, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", transform: `perspective(1400px) rotateY(${-12 + 6 * co}deg)` }}>
                <div style={{ height: "100%", borderRadius: 48, overflow: "hidden", background: co > 0.5 ? "#FFF6EF" : "#1E1B19", padding: 26, boxSizing: "border-box", fontFamily: FONT }}>
                  <div style={{ width: 90, height: 10, borderRadius: 5, margin: "0 auto 26px", background: lineC }} />
                  <div style={{ height: 280, borderRadius: 8 + 26 * st, background: co > 0.5 ? `linear-gradient(150deg, ${sw[0]}, #F0CE80)` : "rgba(255,255,255,0.08)", border: st > 0.5 ? "none" : "2px dashed rgba(255,255,255,0.25)", padding: 24, boxSizing: "border-box", boxShadow: st > 0.5 ? "0 16px 30px rgba(212,168,67,0.3)" : "none" }}>
                    <div style={{ fontSize: ty ? 50 : 30, fontWeight: ty ? 800 : 500, color: co > 0.5 ? "#1A1306" : K.muted, lineHeight: 1.05, fontFamily: ty ? FONT : "monospace" }}>{ty ? "Thư giãn mỗi ngày" : "Tiêu đề"}</div>
                    <div style={{ marginTop: 22, width: 150, height: 54, borderRadius: 27 * st + 4, background: co > 0.5 ? "#1A1306" : "rgba(255,255,255,0.2)" }} />
                  </div>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ ...row, gap: 16, marginTop: 22, height: 100, borderRadius: 4 + 22 * st, background: co > 0.5 ? "#fff" : "rgba(255,255,255,0.05)", border: st > 0.5 ? "none" : "2px dashed rgba(255,255,255,0.2)", padding: 16, boxSizing: "border-box" }}>
                      <div style={{ width: 64, height: 64, borderRadius: 32 * st + 4, background: co > 0.5 ? sw[k % 2 ? 1 : 0] : "rgba(255,255,255,0.12)" }} />
                      <div style={{ flex: 1 }}><div style={{ height: 14, width: "80%", borderRadius: 7, background: lineC }} /><div style={{ height: 12, width: "50%", borderRadius: 6, background: lineC, marginTop: 12 }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </In>
            <Chip at={q("tự đoán.")} x={90} y={1250} size={38}>Thay vì để AI tự đoán</Chip>
          </>
        ),
      },
      {
        a: q("Nhưng đẹp", 0, -3), t: "spin", el: (
          <>
            <KWords at={q("Nhưng đẹp", 0, -3)} y={300} size={96} text={"Đẹp hay không\nvẫn tùy"} hot={["vẫn", "tùy"]} step={2} />
            <Glass at={q("đề bài", 0, -4)} x={90} y={640} w={900} h={170} pad={30} on={q("đề bài")} style={{ ...row, justifyContent: "center" }}><Ico name="file" size={60} color={K.accentHi} /><Big size={60}>Đề bài</Big></Glass>
            <div style={{ position: "absolute", left: 0, top: 835, width: 1080, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 90, color: K.accent, ...enter(f, q("cách triển khai,", 0, -6), { y: 0, s: 0.2 }) }}>+</div>
            <Glass at={q("cách triển khai,", 0, -4)} x={90} y={960} w={900} h={170} pad={30} on={q("cách triển khai,")} style={{ ...row, justifyContent: "center" }}><Ico name="gear" size={60} color={K.accentHi} /><Big size={60}>Cách triển khai</Big></Glass>
          </>
        ),
      },
      {
        a: q("nên hãy", 0, -3), t: "tilt", el: (
          <>
            <KWords at={q("nên hãy", 0, -3)} y={280} size={76} text="Vẫn phải kiểm tra" hot={["kiểm", "tra"]} step={2} />
            <div style={{ position: "absolute", left: 540 - 170, top: 430, width: 340, height: 640, borderRadius: 56, border: "3px solid rgba(255,255,255,0.3)", background: "linear-gradient(160deg, #2A221D, #151210)", boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.2)`, transform: `perspective(1200px) rotateY(${phoneSpin}deg)`, ...enter(f, q("nên hãy", 0, -3), { y: 120, s: 0.6 }), ...col }}>
              <IcoTile name="access" size={150} on />
            </div>
            <Chip at={q("điện thoại")} x={90} y={1130} size={36}>✓ Trên điện thoại</Chip>
            <Chip at={q("khả năng tiếp cận.")} x={520} y={1130} size={36}>✓ Khả năng tiếp cận</Chip>
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 6 · Task Observer ═════════════ */
export const M6: React.FC<SceneProps> = ({ end }) => {
  const q = cues(5);
  const f = useCurrentFrame();
  const installed = f >= q("cài bản cập nhật.");
  const obs = q("Nó quan sát", 0, -3);
  const scanX = interpolate(f, [obs, obs + 70], [120, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lockAt = q("Quan trọng là", 0, -3);
  const hit = q("tự ý sửa", 0, -2);
  const arrowP = lerp(f, lockAt + 6, hit, 0, 1);
  const bounce = f > hit ? -spr(f, hit, 8, 160) * 160 : 0;
  const cg = q("Cài xong", 0, -3);
  const sw = lerp(f, q("cấu hình kích hoạt"), q("cấu hình kích hoạt", 0, 10), 0, 1);
  return (
    <Beats end={end} list={[
      { a: q("Năm,"), t: "zoom", el: <TitleCard at={q("Năm,")} n={5} name="Task Observer" repo="github.com/rebelytics/one-skill-to-rule-them-all" /> },
      {
        a: q("Có nhiều", 0, -3), t: "whipL", el: (
          <>
            {["???/task-observer", "rebelytics/…", "khác/task-observer"].map((t, k) => {
              const p = spr(f, q("Có nhiều", 0, k * 4), 12, 120);
              return (
                <div key={t} style={{ position: "absolute", left: 240, top: 430 + (k === 1 ? 0 : 60), width: 600, height: 340, borderRadius: 34, padding: 34, boxSizing: "border-box", background: k === 1 ? "#241A14" : "#17130F", border: `2px solid ${k === 1 ? K.accent : K.line}`, boxShadow: k === 1 ? `0 30px 60px rgba(0,0,0,0.7), 0 0 50px ${K.accentGlow}` : "0 30px 60px rgba(0,0,0,0.7)", rotate: `${(k - 1) * 12 * p}deg`, translate: `${(k - 1) * 230 * p}px ${(1 - p) * 400}px`, opacity: Math.min(1, p * 1.5) * (k === 1 ? 1 : 0.75), zIndex: k === 1 ? 2 : 1, fontFamily: FONT }}>
                  <Ico name="git" size={56} color={k === 1 ? K.accentHi : K.muted} />
                  <div style={{ fontSize: 50, fontWeight: 800, marginTop: 18, color: K.text }}>Task Observer</div>
                  <Mono size={28}>{t}</Mono>
                </div>
              );
            })}
            <Chip at={q("trùng tên,")} x={220} y={940} tone="warn" size={42}>Nhiều bản trùng tên</Chip>
          </>
        ),
      },
      {
        a: q("nên hãy xem", 0, -3), t: "zoom", el: (
          <>
            {/* Ảnh chụp trang repo: đặt file vào public/ rồi dùng <DarkShot src="ten-anh.jpg" url="github.com/..." ar={cao/rộng} .../>. Ví dụ này dùng thẻ thay thế để không kèm ảnh. */}
            <Glass at={q("nên hãy xem", 0, -3)} x={90} y={420} w={900} h={620} pad={50} style={{ ...col }}>
              <Ico name="git" size={140} color={K.accentHi} />
              <Mono size={36} color={K.text} style={{ marginTop: 30 }}>rebelytics/</Mono>
              <Mono size={36} color={K.text}>one-skill-to-rule-them-all</Mono>
            </Glass>
            <Chip at={q("đúng repo", 0, 4)} x={300} y={1150} size={38}>Đúng repo này</Chip>
          </>
        ),
      },
      {
        a: obs, t: "rise", el: (
          <>
            <KWords at={obs} y={290} size={84} text={"Quan sát\nphiên được bật"} hot={["quan", "sát"]} step={2} />
            <Glass at={obs + 4} x={60} y={640} w={960} h={360} pad={30}>
              <Kicker size={22} color={K.muted}>Dòng thời gian phiên</Kicker>
              <div style={{ position: "relative", marginTop: 40, height: 200 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{ position: "absolute", left: k * 128, top: (k % 2) * 90, width: 110, height: 70, borderRadius: 16, background: k === 2 || k === 5 ? "rgba(212,168,67,0.25)" : "rgba(255,255,255,0.07)", border: `1.5px solid ${k === 2 || k === 5 ? K.accent : K.line}` }} />)}
                <div style={{ position: "absolute", left: scanX - 60, top: -30, width: 4, height: 260, background: K.accentHi, boxShadow: `0 0 30px ${K.accent}` }} />
              </div>
            </Glass>
            <div style={{ position: "absolute", left: scanX - 60 + 2 - 50, top: 520, ...enter(f, obs + 6, { y: 0, s: 0.4 }) }}><IcoTile name="eye" size={100} on /></div>
          </>
        ),
      },
      {
        a: q("ghi lại", 0, -3), t: "whipL", el: (
          <>
            <KWords at={q("ghi lại", 0, -3)} y={330} size={84} text="Nhật ký quan sát" hot={["quan", "sát"]} step={2} />
            {([["warn", "Điểm vướng", "điểm vướng", 3], ["loop", "Thao tác lặp lại", "thao tác lặp lại,", 5]] as const).map(([ic, t, ph, n], k) => (
              <Glass key={t} at={q(ph, 0, -4)} x={90} y={540 + k * 260} w={900} h={220} pad={34} on={q(ph)} style={{ ...row }}>
                <IcoTile name={ic} size={130} on />
                <span style={{ fontSize: 44, fontWeight: 700, flex: 1 }}>{t}</span>
                <GradNum size={100}>×<Counter at={q(ph)} dur={18} from={0} to={n} /></GradNum>
              </Glass>
            ))}
          </>
        ),
      },
      {
        a: q("rồi đề xuất", 0, -3), t: "zoom", el: (
          <>
            <Glass at={q("rồi đề xuất", 0, -3)} x={140} y={420} w={800} h={720} tone="accent" pad={50} r={60} style={{ ...col }}>
              <div style={{ rotate: `${Math.sin(f / 6) * 4}deg` }}><Ico name="file" size={230} color="#1A1306" /></div>
              <Big size={72} color="#1A1306" style={{ marginTop: 34 }}>Đề xuất<br />tạo / sửa skill</Big>
            </Glass>
          </>
        ),
      },
      {
        a: lockAt, t: "spin", el: (
          <>
            <Glass at={lockAt} x={190} y={420} w={700} h={560} pad={40} style={{ ...col }}>
              <Ico name="file" size={140} color={K.text} />
              <Mono size={34} color={K.text} style={{ marginTop: 20 }}>skill đang dùng</Mono>
              <div style={{ marginTop: 30, ...enter(f, lockAt + 4, { y: -80, s: 0.3, damping: 9 }) }}><IcoTile name="lock" size={130} on /></div>
            </Glass>
            {f < hit + 30 && (
              <div style={{ position: "absolute", left: 540 - 50, top: 1300 - (1300 - 1000) * arrowP - bounce, ...col, opacity: f > hit + 10 ? 1 - lerp(f, hit + 10, hit + 30, 0, 1) : 1 }}>
                <Ico name="brain" size={100} color={K.warn} />
                <Mono size={26} color="#FFB3B3">AI tự sửa?</Mono>
              </div>
            )}
            <Chip at={hit} x={150} y={1040} size={38}>Không tự ý sửa skill đang dùng</Chip>
          </>
        ),
      },
      {
        a: q("bạn rà soát", 0, -3), t: "whipR", el: (
          <>
            <Glass at={q("bạn rà soát", 0, -3)} x={60} y={380} w={960} pad={36}>
              <div style={{ ...row, gap: 16 }}>
                <Ico name="bell" size={46} color={K.accentHi} />
                <span style={{ fontSize: 36, fontWeight: 700, flex: 1 }}>Đề xuất cập nhật skill</span>
                <span style={{ fontSize: 26, fontWeight: 700, padding: "10px 20px", borderRadius: 999, background: installed ? "rgba(61,220,132,0.16)" : "rgba(255,255,255,0.08)", color: installed ? K.ok : K.muted, border: `1.5px solid ${installed ? K.ok : K.line}` }}>{installed ? "Đã cài bản mới" : "Bản chờ duyệt"}</span>
              </div>
              <div style={{ marginTop: 26, borderRadius: 18, overflow: "hidden", border: `1.5px solid ${K.line}` }}>
                <div style={{ padding: "18px 22px", background: "rgba(255,77,77,0.12)" }}><Mono size={30} color="#FF9C9C">- Luôn xuất file .docx</Mono></div>
                <div style={{ padding: "18px 22px", background: "rgba(61,220,132,0.10)" }}><Mono size={30} color="#8FF0B8">+ Hỏi định dạng trước khi xuất</Mono></div>
              </div>
              <div style={{ ...row, gap: 16, marginTop: 34 }}>
                {[["Rà soát", "bạn rà soát"], ["Duyệt", "duyệt,"], ["Cài bản mới", "cài bản cập nhật."]].map(([t, ph]) => {
                  const on = f >= q(ph);
                  return <div key={t} style={{ padding: "20px 28px", borderRadius: 18, fontSize: 32, fontWeight: 700, background: on ? K.accent : "rgba(255,255,255,0.06)", color: on ? "#1A1306" : K.muted, border: `1.5px solid ${on ? K.accent : K.line}`, boxShadow: on ? `0 0 30px ${K.accentGlow}` : "none", scale: String(on ? 0.92 + 0.08 * spr(f, q(ph), 10, 170) : 1) }}>{t}</div>;
                })}
              </div>
            </Glass>
            <Cursor at={q("duyệt,", 0, -16)} click={q("duyệt,")} from={[860, 1300]} to={[366, 732]} />
            <KWords at={q("bản chính thức", 0, -4)} y={1010} size={64} text={"Chỉ thành bản chính\nkhi bạn cài"} hot={["bạn", "cài"]} step={2} />
          </>
        ),
      },
      {
        a: cg, t: "zoom", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 330, width: 1080, ...col, ...enter(f, cg, { y: 0, s: 0.3 }) }}>
              <div style={{ rotate: `${(f - cg) * 2}deg` }}><Ico name="gear" size={280} color={K.accentHi} /></div>
            </div>
            <KWords at={cg + 4} y={680} size={96} text={"Cài xong\n≠ chạy"} hot={["≠"]} step={2} />
            <Glass at={q("cấu hình kích hoạt", 0, -6)} x={90} y={1000} w={900} h={160} pad={30} on={q("cấu hình kích hoạt", 0, 8)} style={{ ...row }}>
              <span style={{ fontSize: 34, fontWeight: 700, flex: 1 }}>Cấu hình kích hoạt đúng môi trường</span>
              <div style={{ width: 120, height: 66, borderRadius: 33, background: sw > 0.5 ? K.accent : "rgba(255,255,255,0.15)", position: "relative", boxShadow: sw > 0.5 ? `0 0 26px ${K.accentGlow}` : "none" }}>
                <div style={{ position: "absolute", top: 8, left: 8 + 54 * sw, width: 50, height: 50, borderRadius: 25, background: "#fff" }} />
              </div>
            </Glass>
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 7 · Tổng kết ═════════════ */
export const M7: React.FC<SceneProps> = ({ end }) => {
  const q = cues(6);
  const f = useCurrentFrame();
  const tools: [string, string][] = [["search", "Find Skills"], ["plan", "Superpowers"], ["brain", "Claude-mem"], ["palette", "UI UX Pro Max"], ["loop", "Task Observer"]];
  const a0 = q("Năm công cụ", 0, -3);
  const rings: [string, string, number][] = [["Thử nhỏ", "kiểm tra quyền", 170], ["Kiểm quyền + chi phí", "chi phí", 300], ["Dùng rộng hơn", "dùng rộng hơn.", 440]];
  const dl = q("Không cần cài", 0, -3);
  return (
    <Beats end={end} list={[
      {
        a: a0, t: "zoom", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 650, width: 1080, ...col, ...enter(f, a0, { y: 0, s: 0.4 }) }}>
              <GradNum size={170}>5</GradNum><Big size={56}>nút thắt</Big>
            </div>
            {tools.map(([ic, n], k) => {
              const ang = -Math.PI / 2 + (k / 5) * Math.PI * 2 + (f - a0) / 120;
              const x = 540 + Math.cos(ang) * 360, y = 760 + Math.sin(ang) * 380;
              return (
                <div key={n} style={{ position: "absolute", left: x - 110, top: y - 90, width: 220, ...col, ...enter(f, q("năm nút thắt", 0, k * 3), { y: 0, s: 0.2, blur: 10 }) }}>
                  <IcoTile name={ic} size={110} on />
                  <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: K.text }}>{n}</div>
                </div>
              );
            })}
          </>
        ),
      },
      {
        a: q("và không phải", 0, -3), t: "whipL", el: (
          <>
            <KWords at={q("và không phải", 0, -3)} y={300} size={76} text={"Không phải cái nào\ncũng là 1 skill"} hot={["1", "skill"]} step={2} />
            {([["file", "1 skill", 0], ["layers", "Bộ skill", 1], ["split", "Quy trình", 2]] as const).map(([ic, t, k]) => (
              <Glass key={t} at={q("không phải", 0, 4 + k * 5)} x={60 + k * 330} y={640} w={300} h={420} pad={30} on={q("không phải", 0, 8 + k * 5)} style={{ ...col }}>
                <IcoTile name={ic} size={150} on />
                <div style={{ fontSize: 38, fontWeight: 700, marginTop: 30 }}>{t}</div>
              </Glass>
            ))}
          </>
        ),
      },
      {
        a: q("Hãy bắt đầu", 0, -3), t: "rise", el: (
          <>
            <KWords at={q("Hãy bắt đầu", 0, -3)} y={300} size={100} text="Bắt đầu nhỏ" hot={["nhỏ"]} />
            <StepRow at={q("chỗ bạn đang vướng,", 0, -6)} on={q("chỗ bạn đang vướng,")} off={q("dữ liệu không nhạy cảm,")} y={540} h={190} icon="target" label="Từ chỗ đang vướng" done={q("dữ liệu không nhạy cảm,")} />
            <Wire at={q("dữ liệu không nhạy cảm,", 0, -8)} d="M200 730 L200 800" dur={6} dots={1} />
            <StepRow at={q("dữ liệu không nhạy cảm,", 0, -6)} on={q("dữ liệu không nhạy cảm,")} y={800} h={190} icon="shield" label="Thử trên dữ liệu không nhạy cảm" done={q("nhạy cảm,", 0, 10)} />
          </>
        ),
      },
      {
        a: q("kiểm tra quyền", 0, -3), t: "zoom", el: (
          <>
            {rings.slice().reverse().map(([t, ph, r]) => {
              const p = spr(f, q(ph, 0, -4), 14, 110);
              return (
                <div key={t} style={{ position: "absolute", left: 540 - r, top: 780 - r, width: r * 2, height: r * 2, borderRadius: 999, border: `2px solid ${K.accent}`, background: `rgba(212,168,67,${0.06 + (r === 170 ? 0.18 : 0)})`, boxShadow: `0 0 50px rgba(212,168,67,0.2)`, scale: String(p), opacity: Math.min(1, p * 1.5) }}>
                  <div style={{ position: "absolute", top: r === 170 ? r - 26 : 26, left: 0, width: r * 2, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: K.text }}>{t}</div>
                </div>
              );
            })}
          </>
        ),
      },
      {
        a: dl, t: "whipL", el: (
          <>
            <KWords at={dl} y={330} size={88} text={"Không cần cài\ncả 5 cùng lúc"} hot={["cả", "5"]} step={2} />
            <div style={{ position: "absolute", left: 0, top: 720, width: 1080, ...row, justifyContent: "center", gap: 20 }}>
              {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ ...enter(f, dl + 4 + k * 2, { y: 100, s: 0.4 }) }}><IcoTile name="download" size={160} /></div>)}
            </div>
            <XMark at={q("cả năm cùng lúc,", 0, 2)} x={340} y={600} size={400} />
          </>
        ),
      },
      {
        a: q("và đừng lấy", 0, -3), t: "zoom", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 360, width: 1080, ...col }}>
              <div style={{ ...row, gap: 20, ...enter(f, q("và đừng lấy", 0, -3), { y: 0, s: 0.4 }) }}>
                <Ico name="star" size={150} color={K.accentHi} />
                <GradNum size={190}><Counter at={q("số sao")} dur={36} from={0} to={48200} /></GradNum>
              </div>
            </div>
            <KWords at={q("bảo đảm", 0, -4)} y={720} size={100} text={"≠ bảo đảm"} hot={["≠"]} />
            <In at={q("chất lượng", 0, -2)} x={90} y={880} w={900} style={{ textAlign: "center" }}><span style={{ fontFamily: FONT, fontSize: 48, fontWeight: 600, color: K.muted }}>chất lượng hay an toàn</span></In>
          </>
        ),
      },
    ]} />
  );
};

/* ═════════════ 8 · Kêu gọi ═════════════ */
export const M8: React.FC<SceneProps> = ({ end }) => {
  const q = cues(7);
  const f = useCurrentFrame();
  const opts: [string, string, string][] = [["search", "Tìm skill", "tìm skill,"], ["plan", "Code", "code,"], ["brain", "Ghi nhớ", "ghi nhớ"], ["palette", "Thiết kế", "thiết kế?"]];
  const follow = q("theo dõi");
  const followed = f >= follow;
  return (
    <Beats end={end} exit="rise" list={[
      {
        a: q("Bạn đang vướng", 0, -3), t: "zoom", el: (
          <>
            <KWords at={q("Bạn đang vướng", 0, -3)} y={260} size={86} text={"Bạn đang vướng\nở khâu nào?"} hot={["khâu", "nào?"]} step={2} />
            {opts.map(([ic, t, ph], k) => (
              <Glass key={t} at={q(ph, 0, -4)} x={90 + (k % 2) * 460} y={560 + Math.floor(k / 2) * 330} w={440} h={300} pad={26} on={q(ph)} style={{ ...col }}>
                <IcoTile name={ic} size={120} on={f >= q(ph)} />
                <div style={{ fontSize: 40, fontWeight: 700, marginTop: 20 }}>{t}</div>
              </Glass>
            ))}
          </>
        ),
      },
      {
        a: q("Bình luận", 0, -3), t: "whipL", el: (
          <>
            <KWords at={q("Bình luận", 0, -3)} y={330} size={100} text="Bình luận" hot={["luận"]} />
            <Glass at={q("Bình luận")} x={70} y={560} w={940} h={180} pad={34} on={q("Bình luận", 0, 4)} style={{ ...row }}>
              <IcoTile name="chat" size={100} on />
              <span style={{ fontSize: 50, fontWeight: 700, flex: 1 }}><Typed at={q("Bình luận", 0, 6)} text="Superpowers" cps={0.9} /></span>
            </Glass>
            <In at={q("xem kỹ hơn,", 0, -2)} x={90} y={800} w={900} style={{ textAlign: "center" }}><span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 600, color: K.muted }}>tên công cụ bạn muốn xem kỹ hơn</span></In>
          </>
        ),
      },
      {
        a: q("và theo dõi", 0, -3), t: "rise", el: (
          <>
            <div style={{ position: "absolute", left: 0, top: 360, width: 1080, ...col, ...enter(f, q("và theo dõi", 0, -3), { y: 0, s: 0.3 }) }}>
              <div style={{ rotate: `${followed ? Math.sin((f - follow) / 2) * 18 * Math.max(0, 1 - (f - follow) / 30) : 0}deg` }}><Ico name="bell" size={240} color={followed ? K.accentHi : K.text} /></div>
            </div>
            <In at={q("và theo dõi", 0, 2)} x={240} y={720} w={600}>
              <div style={{ height: 170, borderRadius: 40, background: followed ? K.accent : "rgba(255,255,255,0.10)", border: `2px solid ${followed ? K.accent : K.line}`, ...row, justifyContent: "center", gap: 18, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: followed ? "#1A1306" : K.text, boxShadow: followed ? `0 0 60px ${K.accentGlow}` : "none", scale: String(followed ? 0.94 + 0.06 * spr(f, follow, 9, 180) : 1) }}>
                {followed ? "Đã theo dõi" : "Theo dõi"}
              </div>
            </In>
            <Cursor at={follow - 14} click={follow} from={[760, 1300]} to={[600, 810]} />
            <In at={q("cách dùng", 0, -4)} x={90} y={960} w={900} style={{ textAlign: "center" }}><span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 600, color: K.muted }}>xem thêm cách dùng thực tế</span></In>
          </>
        ),
      },
    ]} />
  );
};

export const MOTION5_SCENES = [M1, M2, M3, M4, M5, M6, M7, M8];
