import clsx from "clsx";
import { productMood } from "../lib/designAssets";

type ProductArtProps = {
  imageUrl?: string | null;
  title: string;
  categoryName?: string | null;
  variant?: "card" | "hero" | "detail";
};

const swatches = {
  tee: "#E9B36F",
  set: "#BBD58E",
  dress: "#F4A6B8",
  cot: "#E7D5B6",
  accessory: "#9BD3EA",
};

export default function ProductArt({ imageUrl, title, categoryName, variant = "card" }: ProductArtProps) {
  const mood = productMood(title, categoryName);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className={clsx("h-full w-full object-cover transition duration-700 group-hover:scale-105", variant === "detail" ? "rounded-none" : "rounded-none")}
      />
    );
  }

  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[#f8f8f5]">
      <div className="absolute inset-x-6 top-7 h-px bg-black/5" />
      <div className="absolute bottom-5 left-5 right-5 h-16 bg-gradient-to-t from-black/5 to-transparent" />
      <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45 shadow-sm">
        Cub Club
      </div>
      <ProductShape mood={mood} />
      <div className="absolute bottom-5 left-5 right-5 text-center">
        <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Soft everyday essentials</p>
      </div>
    </div>
  );
}

function ProductShape({ mood }: { mood: keyof typeof swatches }) {
  if (mood === "cot") {
    return (
      <svg viewBox="0 0 360 360" className="h-[72%] w-[72%] drop-shadow-xl" role="img" aria-label="baby cot illustration">
        <rect x="64" y="126" width="232" height="120" rx="18" fill="#F8EFE2" stroke="#2A2622" strokeWidth="6" />
        <rect x="88" y="146" width="184" height="62" rx="12" fill="#FFFFFF" stroke="#2A2622" strokeWidth="5" />
        <path d="M84 246v50M276 246v50M58 296h244" stroke="#2A2622" strokeWidth="8" strokeLinecap="round" />
        <path d="M108 128v112M144 128v112M180 128v112M216 128v112M252 128v112" stroke="#2A2622" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
        <circle cx="128" cy="176" r="10" fill="#F5B400" />
      </svg>
    );
  }

  if (mood === "accessory") {
    return (
      <svg viewBox="0 0 360 360" className="h-[72%] w-[72%] drop-shadow-xl" role="img" aria-label="baby accessory illustration">
        <rect x="92" y="88" width="176" height="204" rx="36" fill="#DFF2FF" stroke="#2A2622" strokeWidth="6" />
        <rect x="122" y="122" width="116" height="62" rx="18" fill="#FFFFFF" stroke="#2A2622" strokeWidth="5" />
        <path d="M136 88c0-34 88-34 88 0" fill="none" stroke="#2A2622" strokeWidth="8" strokeLinecap="round" />
        <circle cx="144" cy="224" r="12" fill="#F5B400" />
        <circle cx="180" cy="224" r="12" fill="#FBE0CC" />
        <circle cx="216" cy="224" r="12" fill="#A4D8B6" />
      </svg>
    );
  }

  const fill = swatches[mood];
  return (
    <svg viewBox="0 0 360 360" className="h-[76%] w-[76%] drop-shadow-xl" role="img" aria-label="kids clothing illustration">
      <path
        d="M132 70h96l58 40-36 60-28-16v132H138V154l-28 16-36-60 58-40Z"
        fill={fill}
        stroke="#2A2622"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M146 72c8 28 60 28 68 0" fill="#FFFDF7" stroke="#2A2622" strokeWidth="6" />
      <path d="M142 198h76" stroke="#2A2622" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      <path d="M142 226h76" stroke="#2A2622" strokeWidth="5" strokeLinecap="round" opacity="0.22" />
      {mood === "dress" ? <path d="M138 286h84l34 42H104l34-42Z" fill="#F4A6B8" stroke="#2A2622" strokeWidth="7" /> : null}
      {mood === "set" ? <path d="M132 292h96v44h-96z" fill="#FFFDF7" stroke="#2A2622" strokeWidth="7" /> : null}
    </svg>
  );
}
