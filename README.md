# Smile — Shox parda tekshiruvi (MVP)

AI yordamida 10 soniyada ko'z holatini tekshiradigan mobil-birinchi veb-ilova —
LION «Smile» shox parda tekshiruvi xizmatining o'zbekcha moslamasi (O'zbekistondagi
rasmiy distribyutor uchun). Foydalanuvchi old kamera orqali suratga olinadi,
ko'z sohasi aniqlanib, qizarish va ochiqlik darajasi baholanadi, so'ng qisqa
tavsiya va «Smile» ko'z tomchilari taklif qilinadi.

> ⚠️ Ushbu xizmat **tibbiy qurilma emas** — natijalar tashxis o'rnini
> bosmaydi. Ilova ichidagi ogohlantirishlar shu sababli majburiy qism
> hisoblanadi.

## Boshqaruv paneli (`/admin`)

Mahsulotlarni distribyutor o'zi qo'shadi/tahrirlaydi: `/admin` sahifasi
(hech qayerda havola ko'rsatilmaydi). Imkoniyatlar: mahsulot qo'shish,
tahrirlash, o'chirish, tartibini o'zgartirish (karusel tartibi), **bir
nechta surat** yuklash (birinchisi — asosiy; katta suratlar brauzerda
avtomatik ≈1200px JPEG ga kichraytiriladi, shuning uchun telefon
suratlarini ham bemalol tanlash mumkin), ikkala tildagi tavsiflar,
belgilar, salqinlik, xususiyatlar va havolalar.

Vercel'da yoqish (2 qadam, keyin Redeploy):

1. **Settings → Environment Variables** — `ADMIN_PASSWORD` (kamida 8 belgi).
   Parol o'rnatilmaguncha panelga kirish butunlay yopiq.
2. **Storage → Create → Blob** — katalog `catalog/products.json` sifatida,
   suratlar `products/` papkada Blob'da saqlanadi.

Texnik jihatlar: katalog `/api/products` orqali o'qiladi; Blob ulanmagan
yoki xato bo'lsa sayt `src/config/site.ts` dagi boshlang'ich ro'yxat bilan
ishlayveradi. Sessiya — paroldan hosil qilingan HMAC, httpOnly cookie'da.
Saqlangan o'zgarishlar saytda ~1 daqiqada ko'rinadi (CDN kesh).
Eslatma: ko'z tahlili avvalgidek 100% brauzerda — serverga faqat mahsulot
ma'lumotlari boradi, surat emas.

## Buyurtmalar (zayavkalar)

Har bir mahsulot kartochkasida «Buyurtma berish» tugmasi bor: xaridor ism
va telefon raqamini qoldiradi. Zayavkalar Blob'da saqlanadi
(`orders/{id}.json` — har biri alohida fayl) va admin panelning
**Buyurtmalar** bo'limida ko'rinadi: telefonga bosib qo'ng'iroq qilish,
«Bajarildi» deb belgilash, o'chirish.

Ixtiyoriy: `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` muhit
o'zgaruvchilari o'rnatilsa, har yangi buyurtma haqida Telegram'ga xabar
keladi (BotFather'dan bot oching, botni guruhga qo'shing yoki shaxsiy
chat ID ni ishlating).

## Ikki tillilik (uz / ru)

Ilova ikki tilda ishlaydi: birinchi kirishda foydalanuvchidan til so'raladi
(O'zbekcha / Русский), tanlov `localStorage` da saqlanadi va bosh sahifadagi
UZ/RU tugmalari orqali keyin ham almashtiriladi. Barcha matnlar
`src/lib/i18n.tsx` dagi lug'atlarda — sahifalarga matn yozilmaydi.
Mahsulot tavsiflari `site.ts` da har ikkala tilda. Sahifalarda
«Powered by Dr Schats» belgisi ko'rsatiladi.

## Oqim

1. **Bosh sahifa** — ikkita asosiy tugma: «Ko'zni AI tekshiruvi» va «Ko'z tomchilari»
2. **Ogohlantirish modali** — xizmat tibbiy qurilma emasligi, shartlarga rozilik
3. **Yo'riqnoma (2 bosqich)** — ko'zoynakni yechish, yuzni yashil ramkaga joylashtirish
4. **Kamera** — old kamera, yashil oval ramka, 3-2-1 hisob bilan surat olish
5. **Tahlil** — MediaPipe Face Landmarker (to'liq brauzerda, rasm serverga yuborilmaydi)
6. **Natija** — shox parda va namlik skorlari, 5 yulduzli umumiy baho, ko'z kesmalari
7. **Ma'lumot sahifasi** — belgilar ro'yxati, shox parda shikastlanishi va
   A vitamini (gialuron kislota) haqida illyustratsiyalar bilan
8. **Ko'z tomchilari** — suriladigan mahsulotlar karuseli (nuqtalar, strelkalar,
   brend sahifasiga havola) + qidiruvga o'tish tugmasi
9. **Tomchi qidiruvi** — originaldagi 5 bosqichli so'rovnoma:
   belgilar (ko'p tanlov) → eng asosiy belgi → salqinlik hissi →
   foydalanish holati (linza) → mahsulot xususiyatlari.
   Natijada barcha shartlar bo'yicha qat'iy filtr ishlaydi; mos tomchi
   topilmasa, «eng asosiy belgi»ga mos vositalar ko'rsatiladi.
   Kartochkalarda A vitamini belgisi, 7 yulduzli salqinlik shkalasi va
   «Konservantsiz» chipi bor.

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
deploy qiling (Vercel). Sahifalar statik render bo'ladi; mahsulot katalogi
va admin panel uchun yengil serverless API (`/api/*`) ishlatiladi.

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
Har bir mahsulotda qidiruv uchun maydonlar bor:

| Maydon        | Ma'nosi                                              |
| ------------- | ---------------------------------------------------- |
| `symptoms`    | qaysi belgilarda tavsiya qilinadi                    |
| `cooling`     | salqinlik darajasi, 0–7 (originaldagi yulduzlar)     |
| `features`    | `vitaminA`, `preservativeFree`                       |
| `scenes`      | `naked` / `soft` / `hard` (linza bilan moslik)       |
| `image`       | mahsulot surati (`public/products/` ga joylang)      |
| `url`         | do'kon yoki brend sahifasi havolasi                  |

Ranglar va effektlar (Tailwind v4 tokenlari) — `src/app/globals.css` dagi
CSS o'zgaruvchilari orqali (`tailwind.config` yo'q).

## Qilinishi kerak (distribyutor ma'lumotlari)

Boshlang'ich katalogda faqat skrinshotlardan tasdiqlangan 2 mahsulot bor
(THE ONE Mild, MediClear DX) — taxminiy yozuvlar ataylab yo'q. Qolganlari
`/admin` paneli orqali kiritiladi:

- [ ] Qolgan assortiment (originalda karuselda 7 mahsulot bor edi)
- [ ] Mahsulot suratlari (admin paneldan yuklanadi)
- [ ] Do'kon/brend havolalari — havola kiritilmagan mahsulotda tugma
      umuman ko'rsatilmaydi (soxta havola yo'q)
- [ ] Salqinlik darajalari va tavsiflarni qadoq bo'yicha tasdiqlash

Alohida: foydalanish shartlari (`/terms`) matnini yuridik tekshiruvdan
o'tkazish.

## Tuzilma

```
src/
  app/
    page.tsx          # bosh sahifa
    check/page.tsx    # kamera + suratga olish
    result/page.tsx   # tahlil natijasi (skorlar, yulduzlar)
    info/page.tsx     # shox parda + A vitamini haqida
    products/page.tsx # ko'z tomchilari karuseli
    search/page.tsx   # tomchi qidiruvi (5 bosqichli so'rovnoma)
    terms/page.tsx    # foydalanish shartlari
  components/         # modal oqimi, nav, karusel, til darvozasi, illyustratsiyalar
  config/site.ts      # brend, mahsulotlar (uz/ru) va qidiruv mantiqlari
  lib/analysis.ts     # MediaPipe + ko'z tahlili
  lib/i18n.tsx        # uz/ru lug'atlari, LanguageProvider, til darvozasi
scripts/
  setup-assets.mjs    # postinstall: wasm + model tayyorlash
```
