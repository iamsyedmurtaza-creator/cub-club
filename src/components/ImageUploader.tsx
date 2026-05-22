import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadProductImage } from "../lib/storeApi";
export default function ImageUploader({ value, onChange }: { value?: string | null; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  async function handleFile(file?: File) { if (!file) return; setUploading(true); try { const url = await uploadProductImage(file); onChange(url); toast.success("Image uploaded"); } catch (error: any) { toast.error(error.message || "Image upload failed. Check storage policies."); } finally { setUploading(false); } }
  return <div className="grid gap-3">{value ? <img src={value} alt="Product" className="h-52 w-full rounded-3xl object-cover ring-1 ring-cocoa/10" /> : <div className="flex h-52 items-center justify-center rounded-3xl bg-cream ring-1 ring-cocoa/10"><ImagePlus className="text-cocoa/35" size={44} /></div>}<label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <ImagePlus className="mr-2" size={18} />}{uploading ? "Uploading..." : "Upload product image"}<input type="file" className="hidden" accept="image/*" onChange={(event) => void handleFile(event.target.files?.[0])} disabled={uploading} /></label></div>;
}
