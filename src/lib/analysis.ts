import {
  FaceLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

export type Level = "good" | "moderate" | "attention";

export type EyeMetrics = {
  /** 0–100, yuqori bo'lsa qizarish kuchli */
  redness: number;
  /** 0–100, yuqori bo'lsa ko'z keng ochiq (charchoq belgisi past) */
  openness: number;
  crop: string; // dataURL
};

export type AnalysisResult = {
  score: number; // 0–100, umumiy salomatlik bahosi
  redness: number;
  openness: number;
  level: Level;
  left: EyeMetrics;
  right: EyeMetrics;
  capturedAt: number;
};

export class NoFaceError extends Error {
  constructor() {
    super("Yuz aniqlanmadi");
    this.name = "NoFaceError";
  }
}

/** Yuz topildi, lekin kadrda to'liq emas yoki juda uzoq/kichik */
export class FacePartialError extends Error {
  constructor() {
    super("Yuz to'liq ko'rinmayapti");
    this.name = "FacePartialError";
  }
}

export const RESULT_STORAGE_KEY = "eyecheck-result";

// MediaPipe FaceMesh kontur indekslari
const RIGHT_EYE = [
  33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
];
const LEFT_EYE = [
  362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384,
  398,
];
const RIGHT_IRIS = { center: 468, edges: [469, 470, 471, 472] };
const LEFT_IRIS = { center: 473, edges: [474, 475, 476, 477] };

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

/**
 * Modelni oldindan yuklab qo'yish uchun ham chaqirsa bo'ladi.
 * Wasm va model fayllari o'zimizda host qilinadi — rasm qurilmadan chiqmaydi.
 */
export function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      const options = {
        baseOptions: {
          modelAssetPath: "/models/face_landmarker.task",
          delegate: "GPU" as const,
        },
        runningMode: "IMAGE" as const,
        numFaces: 1,
      };
      try {
        return await FaceLandmarker.createFromOptions(fileset, options);
      } catch {
        // Ba'zi qurilmalarda GPU delegati ishlamaydi — CPUga qaytamiz
        return FaceLandmarker.createFromOptions(fileset, {
          ...options,
          baseOptions: { ...options.baseOptions, delegate: "CPU" },
        });
      }
    })();
    landmarkerPromise.catch(() => {
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
}

type Pt = { x: number; y: number };

function toPixels(
  lm: NormalizedLandmark,
  w: number,
  h: number,
): Pt {
  return { x: lm.x * w, y: lm.y * h };
}

function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Chiziqli xaritalash: [inLo..inHi] → [0..100] */
function mapTo100(v: number, inLo: number, inHi: number): number {
  return clamp(((v - inLo) / (inHi - inLo)) * 100, 0, 100);
}

function analyzeEye(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  contourIdx: number[],
  iris: { center: number; edges: number[] },
  earIdx: { v1: [number, number]; v2: [number, number]; h: [number, number] },
  w: number,
  h: number,
): EyeMetrics {
  const poly = contourIdx.map((i) => toPixels(landmarks[i], w, h));
  const xs = poly.map((p) => p.x);
  const ys = poly.map((p) => p.y);
  const minX = Math.floor(Math.min(...xs));
  const maxX = Math.ceil(Math.max(...xs));
  const minY = Math.floor(Math.min(...ys));
  const maxY = Math.ceil(Math.max(...ys));

  const irisCenter = toPixels(landmarks[iris.center], w, h);
  const irisRadius =
    (iris.edges
      .map((i) => dist(irisCenter, toPixels(landmarks[i], w, h)))
      .reduce((a, b) => a + b, 0) /
      iris.edges.length) *
    1.18;

  const img = ctx.getImageData(
    minX,
    minY,
    Math.max(1, maxX - minX),
    Math.max(1, maxY - minY),
  );
  const data = img.data;
  const bw = img.width;

  // Sklera piksellari bo'yicha qizillik ulushi: R / (R+G+B)
  let sum = 0;
  let n = 0;
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      const p = { x: x + 0.5, y: y + 0.5 };
      if (!pointInPolygon(p, poly)) continue;
      if (dist(p, irisCenter) < irisRadius) continue;
      const o = ((y - minY) * bw + (x - minX)) * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const total = r + g + b;
      // Juda qorong'i piksellar — kiprik/soya, hisobga olinmaydi
      if (total < 150) continue;
      sum += r / total;
      n++;
    }
  }
  // Oq sklera ~0.33, qizargan ko'z ~0.42+
  const meanRatio = n > 0 ? sum / n : 0.33;
  const redness = mapTo100(meanRatio, 0.345, 0.43);

  // EAR — ko'z ochiqlik nisbati
  const d = (pair: [number, number]) =>
    dist(toPixels(landmarks[pair[0]], w, h), toPixels(landmarks[pair[1]], w, h));
  const ear = (d(earIdx.v1) + d(earIdx.v2)) / (2 * d(earIdx.h));
  const openness = mapTo100(ear, 0.14, 0.34);

  // Natija sahifasi uchun ko'z atrofidan kesma
  const cw = maxX - minX;
  const ch = maxY - minY;
  const pad = Math.max(cw, ch) * 0.45;
  const sx = clamp(minX - pad, 0, w);
  const sy = clamp(minY - pad, 0, h);
  const sw = clamp(cw + pad * 2, 1, w - sx);
  const sh = clamp(ch + pad * 2, 1, h - sy);
  const crop = document.createElement("canvas");
  const cropW = 240;
  crop.width = cropW;
  crop.height = Math.round((sh / sw) * cropW);
  crop
    .getContext("2d")!
    .drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, crop.width, crop.height);

  return {
    redness: Math.round(redness),
    openness: Math.round(openness),
    crop: crop.toDataURL("image/jpeg", 0.85),
  };
}

/**
 * Suratni tahlil qiladi: yuz nuqtalarini topadi, ikki ko'z bo'yicha
 * qizarish va ochiqlik ko'rsatkichlarini hisoblaydi.
 */
export async function analyzeCapture(
  canvas: HTMLCanvasElement,
): Promise<AnalysisResult> {
  const landmarker = await getFaceLandmarker();
  const detection = landmarker.detect(canvas);
  const landmarks = detection.faceLandmarks[0];
  if (!landmarks) throw new NoFaceError();

  // Ko'z sohalari kadr ichida to'liq bo'lishi shart — chetga chiqib ketgan
  // yoki juda uzoqdagi yuz bo'yicha o'lchash ishonchsiz bo'ladi
  const eyeIdx = [
    ...RIGHT_EYE,
    ...LEFT_EYE,
    RIGHT_IRIS.center,
    ...RIGHT_IRIS.edges,
    LEFT_IRIS.center,
    ...LEFT_IRIS.edges,
  ];
  for (const i of eyeIdx) {
    const lm = landmarks[i];
    if (lm.x < 0.03 || lm.x > 0.97 || lm.y < 0.03 || lm.y > 0.97) {
      throw new FacePartialError();
    }
  }
  // Ko'zlar orasi (yuz masshtabi): juda kichik bo'lsa, yuz juda uzoqda
  const eyeSpan = Math.hypot(
    landmarks[33].x - landmarks[263].x,
    landmarks[33].y - landmarks[263].y,
  );
  if (eyeSpan < 0.14) throw new FacePartialError();

  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const w = canvas.width;
  const h = canvas.height;

  // earIdx: vertikal juftliklar va gorizontal burchaklar (FaceMesh)
  const right = analyzeEye(
    ctx,
    landmarks,
    RIGHT_EYE,
    RIGHT_IRIS,
    { v1: [159, 145], v2: [158, 153], h: [33, 133] },
    w,
    h,
  );
  const left = analyzeEye(
    ctx,
    landmarks,
    LEFT_EYE,
    LEFT_IRIS,
    { v1: [386, 374], v2: [385, 380], h: [362, 263] },
    w,
    h,
  );

  const redness = Math.round((left.redness + right.redness) / 2);
  const openness = Math.round((left.openness + right.openness) / 2);
  const fatigue = 100 - openness;
  const score = Math.round(clamp(100 - 0.7 * redness - 0.3 * fatigue, 0, 100));
  const level: Level =
    score >= 75 ? "good" : score >= 50 ? "moderate" : "attention";

  return {
    score,
    redness,
    openness,
    level,
    left,
    right,
    capturedAt: Date.now(),
  };
}
