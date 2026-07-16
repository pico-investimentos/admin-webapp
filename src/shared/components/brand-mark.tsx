type BrandMarkProps = {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3" aria-label="Pico Investimentos — Painel">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" className="size-7">
          <path
            d="M6 23.5 15.1 7.8a1 1 0 0 1 1.73 0L26 23.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m11.2 20 4.1-7.1a.8.8 0 0 1 1.39 0l4.1 7.1"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".45"
          />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-semibold tracking-[-0.02em] text-slate-950">
            Pico
          </span>
          <span className="brand-tag mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em]">
            Painel
          </span>
        </span>
      )}
    </div>
  )
}
