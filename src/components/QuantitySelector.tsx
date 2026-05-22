import { Minus, Plus } from "lucide-react";
export default function QuantitySelector({ value, onChange, max = 99 }: { value: number; onChange: (value: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center rounded-full bg-cream p-1 ring-1 ring-cocoa/10">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cocoa shadow-sm"><Minus size={16} /></button>
      <span className="min-w-10 text-center text-sm font-extrabold text-cocoa">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa text-white shadow-sm"><Plus size={16} /></button>
    </div>
  );
}
