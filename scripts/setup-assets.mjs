/**
 * MediaPipe aktivlarini tayyorlaydi (postinstall da ishlaydi):
 *  - wasm fayllari node_modules dagi @mediapipe/tasks-vision paketidan
 *    public/mediapipe/wasm ga ko'chiriladi
 *  - face_landmarker.task modeli Google storage'dan yuklab olinadi
 * Fayllar mavjud bo'lsa, qayta yuklanmaydi.
 */
import { createWriteStream } from "node:fs";
import { access, copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wasmSrc = join(root, "node_modules/@mediapipe/tasks-vision/wasm");
const wasmDst = join(root, "public/mediapipe/wasm");
const modelDst = join(root, "public/models/face_landmarker.task");
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const WASM_FILES = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm",
];

const exists = (p) => access(p).then(() => true, () => false);

await mkdir(wasmDst, { recursive: true });
for (const f of WASM_FILES) {
  const dst = join(wasmDst, f);
  if (await exists(dst)) continue;
  await copyFile(join(wasmSrc, f), dst);
  console.log(`✓ wasm: ${f}`);
}

if (!(await exists(modelDst))) {
  await mkdir(dirname(modelDst), { recursive: true });
  console.log("Model yuklanmoqda (≈3.7MB)…");
  const res = await fetch(MODEL_URL);
  if (!res.ok) {
    console.error(
      `Model yuklab olinmadi (HTTP ${res.status}). Qo'lda yuklab, ` +
        `public/models/face_landmarker.task sifatida saqlang:\n${MODEL_URL}`,
    );
    process.exit(1);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(modelDst));
  console.log("✓ model: face_landmarker.task");
}
