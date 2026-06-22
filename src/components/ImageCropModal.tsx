import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Loader2 } from "lucide-react";

type Props = {
  file: File;
  onCancel: () => void;
  onApply: (file: File) => void;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = url;
  });
}

// Crop to a square and downscale very large images to keep uploads light.
async function getCroppedFile(src: string, area: Area, name: string): Promise<File> {
  const image = await createImage(src);
  const size = Math.min(Math.round(area.width), 1400);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) throw new Error("Could not export image");
  const baseName = name.replace(/\.[^.]+$/, "") || "product";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

export default function ImageCropModal({ file, onCancel, onApply }: Props) {
  const [src, setSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => setAreaPixels(pixels), []);

  async function apply() {
    if (!areaPixels) return;
    setWorking(true);
    try {
      const cropped = await getCroppedFile(src, areaPixels, file.name);
      onApply(cropped);
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="border-b border-cocoa/10 p-5">
          <h2 className="font-display text-2xl font-bold text-cocoa">Adjust image</h2>
          <p className="mt-1 text-sm font-semibold text-cocoa/55">Drag to reposition and zoom to crop out any watermark. The image is saved as a square.</p>
        </div>

        <div className="relative h-[55vh] bg-ink/90">
          {src ? (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>

        <div className="grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-cocoa/50">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-cocoa"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="btn-secondary" disabled={working}>Cancel</button>
            <button onClick={apply} className="btn-primary inline-flex items-center gap-2" disabled={working || !areaPixels}>
              {working ? <Loader2 className="animate-spin" size={18} /> : null}
              {working ? "Processing..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
