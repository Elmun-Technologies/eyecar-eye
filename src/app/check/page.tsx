"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "@/components/icons";
import {
  analyzeCapture,
  getFaceLandmarker,
  NoFaceError,
  RESULT_STORAGE_KEY,
} from "@/lib/analysis";

type Phase = "init" | "ready" | "countdown" | "analyzing" | "camera-error";

export default function CheckPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("init");
  const [count, setCount] = useState(3);
  const [message, setMessage] = useState<string | null>(null);

  // Kamerani ishga tushirish + modelni oldindan yuklash
  useEffect(() => {
    let cancelled = false;
    getFaceLandmarker().catch(() => {});

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setPhase("ready");
      } catch {
        if (!cancelled) setPhase("camera-error");
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      setPhase("ready");
      setMessage("Kamera tayyor emas, qayta urinib ko'ring.");
      return;
    }
    setPhase("analyzing");
    setMessage(null);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d", { willReadFrequently: true })!
      .drawImage(video, 0, 0);

    try {
      const result = await analyzeCapture(canvas);
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      streamRef.current?.getTracks().forEach((t) => t.stop());
      router.push("/result");
    } catch (e) {
      if (e instanceof NoFaceError) {
        setMessage(
          "Yuz aniqlanmadi. Yorug'roq joyda, yuzingizni ramka ichiga to'liq joylashtirib qayta urining.",
        );
      } else {
        setMessage(
          "Tahlil vaqtida xatolik yuz berdi. Qayta urinib ko'ring.",
        );
      }
      setPhase("ready");
    }
  }, [router]);

  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setMessage(null);
    let c = 3;
    setCount(c);
    const timer = setInterval(() => {
      c -= 1;
      if (c === 0) {
        clearInterval(timer);
        void capture();
      } else {
        setCount(c);
      }
    }, 1000);
  }, [capture]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col pb-6">
      {/* Kamera maydoni */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {phase === "camera-error" ? (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <p className="font-bold">Kameraga ruxsat berilmadi</p>
            <p className="text-sm text-white/70">
              Tekshiruv uchun brauzer sozlamalaridan kameraga ruxsat bering va
              sahifani yangilang.
            </p>
            <button
              onClick={() => location.reload()}
              className="rounded-full bg-white px-6 py-2.5 font-bold text-foreground"
            >
              Qayta urinish
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="h-full min-h-[420px] w-full -scale-x-100 object-cover"
            />

            {/* Yashil oval ramka */}
            <svg
              viewBox="0 0 100 130"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <ellipse
                cx="50"
                cy="68"
                rx="36"
                ry="50"
                fill="none"
                stroke="#3fc04f"
                strokeWidth="2.2"
              />
            </svg>

            {/* Kamera tugmasi — oval tepasida */}
            {(phase === "ready" || phase === "init") && (
              <button
                onClick={startCountdown}
                disabled={phase !== "ready"}
                aria-label="Suratga olish"
                className="animate-pulse-ring absolute left-1/2 top-[10%] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-brand-green bg-white shadow-lg transition active:scale-95 disabled:opacity-60"
              >
                <CameraIcon className="h-8 w-8 text-foreground" />
              </button>
            )}

            {/* Hisob */}
            {phase === "countdown" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span
                  key={count}
                  className="animate-pop-in text-[110px] font-extrabold text-white drop-shadow-lg"
                >
                  {count}
                </span>
              </div>
            )}

            {/* Tahlil jarayoni */}
            {phase === "analyzing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55">
                <span className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                <p className="font-bold text-white">AI tahlil qilmoqda…</p>
              </div>
            )}

            {phase === "init" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                <p className="font-bold text-white">Kamera yoqilmoqda…</p>
              </div>
            )}

            {/* Pastdagi yo'riqnoma kartasi */}
            {(phase === "ready" || phase === "init") && (
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3.5 shadow-lg">
                {message ? (
                  <p className="text-sm font-bold leading-relaxed text-brand-red">
                    {message}
                  </p>
                ) : (
                  <p className="text-[15px] font-bold leading-relaxed">
                    <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-green bg-white align-middle">
                      <CameraIcon className="h-3.5 w-3.5 text-foreground" />
                    </span>
                    tugmasiga qarab, ko'zingizni katta oching va tugmani
                    bosing.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mx-5 mt-4 rounded-full border border-muted/60 py-3.5 font-bold text-muted transition hover:bg-black/5"
      >
        Bekor qilish
      </button>
    </main>
  );
}
