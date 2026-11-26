// Quét thư mục public/poses, ghi danh sách ảnh pose đang có vào src/data/poseFiles.json
// (chạy tự động trước khi xuất video / mở Studio).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "poses");
const out = path.join(root, "src", "data", "poseFiles.json");

const map = {};
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  const m = f.match(/^([a-z0-9_-]+)\.(png|webp)$/i);
  if (m) map[m[1].toLowerCase()] = f;
}
fs.writeFileSync(out, JSON.stringify(map, null, 2));
console.log("Pose có ảnh:", Object.keys(map).join(", ") || "(không có)");
