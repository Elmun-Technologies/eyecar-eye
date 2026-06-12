import Link from "next/link";
import { site } from "@/config/site";

export const metadata = {
  title: `Foydalanish shartlari — ${site.brand}`,
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "1. Umumiy qoidalar",
    body: `Ushbu shartlar ${site.brand} «${site.title}» xizmatidan (keyingi o'rinlarda — Xizmat) foydalanish tartibini belgilaydi. Xizmatdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.`,
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
    body: "Xizmatda ko'rsatiladigan davo vositalari haqidagi ma'lumotlar reklama-axborot xarakteriga ega. Har qanday vositani qo'llashdan oldin yo'riqnoma bilan tanishing va zarur bo'lsa mutaxassis bilan maslahatlashing.",
  },
  {
    title: "6. Shartlarning o'zgarishi",
    body: "Biz ushbu shartlarni oldindan ogohlantirmasdan yangilash huquqini saqlab qolamiz. Yangilangan shartlar ushbu sahifada e'lon qilingan paytdan kuchga kiradi.",
  },
];

export default function TermsPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <h1 className="relative text-xl font-extrabold">
        Foydalanish shartlari
      </h1>

      <section className="relative mt-5 space-y-5 rounded-3xl bg-surface p-6 shadow-sm">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-extrabold">{s.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/85">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      <Link
        href="/"
        className="relative mt-8 block w-full rounded-full border border-muted/60 py-3.5 text-center font-bold text-muted transition hover:bg-black/5"
      >
        Bosh sahifa
      </Link>
    </main>
  );
}
