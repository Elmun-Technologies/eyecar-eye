"use client";

/**
 * Ikki tillilik (uz/ru): lug'atlar, kontekst-provider va til tanlash darvozasi.
 * Tanlangan til localStorage'da saqlanadi; birinchi kirishda foydalanuvchidan
 * til so'raladi. Barcha UI matnlari shu yerda — sahifalarda matn yozilmaydi.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { LanguageGate } from "@/components/LanguageGate";

export type Lang = "uz" | "ru";

const STORAGE_KEY = "smile-lang";

const uz = {
  common: {
    poweredBy: "Powered by Dr Schats",
    next: "Keyingisi",
    back: "Orqaga",
    cancel: "Bekor qilish",
  },
  nav: {
    home: "Bosh sahifa",
    check: "Ko'zni AI tekshiruvi",
    search: "Tomchi qidiruvi",
  },
  /** BrandHeader: {pre} [{bracket}] {post} */
  header: { pre: "Smile", bracket: "Shox parda", post: "tekshiruvi" },
  home: {
    titlePre: "",
    titleBracket: "Shox parda",
    titlePost: "tekshiruvi",
    tagline: "10 soniyada ko'z salomatligi tekshiruvi!",
    bubblePre: "",
    bubblePost: "da AI yordamida ko'zingizni tekshirishingiz mumkin!",
    cardCheck: "Ko'zni AI tekshiruvi",
    cardProducts: "Ko'z tomchilari",
    terms: "Foydalanish shartlari",
  },
  flow: {
    title: "Ko'zni AI tekshiruvi",
    titleNote: "※ Maxsus algoritmimiz yordamida ko'zingiz holati tekshiriladi",
    p1pre: "Ushbu xizmat",
    p1bold: "tibbiy qurilma hisoblanmaydi.",
    p1post:
      "Tekshiruv natijasidan kasallikni aniqlash, davolash, oldini olish yoki shularga yordam berish maqsadida foydalanib bo'lmaydi. Agar belgilar uzoq vaqt o'tmasa, yaqin atrofdagi tibbiyot muassasasiga murojaat qiling.",
    p2pre: "Quyidagi «Tekshiruvga o'tish» tugmasini bosish orqali",
    p2link: "foydalanish shartlariga",
    p2post: "rozilik bildirgan hisoblanasiz.",
    start: "Tekshiruvga o'tish",
    attention: "Diqqat!",
    glassesPre: "Suratga olishdan oldin",
    glassesBold: "ko'zoynakni yechib qo'ying.",
    glassesPost:
      "Ko'zoynak bilan tekshiruv o'tkazilsa, natija noto'g'ri chiqishi mumkin.",
    next1: "Keyingisi 1 / 2",
    framePre: "Ekranda ko'rinadigan",
    frameBold: "yashil ramka ichiga yuzingiz imkon qadar katta joylashishi",
    framePost: "uchun telefonni yaqinlashtirib-uzoqlashtirib moslang.",
    next2: "Keyingisi 2 / 2",
    readyBold1: "tugmasiga qarab, ko'zingizni katta oching.",
    ready2: "tugmasini bosing — hisob tugashi bilan surat olinadi.",
    go: "Suratga olishga o'tish",
  },
  check: {
    camDenied: "Kameraga ruxsat berilmadi",
    camDeniedHint:
      "Tekshiruv uchun brauzer sozlamalaridan kameraga ruxsat bering va sahifani yangilang.",
    retry: "Qayta urinish",
    notReady: "Kamera tayyor emas, qayta urinib ko'ring.",
    noFace:
      "Yuz aniqlanmadi. Iltimos, yuzingiz to'liq ko'rinsin — yorug'roq joyda, ramka ichiga joylashtirib qayta urining.",
    facePartial:
      "Yuzingiz to'liq ko'rinmayapti. Iltimos, yuzingizni (ikkala ko'z bilan) ramka ichiga to'liq joylashtirib, qayta urining.",
    analyzeError: "Tahlil vaqtida xatolik yuz berdi. Qayta urinib ko'ring.",
    analyzing: "AI tahlil qilmoqda…",
    starting: "Kamera yoqilmoqda…",
    hintPost: "tugmasiga qarab, ko'zingizni katta oching va tugmani bosing.",
    capture: "Suratga olish",
    qrTitle: "Tekshiruvni telefonda davom ettiring",
    qrText:
      "Bu tekshiruv telefonning old kamerasiga mo'ljallangan. Telefon kamerasi bilan QR kodni skanerlang — tekshiruv telefonda davom etadi.",
    qrContinue: "Baribir kompyuter kamerasida davom etish",
  },
  result: {
    title: "Ko'zni AI tekshiruvi natijasi",
    corneaScore: "Shox parda skori",
    tearScore: "Namlik skori",
    belowAvg: "O'rtachadan pastroq",
    aboveAvg: "O'rtachadan yuqoriroq",
    totalTitle: "Ko'zning umumiy bahosi",
    starsWord: (n: number) => `«${n} yulduz»`,
    verdicts: {
      5: "Ajoyib! Ko'zingiz holati juda yaxshi.",
      4: "Yaxshi holat — dam olishni unutmang.",
      3: "Ko'zingizni ortiqcha zo'riqtirayotgan bo'lishingiz mumkin.",
      2: "Ko'z charchog'i sezilarli — parvarish talab etiladi.",
      1: "Ko'zingiz holatiga jiddiy e'tibor bering.",
    } as Record<number, string>,
    note: "※ Umumiy baho shox parda va namlik skorlarini o'z ichiga olgan, ko'z bilan bog'liq 4 ta ko'rsatkichdan jamlab hisoblanadi.",
    rightEye: "O'ng ko'z",
    leftEye: "Chap ko'z",
    disclaimerPre: "Ushbu xizmat",
    disclaimerBold: "tibbiy qurilma hisoblanmaydi",
    disclaimerPost:
      "va natijalar tashxis o'rnini bosmaydi. Belgilar uzoq davom etsa, tibbiyot muassasasiga murojaat qiling.",
    diagramTear: "Yosh",
    diagramCornea: ["Shox", "parda"],
  },
  info: {
    h1pre: "Sizning",
    h1red: "«shox pardangiz»",
    h1post: "joyidami?",
    checklistT1: "Ko'zdagi turli noqulay sezgilarga aslida shox parda shikastlanishi",
    checklistT2: "sabab bo'layotgan bo'lishi mumkin",
    rubNote: "※ yengil ishqalanish natijasida",
    symptoms: [
      "Kuniga 5 soatdan ko'proq TV, smartfon yoki kompyuter ekraniga qaraysiz",
      "Kun davomida ko'zga qum tushgandek g'ijirlab turadi",
      "Ko'zni 10 soniyadan ortiq ochiq tutib turolmaysiz",
      "Ko'z vaqti-vaqti bilan og'rib turadi",
      "Ko'z doim qurib, xira va charchagan his etiladi",
    ],
    damageTitleRed: "Shox parda shikastlanishi",
    damageTitlePost: "nima?",
    damageTextRed: "Shox parda shikastlanishi",
    damageTextPost:
      "— ko'z yuzasi zararlangan, ammo tashqaridan qaraganda bilinmaydigan holat.",
    normalEye: "Oddiy holatdagi ko'z",
    damagedEyeL1: "Maxsus usul bilan shox parda",
    damagedEyeL2: "shikasti ko'rsatilgan",
    damagedArrow: "shikast",
    aging:
      "Yosh o'tishi, kompyuter, smartfon va linzalardan uzoq vaqt foydalanish kabi omillar ta'sirida zamonaviy insonlarda shox parda shikastlanishi tez-tez uchraydi.",
    crackCap1: "Tiklanish quvvati pasaysa, ko'z",
    crackCap2: "o'z holiga qaytishi qiyinlashadi",
    worsen:
      "Shox parda shikastlanishi ko'z charchog'i, xiralik va qizarish kabi turli belgilarning kuchayishiga olib kelishi mumkin.",
    wordTired: "Charchoq",
    wordBlur: "Xiralik",
    wordRed: "Qizarish",
    wordItch: "Qichishish",
    vt1: "Shox parda shikastlanishini",
    vt2: "tiklashda",
    vtOrange: "A vitamini",
    vt3: "samarali",
    vitaminOrange: "A vitamini",
    vitaminRest:
      "gialuron kislota ishlab chiqarilishini rag'batlantiradi, ko'z yoshi qatlamini barqarorlashtiradi va shikastlangan shox pardaning tiklanishini tezlashtiradi.",
    dropLine: "vitamini",
    imgNote: "※ tasviriy chizma",
    hyaluronL1: "Shox parda epiteliy hujayralari tiklanishini",
    hyaluronL2: "rag'batlantiruvchi «gialuron kislota» ishlab chiqariladi",
    legend: "— gialuron kislota",
    backL1: "Tekshiruv natijasiga",
    backL2: "qaytish",
  },
  products: {
    titleL1: "Shox pardani tiklovchi A vitaminli",
    titleL2: "ko'z tomchilari",
    tap: "Tomchi rasmini bosib brend sahifasiga o'ting",
    ctaL1: "Belgilaringizga mos ko'z",
    ctaL2: "tomchisini qidirish",
    ariaPrev: "Oldingi mahsulot",
    ariaNext: "Keyingi mahsulot",
    ariaDot: (n: number) => `${n}-mahsulot`,
  },
  search: {
    title: "Ko'z tomchisi qidiruvi",
    multiNote: "(bir nechtasini tanlash mumkin)",
    stepSymptoms: "Bezovta qilayotgan belgilarni tanlang",
    stepPrimary: "Eng bezovta qilayotgan belgini tanlang",
    stepCooling: "Tomizish hissi (salqinlik)ni tanlang",
    stepScene: "Foydalanish holatini tanlang",
    stepFeatures: "Mahsulot xususiyatlarini tanlang",
    symptoms: {
      tired: "Ko'z charchog'i",
      dry: "Quruq ko'z (ko'z qurishi)",
      blur: "Ko'z xiralashishi (yiring va h.k. sabab)",
      itch: "Ko'z qichishishi",
      red: "Ko'z qizarishi",
      contact: "Linza taqqandagi noqulaylik",
    },
    coolingOpts: {
      any: "Farqi yo'q",
      none: "Salqinliksiz",
      mild: "Yengil salqinlik",
      strong: "Kuchli salqinlik",
    },
    sceneOpts: {
      any: "Farqi yo'q",
      naked: "Linzasiz (oddiy ko'zga)",
      soft: "Yumshoq kontakt linza taqqanda",
      hard: "Qattiq kontakt linza taqqanda",
    },
    featureOpts: {
      vitaminA: "A vitamini (shox parda tiklovchi komponent) bilan",
      preservativeFree: "Konservantsiz",
    },
    seeResults: "Natijani ko'rish",
    exact1: "Shartlaringizga mos ko'z tomchilari",
    exactBlue: "topildi:",
    fallback1: "Qidiruv shartlarining barchasiga mos tomchi topilmadi, ammo",
    fallbackBlue: "«eng bezovta qilayotgan belgi»",
    fallback2: "ga mos tomchilar quyidagilar:",
    empty:
      "Bu shartlarga mos tomchi hozircha katalogda yo'q. Boshqa belgilarni tanlab, qaytadan urinib ko'ring.",
    vitaminBadge: "A vitamini (shox parda tiklovchi komponent) bilan",
    preservativeFree: "Konservantsiz",
    coolingLabel: "Salqinlik",
    brandPage: "Mahsulot brend sahifasi",
    again: "Qaytadan qidirish",
  },
  order: {
    button: "Buyurtma berish",
    title: "Buyurtma berish",
    subtitle: "Zayavka qoldiring — tez orada o'zimiz aloqaga chiqamiz.",
    nameLabel: "Ismingiz",
    namePlaceholder: "Masalan: Aziz",
    phoneLabel: "Telefon raqamingiz",
    phonePlaceholder: "+998 90 123 45 67",
    nameError: "Ismingizni kiriting.",
    phoneError: "Telefon raqamini to'liq kiriting.",
    submit: "Yuborish",
    sending: "Yuborilmoqda…",
    success: "Rahmat! Buyurtmangiz qabul qilindi — tez orada aloqaga chiqamiz.",
    error: "Yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
    privacy: "Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi.",
    close: "Yopish",
  },
  terms: {
    title: "Foydalanish shartlari",
    backHome: "Bosh sahifa",
    sections: [
      {
        title: "1. Umumiy qoidalar",
        body: "Ushbu shartlar Smile «Shox parda tekshiruvi» xizmatidan (keyingi o'rinlarda — Xizmat) foydalanish tartibini belgilaydi. Xizmatdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.",
      },
      {
        title: "2. Xizmat tibbiy qurilma emas",
        body: "Xizmat tibbiy qurilma hisoblanmaydi. Tekshiruv natijalaridan kasallikni aniqlash, davolash, oldini olish yoki shularga yordam berish maqsadida foydalanib bo'lmaydi. Natijalar faqat ma'lumot xarakteriga ega. Ko'z bilan bog'liq belgilar uzoq davom etsa, tibbiyot muassasasiga murojaat qiling.",
      },
      {
        title: "3. Shaxsiy ma'lumotlar va surat",
        body: "Ko'zni AI tekshiruvi to'liq qurilmangizning o'zida (brauzerda) bajariladi: olingan surat serverga yuborilmaydi va saqlanmaydi. Natijalar faqat joriy brauzer sessiyasida vaqtincha saqlanadi va sahifa yopilganda o'chadi.",
      },
      {
        title: "4. Javobgarlikni cheklash",
        body: "Xizmat «boricha» taqdim etiladi. Tekshiruv natijalarining aniqligi kafolatlanmaydi — natija yorug'lik, kamera sifati va boshqa omillarga bog'liq. Xizmatdan foydalanish natijasida yuzaga kelgan har qanday zarar uchun javobgarlik foydalanuvchining o'zida qoladi.",
      },
      {
        title: "5. Tavsiya etiladigan vositalar",
        body: "Xizmatda ko'rsatiladigan vositalar haqidagi ma'lumotlar reklama-axborot xarakteriga ega. Har qanday vositani qo'llashdan oldin yo'riqnoma bilan tanishing va zarur bo'lsa mutaxassis bilan maslahatlashing.",
      },
      {
        title: "6. Shartlarning o'zgarishi",
        body: "Biz ushbu shartlarni oldindan ogohlantirmasdan yangilash huquqini saqlab qolamiz. Yangilangan shartlar ushbu sahifada e'lon qilingan paytdan kuchga kiradi.",
      },
    ],
  },
};

type Dict = typeof uz;

const ru: Dict = {
  common: {
    poweredBy: "Powered by Dr Schats",
    next: "Далее",
    back: "Назад",
    cancel: "Отмена",
  },
  nav: {
    home: "Главная",
    check: "AI-проверка глаз",
    search: "Подбор капель",
  },
  header: { pre: "Smile — проверка", bracket: "роговицы", post: "" },
  home: {
    titlePre: "Проверка",
    titleBracket: "роговицы",
    titlePost: "",
    tagline: "Проверка здоровья глаз за 10 секунд!",
    bubblePre: "В",
    bubblePost: "можно проверить глаза с помощью ИИ!",
    cardCheck: "AI-проверка глаз",
    cardProducts: "Глазные капли",
    terms: "Условия использования",
  },
  flow: {
    title: "AI-проверка глаз",
    titleNote:
      "※ Состояние ваших глаз проверяется с помощью нашего специального алгоритма",
    p1pre: "Данный сервис",
    p1bold: "не является медицинским изделием.",
    p1post:
      "Результаты проверки нельзя использовать для диагностики, лечения или профилактики заболеваний. Если симптомы сохраняются долго, обратитесь в ближайшее медицинское учреждение.",
    p2pre: "Нажимая кнопку «Перейти к проверке» ниже, вы соглашаетесь с",
    p2link: "условиями использования",
    p2post: "сервиса.",
    start: "Перейти к проверке",
    attention: "Внимание!",
    glassesPre: "Перед съёмкой",
    glassesBold: "снимите очки.",
    glassesPost:
      "Если проходить проверку в очках, результат может оказаться неверным.",
    next1: "Далее 1 / 2",
    framePre: "Приблизьте или отдалите телефон так, чтобы",
    frameBold: "лицо максимально крупно поместилось в зелёную рамку",
    framePost: "на экране.",
    next2: "Далее 2 / 2",
    readyBold1: "— смотрите на эту кнопку и широко откройте глаза.",
    ready2: "— нажмите кнопку, снимок будет сделан по окончании отсчёта.",
    go: "Перейти к съёмке",
  },
  check: {
    camDenied: "Доступ к камере не разрешён",
    camDeniedHint:
      "Разрешите доступ к камере в настройках браузера и обновите страницу.",
    retry: "Попробовать снова",
    notReady: "Камера не готова, попробуйте ещё раз.",
    noFace:
      "Лицо не распознано. Пожалуйста, убедитесь, что лицо видно полностью — повторите в более освещённом месте, поместив лицо в рамку.",
    facePartial:
      "Лицо видно не полностью. Пожалуйста, полностью поместите лицо (с обоими глазами) в рамку и попробуйте ещё раз.",
    analyzeError: "Во время анализа произошла ошибка. Попробуйте ещё раз.",
    analyzing: "ИИ анализирует…",
    starting: "Камера включается…",
    hintPost: "— смотрите на эту кнопку, широко откройте глаза и нажмите её.",
    capture: "Сделать снимок",
    qrTitle: "Продолжите проверку на телефоне",
    qrText:
      "Проверка рассчитана на фронтальную камеру телефона. Отсканируйте QR-код камерой телефона — проверка продолжится там.",
    qrContinue: "Всё равно продолжить с камерой компьютера",
  },
  result: {
    title: "Результат AI-проверки глаз",
    corneaScore: "Балл роговицы",
    tearScore: "Балл увлажнённости",
    belowAvg: "Ниже среднего",
    aboveAvg: "Выше среднего",
    totalTitle: "Общая оценка глаз",
    starsWord: (n: number) =>
      n === 1 ? "«1 звезда»" : n < 5 ? `«${n} звезды»` : "«5 звёзд»",
    verdicts: {
      5: "Отлично! Ваши глаза в прекрасном состоянии.",
      4: "Хорошее состояние — не забывайте отдыхать.",
      3: "Возможно, вы перенапрягаете глаза.",
      2: "Заметная усталость глаз — нужен уход.",
      1: "Обратите серьёзное внимание на состояние глаз.",
    } as Record<number, string>,
    note: "※ Общая оценка складывается из 4 связанных с глазами показателей, включая баллы роговицы и увлажнённости.",
    rightEye: "Правый глаз",
    leftEye: "Левый глаз",
    disclaimerPre: "Данный сервис",
    disclaimerBold: "не является медицинским изделием",
    disclaimerPost:
      "— результаты не заменяют диагноз. Если симптомы сохраняются, обратитесь к врачу.",
    diagramTear: "Слеза",
    diagramCornea: ["Роговица"],
  },
  info: {
    h1pre: "Ваша",
    h1red: "«роговица»",
    h1post: "в порядке?",
    checklistT1:
      "Причиной различных неприятных ощущений в глазах может быть повреждение роговицы",
    checklistT2: "",
    rubNote: "※ из-за лёгкого трения",
    symptoms: [
      "Смотрите на экран ТВ, смартфона или компьютера более 5 часов в день",
      "Весь день в глазах ощущение, будто попал песок",
      "Не получается держать глаза открытыми дольше 10 секунд",
      "Глаза время от времени болят",
      "Глаза постоянно сухие, мутные и уставшие",
    ],
    damageTitleRed: "Повреждение роговицы",
    damageTitlePost: "— что это?",
    damageTextRed: "Повреждение роговицы",
    damageTextPost:
      "— это состояние, при котором поверхность глаза повреждена, но внешне это незаметно.",
    normalEye: "Глаз в обычном состоянии",
    damagedEyeL1: "Повреждения роговицы показаны",
    damagedEyeL2: "специальным методом",
    damagedArrow: "повреждение",
    aging:
      "С возрастом, при долгой работе за компьютером, со смартфоном и при ношении линз повреждение роговицы у современного человека встречается всё чаще.",
    crackCap1: "Если способность к восстановлению слабеет,",
    crackCap2: "глазу трудно вернуться в норму",
    worsen:
      "Повреждение роговицы может усиливать усталость глаз, помутнение, покраснение и другие симптомы.",
    wordTired: "Усталость",
    wordBlur: "Мутность",
    wordRed: "Краснота",
    wordItch: "Зуд",
    vt1: "Для восстановления повреждений роговицы",
    vt2: "эффективен",
    vtOrange: "витамин A",
    vt3: "",
    vitaminOrange: "Витамин A",
    vitaminRest:
      "стимулирует выработку гиалуроновой кислоты, стабилизирует слёзную плёнку и ускоряет восстановление повреждённой роговицы.",
    dropLine: "витамин",
    imgNote: "※ схематичное изображение",
    hyaluronL1: "Вырабатывается «гиалуроновая кислота»,",
    hyaluronL2: "стимулирующая восстановление эпителия",
    legend: "— гиалуроновая кислота",
    backL1: "Вернуться к",
    backL2: "результату",
  },
  products: {
    titleL1: "Глазные капли с витамином A",
    titleL2: "для восстановления роговицы",
    tap: "Нажмите на изображение капель — откроется страница бренда",
    ctaL1: "Подбор капель,",
    ctaL2: "подходящих вашим симптомам",
    ariaPrev: "Предыдущий продукт",
    ariaNext: "Следующий продукт",
    ariaDot: (n: number) => `Продукт ${n}`,
  },
  search: {
    title: "Подбор глазных капель",
    multiNote: "(можно несколько)",
    stepSymptoms: "Выберите беспокоящие симптомы",
    stepPrimary: "Выберите самый беспокоящий симптом",
    stepCooling: "Выберите ощущение при закапывании (прохладу)",
    stepScene: "Выберите ситуацию использования",
    stepFeatures: "Выберите особенности продукта",
    symptoms: {
      tired: "Усталость глаз",
      dry: "Сухость глаз",
      blur: "Помутнение зрения (выделения и т.п.)",
      itch: "Зуд в глазах",
      red: "Покраснение глаз",
      contact: "Дискомфорт при ношении линз",
    },
    coolingOpts: {
      any: "Не важно",
      none: "Без охлаждения",
      mild: "Лёгкая прохлада",
      strong: "Сильная прохлада",
    },
    sceneOpts: {
      any: "Не важно",
      naked: "Без линз (обычные глаза)",
      soft: "С мягкими контактными линзами",
      hard: "С жёсткими контактными линзами",
    },
    featureOpts: {
      vitaminA: "С витамином A (восстановление роговицы)",
      preservativeFree: "Без консервантов",
    },
    seeResults: "Показать результат",
    exact1: "Подходящие под ваши условия капли",
    exactBlue: "найдены:",
    fallback1: "Капель, подходящих под все условия поиска, не нашлось, но под",
    fallbackBlue: "«самый беспокоящий симптом»",
    fallback2: "подходят следующие:",
    empty:
      "Капель, подходящих под эти условия, пока нет в каталоге. Попробуйте выбрать другие симптомы и повторить поиск.",
    vitaminBadge: "С витамином A (компонент для восстановления роговицы)",
    preservativeFree: "Без консервантов",
    coolingLabel: "Прохлада",
    brandPage: "Страница бренда",
    again: "Искать заново",
  },
  order: {
    button: "Оставить заявку",
    title: "Оставить заявку",
    subtitle: "Оставьте заявку — мы свяжемся с вами в ближайшее время.",
    nameLabel: "Ваше имя",
    namePlaceholder: "Например: Азиз",
    phoneLabel: "Номер телефона",
    phonePlaceholder: "+998 90 123 45 67",
    nameError: "Введите ваше имя.",
    phoneError: "Введите номер телефона полностью.",
    submit: "Отправить",
    sending: "Отправляется…",
    success: "Спасибо! Заявка принята — мы скоро свяжемся с вами.",
    error: "Не удалось отправить. Проверьте интернет и попробуйте ещё раз.",
    privacy: "Ваши данные используются только для связи с вами.",
    close: "Закрыть",
  },
  terms: {
    title: "Условия использования",
    backHome: "Главная",
    sections: [
      {
        title: "1. Общие положения",
        body: "Настоящие условия определяют порядок использования сервиса Smile «Проверка роговицы» (далее — Сервис). Используя Сервис, вы соглашаетесь с настоящими условиями.",
      },
      {
        title: "2. Сервис не является медицинским изделием",
        body: "Сервис не является медицинским изделием. Результаты проверки нельзя использовать для диагностики, лечения, профилактики заболеваний или содействия им. Результаты носят исключительно информационный характер. Если симптомы со стороны глаз сохраняются длительное время, обратитесь в медицинское учреждение.",
      },
      {
        title: "3. Персональные данные и снимок",
        body: "AI-проверка глаз полностью выполняется на вашем устройстве (в браузере): сделанный снимок не отправляется на сервер и не сохраняется. Результаты временно хранятся только в текущей сессии браузера и удаляются при закрытии страницы.",
      },
      {
        title: "4. Ограничение ответственности",
        body: "Сервис предоставляется «как есть». Точность результатов проверки не гарантируется — результат зависит от освещения, качества камеры и других факторов. Ответственность за любой ущерб, возникший в результате использования Сервиса, остаётся на пользователе.",
      },
      {
        title: "5. Рекомендуемые средства",
        body: "Информация о средствах, отображаемых в Сервисе, носит рекламно-информационный характер. Перед применением любого средства ознакомьтесь с инструкцией и при необходимости проконсультируйтесь со специалистом.",
      },
      {
        title: "6. Изменение условий",
        body: "Мы сохраняем за собой право обновлять настоящие условия без предварительного уведомления. Обновлённые условия вступают в силу с момента публикации на этой странице.",
      },
    ],
  },
};

export const dictionaries: Record<Lang, Dict> = { uz, ru };

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // SSR/prerender uchun standart — uz; mount'dan keyin saqlangan til o'qiladi
  const [lang, setLangState] = useState<Lang>("uz");
  // null — hali aniqlanmagan (server/mountgacha), false — tanlanmagan (darvoza)
  const [chosen, setChosen] = useState<boolean | null>(null);

  useEffect(() => {
    // localStorage faqat klientda bor — hydration mosligini buzmaslik
    // uchun mount'dan keyin o'qiladi
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "uz" || stored === "ru") {
      setLangState(stored);
      setChosen(true);
    } else {
      setChosen(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
    setChosen(true);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
      {chosen === false && <LanguageGate onPick={setLang} />}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang LanguageProvider ichida chaqirilishi kerak");
  return ctx;
}
