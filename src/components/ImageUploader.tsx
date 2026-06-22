import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadProductImage } from "../lib/storeApi";
import ImageCropModal from "./ImageCropModal";

export default function ImageUploader({ value, onChange }: { value?: string | null; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState<File | null>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message || "Image upload failed. Check storage policies.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      {value ? (
        <img src={value} alt="Product" className="aspect-square w-full rounded-3xl object-cover ring-1 ring-cocoa/10" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-cream ring-1 ring-cocoa/10">
          <ImagePlus className="text-cocoa/35" size={44} />
        </div>
      )}
      <label className="btn-secondary cursor-pointer">
        {uploading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <ImagePlus className="mr-2" size={18} />}
        {uploading ? "Uploading..." : value ? "Replace image" : "Upload product image"}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) setPending(file);
          }}
        />
      </label>

      {pending ? (
        <ImageCropModal
          file={pending}
          onCancel={() => setPending(null)}
          onApply={(cropped) => {
            setPending(null);
            void uploadFile(cropped);
          }}
        />
      ) : null}
    </div>
  );
}
