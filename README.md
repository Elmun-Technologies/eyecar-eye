# EyeCare — Ko'z tekshiruvi (MVP)

AI yordamida 10 soniyada ko'z holatini tekshiradigan mobil-birinchi veb-ilova.
Foydalanuvchi old kamera orqali suratga olinadi, ko'z sohasi aniqlanib,
qizarish va ochiqlik darajasi baholanadi, so'ng qisqa tavsiya va sinovdan
o'tgan davo vositalari taklif qilinadi.

> ⚠️ Ushbu xizmat **tibbiy qurilma emas** — natijalar tashxis o'rnini
> bosmaydi. Ilova ichidagi ogohlantirishlar shu sababli majburiy qism
> hisoblanadi.

## Oqim

1. **Bosh sahifa** — ikkita asosiy tugma: «Ko'zni AI tekshiruvi» va «Davo vositalari»
2. **Ogohlantirish modali** — xizmat tibbiy qurilma emasligi, shartlarga rozilik
3. **Yo'riqnoma (2 bosqich)** — ko'zoynakni yechish, yuzni yashil ramkaga joylashtirish
4. **Kamera** — old kamera, yashil oval ramka, 3-2-1 hisob bilan surat olish
5. **Tahlil** — MediaPipe Face Landmarker (to'liq brauzerda, rasm serverga yuborilmaydi)
6. **Natija** — shox parda va namlik skorlari, 5 yulduzli umumiy baho, ko'z kesmalari
7. **Ma'lumot sahifasi** — shox parda shikastlanishi haqida + davo vositasi tavsiyasi

## Texnologiyalar

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4** + **React 19**
- **@mediapipe/tasks-vision** — Face Landmarker (478 nuqta, iris bilan)
  - wasm va model self-hosted: `npm install` paytida `scripts/setup-assets.mjs`
    (postinstall) wasm'ni paketdan ko'chiradi, modelni yuklab oladi
  - tahlil 100% klient tomonida — maxfiylik uchun rasm qurilmadan chiqmaydi

## Ishga tushirish

Talab: **Node.js 20.9+**

```bash
npm install   # postinstall MediaPipe aktivlarini ham tayyorlaydi
npm run dev
```

Kamera faqat **HTTPS** yoki `localhost` da ishlaydi. Telefonda sinash uchun
`npm run dev` ni tunnel (masalan, ngrok / cloudflared) orqali oching yoki
deploy qiling (Vercel va h.k.) — backend talab qilinmaydi, barcha sahifalar
statik render bo'ladi.

### Skriptlar

| Buyruq          | Vazifasi                                            |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Lokal dev server                                    |
| `npm run build` | Production build (TypeScript tekshiruvi bilan)      |
| `npm run start` | Build qilingan ilovani ishga tushirish              |
| `npm run lint`  | ESLint (flat config, `eslint.config.mjs`)           |

### MediaPipe aktivlari

`public/mediapipe/` va `public/models/` git'ga kiritilmaydi (`.gitignore`) —
ularni `npm install` dagi postinstall skripti tayyorlaydi:

- wasm fayllari `node_modules/@mediapipe/tasks-vision` dan ko'chiriladi
- `face_landmarker.task` modeli (≈3.7MB) Google storage'dan yuklab olinadi

Internet bo'lmasa skript modelni yuklay olmaydi — xabarda ko'rsatilgan
URL'dan qo'lda yuklab, `public/models/face_landmarker.task` sifatida saqlang.
Qayta yuklash uchun fayllarni o'chirib `npm install` ni qayta ishga tushiring.

## Tahlil algoritmi (MVP, evristik)

`src/lib/analysis.ts`:

- Ko'z konturi ichidagi piksellar (iris doirasi chiqarib tashlanadi) bo'yicha
  **qizillik ulushi** `R/(R+G+B)` o'rtachasi olinadi: oq sklera ≈ 0.33,
  qizargan ko'z ≈ 0.42+
- **EAR** (Eye Aspect Ratio) orqali ko'z ochiqligi — charchoq belgisi sifatida
- Umumiy ball: `100 − 0.7·qizarish − 0.3·charchoq`, darajalar:
  ≥75 yaxshi / ≥50 o'rtacha / <50 e'tibor talab

> ⚠️ Bu evristik baho — tibbiy tashxis emas. Kalibrlash koeffitsiyentlari
> `analysis.ts` ichida bitta joyda turibdi.

Natija `sessionStorage` orqali `/result` sahifasiga uzatiladi — server yo'q,
surat va skorlar qurilmadan chiqmaydi.

## Sozlash

Brend nomi, sarlavha va mahsulotlar ro'yxati bitta faylda: `src/config/site.ts`.
Ranglar va effektlar (Tailwind v4 tokenlari) — `src/app/globals.css` dagi
CSS o'zgaruvchilari orqali (`tailwind.config` yo'q).

## Tuzilma

```
src/
  app/
    page.tsx          # bosh sahifa
    check/page.tsx    # kamera + suratga olish
    result/page.tsx   # tahlil natijasi (skorlar, yulduzlar)
    info/page.tsx     # shox parda haqida + mahsulot CTA
    products/page.tsx # davo vositalari
    terms/page.tsx    # foydalanish shartlari
  components/         # modal oqimi, nav, ikonkalar, illyustratsiyalar
  config/site.ts      # brend va mahsulotlar
  lib/analysis.ts     # MediaPipe + ko'z tahlili
scripts/
  setup-assets.mjs    # postinstall: wasm + model tayyorlash
```
