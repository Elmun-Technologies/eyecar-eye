"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeScanIcon, GlassesCrossed, CameraIcon } from "./icons";
import { FaceGuide } from "./FaceGuide";

type Step = "disclaimer" | "glasses" | "frame" | "ready";

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[88vh] w-full max-w-md overflow-y-auto rounded-3xl bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <EyeScanIcon className="h-9 w-9 shrink-0 text-foreground" />
      <h2 className="text-xl font-extrabold">{children}</h2>
    </div>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full border border-muted/60 py-3.5 font-bold text-muted transition hover:bg-black/5"
    >
      Bekor qilish
    </button>
  );
}

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full bg-accent-dark py-3.5 font-bold text-white transition hover:bg-accent-dark-hover"
    >
      {children}
    </button>
  );
}

/** «Ko'zni AI tekshiruvi» tugmasi + modal oqimi (bosh sahifa uchun) */
export function CheckFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step | null>(null);
  const close = () => setStep(null);

  return (
    <>
      <button
        onClick={() => setStep("disclaimer")}
        className="glow-card flex aspect-square flex-col items-center justify-center gap-3 rounded-[32px] bg-gradient-to-b from-[#d9e4f4] to-[#bed4ee] p-4 shadow-lg transition active:scale-[0.97]"
      >
        <EyeScanIcon className="h-16 w-16 text-foreground" />
        <span className="text-[15px] font-extrabold">
          Ko'zni AI tekshiruvi
        </span>
      </button>

      {step === "disclaimer" && (
        <ModalShell onClose={close}>
          <div className="mb-3 flex items-start gap-3">
            <EyeScanIcon className="h-12 w-12 shrink-0 text-foreground" />
            <div>
              <h2 className="text-xl font-extrabold">
                Ko'zni AI tekshiruvi
                <sup>※</sup>
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                ※ Maxsus algoritmimiz yordamida ko'zingiz holati tekshiriladi
              </p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed">
            Ushbu xizmat{" "}
            <span className="font-bold text-brand-red underline underline-offset-2">
              tibbiy qurilma hisoblanmaydi.
            </span>{" "}
            Tekshiruv natijasidan kasallikni aniqlash, davolash, oldini olish
            yoki shularga yordam berish maqsadida foydalanib bo'lmaydi. Agar
            belgilar uzoq vaqt o'tmasa, yaqin atrofdagi tibbiyot muassasasiga
            murojaat qiling.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed">
            Quyidagi «Tekshiruvga o'tish» tugmasini bosish orqali{" "}
            <Link href="/terms" className="font-bold underline underline-offset-2">
              foydalanish shartlariga
            </Link>{" "}
            rozilik bildirgan hisoblanasiz.
          </p>
          <div className="mt-6 space-y-3">
            <CancelButton onClick={close} />
            <PrimaryButton onClick={() => setStep("glasses")}>
              Tekshiruvga o'tish
            </PrimaryButton>
          </div>
        </ModalShell>
      )}

      {step === "glasses" && (
        <ModalShell onClose={close}>
          <ModalTitle>Ko'zni AI tekshiruvi</ModalTitle>
          <p className="mb-2 text-center font-bold text-brand-red underline underline-offset-2">
            Diqqat!
          </p>
          <p className="text-[15px] leading-relaxed">
            Suratga olishdan oldin{" "}
            <span className="font-bold underline underline-offset-2">
              ko'zoynakni yechib qo'ying.
            </span>{" "}
            Ko'zoynak bilan tekshiruv o'tkazilsa, natija noto'g'ri chiqishi
            mumkin.
          </p>
          <GlassesCrossed className="mx-auto my-6 w-48" />
          <div className="space-y-3">
            <CancelButton onClick={close} />
            <PrimaryButton onClick={() => setStep("frame")}>
              Keyingisi&ensp;1 / 2
            </PrimaryButton>
          </div>
        </ModalShell>
      )}

      {step === "frame" && (
        <ModalShell onClose={close}>
          <ModalTitle>Ko'zni AI tekshiruvi</ModalTitle>
          <p className="text-[15px] leading-relaxed">
            Ekranda ko'rinadigan{" "}
            <span className="font-bold text-brand-red underline underline-offset-2">
              yashil ramka ichiga yuzingiz imkon qadar katta joylashishi
            </span>{" "}
            uchun telefonni yaqinlashtirib-uzoqlashtirib moslang.
          </p>
          <FaceGuide className="my-5 w-56" />
          <div className="space-y-3">
            <CancelButton onClick={close} />
            <PrimaryButton onClick={() => setStep("ready")}>
              Keyingisi&ensp;2 / 2
            </PrimaryButton>
          </div>
        </ModalShell>
      )}

      {step === "ready" && (
        <ModalShell onClose={close}>
          <ModalTitle>Ko'zni AI tekshiruvi</ModalTitle>
          <p className="text-[15px] leading-relaxed">
            <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-green bg-white align-middle">
              <CameraIcon className="h-3.5 w-3.5 text-foreground" />
            </span>
            <span className="font-bold text-brand-red underline underline-offset-2">
              tugmasiga qarab, ko'zingizni katta oching.
            </span>
            <br />
            <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-green bg-white align-middle">
              <CameraIcon className="h-3.5 w-3.5 text-foreground" />
            </span>
            tugmasini bosing — hisob tugashi bilan surat olinadi.
          </p>
          <FaceGuide className="my-5 w-56" />
          <div className="space-y-3">
            <CancelButton onClick={close} />
            <PrimaryButton onClick={() => router.push("/check")}>
              Suratga olishga o'tish
            </PrimaryButton>
          </div>
        </ModalShell>
      )}
    </>
  );
}
