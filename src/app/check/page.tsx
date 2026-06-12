"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "@/components/icons";
import { QrCode } from "@/components/QrCode";
import { useLang } from "@/lib/i18n";
import {
  analyzeCapture,
  FacePartialError,
  getFaceLandmarker,
  NoFaceError,
  RESULT_STORAGE_KEY,
} from "@/lib/analysis";

type Phase = "init" | "ready" | "countdown" | "analyzing" | "camera-error";

/** Telefon/planshetmi? Kompyuterda kamera o'rniga QR ko'rsatiladi */
function isMobileDevice(): boolean {
  const uaMobile = /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(
    navigator.userAgent,
  );
  const touchSmall =
    navigator.maxTouchPoints > 1 &&
    Math.min(screen.width, screen.height) < 820;
  return uaMobile || touchSmall;
}

export default function CheckPage() {
  const router = useRouter();
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mode, setMode] = useState<"detect" | "qr" | "camera">("detect");
  const [checkUrl, setCheckUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("init");
  const [count, setCount] = useState(3);
  const [message, setMessage] = useState<string | null>(null);

  // Qurilma turini aniqlash: kompyuterda QR, telefonda to'g'ridan-to'g'ri kamera
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- qurilma faqat klientda ma'lum */
    setCheckUrl(`${location.origin}/check`);
    setMode(isMobileDevice() ? "camera" : "qr");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Kamerani ishga tushirish + modelni oldindan yuklash
  useEffect(() => {
    if (mode !== "camera") return;
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
      // Sahifadan chiqilganda hisob ham to'xtaydi
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      setPhase("ready");
      setMessage(t.check.notReady);
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
      if (e instanceof FacePartialError) {
        setMessage(t.check.facePartial);
      } else if (e instanceof NoFaceError) {
        setMessage(t.check.noFace);
      } else {
        setMessage(t.check.analyzeError);
      }
      setPhase("ready");
    }
  }, [router, t]);

  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setMessage(null);
    let c = 3;
    setCount(c);
    timerRef.current = setInterval(() => {
      c -= 1;
      if (c === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        void capture();
      } else {
        setCount(c);
      }
    }, 1000);
  }, [capture]);

  // Kompyuter: kamera o'rniga QR — tekshiruv telefonda davom etadi
  if (mode !== "camera") {
    return (
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
        <div className="dot-pattern pointer-events-none absolute inset-0" />
        {mode === "qr" && (
          <section className="relative rounded-3xl bg-surface p-6 text-center shadow-sm">
            <h1 className="text-xl font-extrabold leading-snug">
              {t.check.qrTitle}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">
              {t.check.qrText}
            </p>
            {checkUrl && (
              <div className="mx-auto mt-5 w-56 rounded-2xl bg-white p-4 shadow-sm">
                <QrCode value={checkUrl} className="h-auto w-full" />
              </div>
            )}
            <p className="mt-3 break-all text-xs font-bold text-foreground/50">
              {checkUrl}
            </p>
            <button
              onClick={() => setMode("camera")}
              className="mt-6 w-full rounded-full border border-muted/60 py-3.5 font-bold text-muted transition hover:bg-black/5"
            >
              {t.check.qrContinue}
            </button>
            <button
              onClick={() => router.push("/")}
              className="mt-3 w-full rounded-full bg-accent-dark py-3.5 font-bold text-white transition hover:bg-accent-dark-hover"
            >
              {t.common.cancel}
            </button>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col pb-6">
      {/* Kamera maydoni */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {phase === "camera-error" ? (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <p className="font-bold">{t.check.camDenied}</p>
            <p className="text-sm text-white/70">{t.check.camDeniedHint}</p>
            <button
              onClick={() => location.reload()}
              className="rounded-full bg-white px-6 py-2.5 font-bold text-foreground"
            >
              {t.check.retry}
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
                aria-label={t.check.capture}
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
                <p className="font-bold text-white">{t.check.analyzing}</p>
              </div>
            )}

            {phase === "init" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                <p className="font-bold text-white">{t.check.starting}</p>
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
                    {t.check.hintPost}
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
        {t.common.cancel}
      </button>
    </main>
  );
}
