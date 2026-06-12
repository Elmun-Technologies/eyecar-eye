type IconProps = {
  className?: string;
};

/** Skaner burchaklari ichidagi kipriklı ko'z — asosiy belgi */
export function EyeScanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {/* burchak qavslar */}
      <path
        d="M4 16V8a4 4 0 0 1 4-4h8M48 4h8a4 4 0 0 1 4 4v8M60 48v8a4 4 0 0 1-4 4h-8M16 60H8a4 4 0 0 1-4-4v-8"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* kipriklar */}
      <path
        d="M32 14v-2M20 17l-2.6-3.4M44 17l2.6-3.4M11.5 24 8 21.5M52.5 24l3.5-2.5"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* ko'z shakli */}
      <path
        d="M8 36c5.5-9.5 14.2-15 24-15s18.5 5.5 24 15c-5.5 9.5-14.2 15-24 15S13.5 45.5 8 36Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="36" r="8.5" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="36" r="3" fill="currentColor" />
    </svg>
  );
}

/** Ko'z tomchisi flakoni */
export function DropBottleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <g transform="rotate(18 32 32)">
        {/* qalpoq chiziqlari */}
        <path
          d="M24 6h16M24 12h16M24 18h16"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* bo'yin */}
        <path
          d="M27 22h10l1.5 6h-13L27 22Z"
          fill="currentColor"
        />
        {/* tana */}
        <path
          d="M22 30h20c1.6 0 3 1.3 2.7 2.9l-3.2 20A4 4 0 0 1 37.6 56H26.4a4 4 0 0 1-3.9-3.1l-3.2-20c-.3-1.6 1.1-2.9 2.7-2.9Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* yorliq */}
        <rect x="26" y="36" width="12" height="12" rx="2" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Qizil X chizilgan ko'zoynak — yo'riqnoma uchun */
export function GlassesCrossed({ className }: IconProps) {
  return (
    <svg viewBox="0 0 160 110" fill="none" className={className} aria-hidden>
      {/* ko'zoynak */}
      <path
        d="M8 38h12M140 38h12"
        stroke="#17171f"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M66 44c4.5-4 23.5-4 28 0"
        stroke="#17171f"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M20 36c0-4 3-8 8-8h22c8 0 16 4 16 14v10c0 11-9 18-23 18S20 63 20 52V36Z"
        stroke="#17171f"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M140 36c0-4-3-8-8-8h-22c-8 0-16 4-16 14v10c0 11 9 18 23 18s23-7 23-18V36Z"
        stroke="#17171f"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      {/* qizil X */}
      <path
        d="M18 8 142 102M142 8 18 102"
        stroke="#d63a2e"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8.5 5.5 9.7 4h4.6l1.2 1.5H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h3.5Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12.5" r="3.6" fill="#fff" />
      <circle cx="12" cy="12.5" r="1.9" fill="currentColor" />
    </svg>
  );
}
