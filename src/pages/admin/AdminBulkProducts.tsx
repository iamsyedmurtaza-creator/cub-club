import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Crop, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { fetchCategories, saveProduct, uploadProductImage } from "../../lib/storeApi";
import ImageCropModal from "../../components/ImageCropModal";
import { Category } from "../../types";
import { slugify } from "../../utils/format";

type DraftStatus = "idle" | "uploading" | "saving" | "done" | "error";

type Draft = {
  id: string;
  file: File;
  preview: string;
  name: string;
  price: string;
  compareAt: string;
  categoryId: string;
  stock: string;
  size: string;
  color: string;
  ageRange: string;
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  status: DraftStatus;
  error?: string;
};

function prettyName(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminBulkProducts() {
  const navigate = useNavigate();
  const idRef = useRef(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [defaults, setDefaults] = useState({ categoryId: "", stock: "1" });

  useEffect(() => {
    fetchCategories(true).then(setCategories);
  }, []);

  // Revoke object URLs on unmount.
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;
  useEffect(() => () => draftsRef.current.forEach((d) => URL.revokeObjectURL(d.preview)), []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const images = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      toast.error("Please drop image files only.");
      return;
    }
    setDrafts((current) => [
      ...current,
      ...images.map((file) => ({
        id: `d${idRef.current++}`,
        file,
        preview: URL.createObjectURL(file),
        name: prettyName(file.name),
        price: "",
        compareAt: "",
        categoryId: defaults.categoryId,
        stock: defaults.stock,
        size: "",
        color: "",
        ageRange: "",
        shortDescription: "",
        description: "",
        isFeatured: false,
        isActive: true,
        status: "idle" as DraftStatus,
      })),
    ]);
  }

  function update(id: string, patch: Partial<Draft>) {
    setDrafts((current) => current.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  function remove(id: string) {
    setDrafts((current) => {
      const target = current.find((d) => d.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((d) => d.id !== id);
    });
  }

  function applyCrop(id: string, file: File) {
    setDrafts((current) =>
      current.map((d) => {
        if (d.id !== id) return d;
        URL.revokeObjectURL(d.preview);
        return { ...d, file, preview: URL.createObjectURL(file) };
      }),
    );
  }

  function applyDefaultsToAll() {
    setDrafts((current) =>
      current.map((d) => (d.status === "done" ? d : { ...d, categoryId: defaults.categoryId, stock: defaults.stock })),
    );
    toast.success("Applied category & stock to all");
  }

  async function publishAll() {
    const pending = drafts.filter((d) => d.status !== "done");
    if (!pending.length) {
      toast.error("Nothing to publish.");
      return;
    }
    // Validate first so we fail fast with a clear message.
    for (const d of pending) {
      if (d.name.trim().length < 2) return toast.error("Every product needs a title.");
      if (!(Number(d.price) > 0)) return toast.error(`Set a price for "${d.name || "Untitled"}".`);
    }

    setPublishing(true);
    const usedSlugs = new Set<string>();
    let ok = 0;
    let failed = 0;

    for (const draft of pending) {
      try {
        update(draft.id, { status: "uploading", error: undefined });
        const imageUrl = await uploadProductImage(draft.file);

        let slug = slugify(draft.name) || `product-${draft.id}`;
        let unique = slug;
        let n = 2;
        while (usedSlugs.has(unique)) unique = `${slug}-${n++}`;
        usedSlugs.add(unique);

        update(draft.id, { status: "saving" });
        await saveProduct({
          name: draft.name.trim(),
          slug: unique,
          price: Number(draft.price),
          compare_at_price: draft.compareAt ? Number(draft.compareAt) : null,
          category_id: draft.categoryId || null,
          stock_quantity: Number(draft.stock || 0),
          size: draft.size.trim() || null,
          color: draft.color.trim() || null,
          age_range: draft.ageRange.trim() || null,
          short_description: draft.shortDescription.trim() || null,
          description: draft.description.trim() || null,
          is_featured: draft.isFeatured,
          is_active: draft.isActive,
          main_image_url: imageUrl,
        });
        update(draft.id, { status: "done" });
        ok++;
      } catch (error: any) {
        update(draft.id, { status: "error", error: error.message || "Failed to publish" });
        failed++;
      }
    }

    setPublishing(false);
    if (ok) toast.success(`Published ${ok} product${ok > 1 ? "s" : ""}${failed ? `, ${failed} failed` : ""}`);
    else toast.error("Could not publish products. Check the errors below.");
  }

  const doneCount = drafts.filter((d) => d.status === "done").length;
  const remaining = drafts.length - doneCount;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-soft">Inventory</p>
          <h1 className="font-display text-5xl font-extrabold text-cocoa">Bulk add products</h1>
          <p className="mt-2 text-sm font-semibold text-cocoa/55">Drop multiple photos, fill in details for each, then publish them all at once.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="btn-secondary">Back</Link>
          {doneCount > 0 ? <button onClick={() => navigate("/admin/products")} className="btn-secondary">View products</button> : null}
        </div>
      </div>

      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 text-center transition ${dragOver ? "border-honey bg-butter/40" : "border-cocoa/20 bg-white"}`}
      >
        <UploadCloud size={40} className="text-cocoa/40" />
        <p className="mt-3 font-display text-2xl font-bold text-cocoa">Drag &amp; drop product photos here</p>
        <p className="mt-1 text-sm font-semibold text-cocoa/50">or click to choose images (you can add many at once)</p>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </label>

      {drafts.length > 0 ? (
        <>
          {/* Shared defaults */}
          <div className="mt-6 admin-card flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="label-soft">Default category</label>
              <select className="input-soft" value={defaults.categoryId} onChange={(e) => setDefaults({ ...defaults, categoryId: e.target.value })}>
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className="label-soft">Default stock</label>
              <input type="number" className="input-soft" value={defaults.stock} onChange={(e) => setDefaults({ ...defaults, stock: e.target.value })} />
            </div>
            <button type="button" onClick={applyDefaultsToAll} className="btn-secondary">Apply to all</button>
          </div>

          {/* Draft cards */}
          <div className="mt-6 grid gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className={`admin-card grid gap-4 sm:grid-cols-[160px_1fr] ${draft.status === "error" ? "ring-2 ring-red-300" : ""}`}>
                <div className="relative">
                  <img src={draft.preview} alt={draft.name} className="aspect-square w-full rounded-3xl object-cover ring-1 ring-cocoa/10" />
                  {draft.status === "done" ? (
                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-mint/80 text-cocoa"><CheckCircle2 size={40} /></div>
                  ) : null}
                  {(draft.status === "uploading" || draft.status === "saving") ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-3xl bg-white/80 text-cocoa">
                      <Loader2 className="animate-spin" size={28} />
                      <span className="text-xs font-extrabold uppercase tracking-[0.14em]">{draft.status}</span>
                    </div>
                  ) : null}
                  {(draft.status === "idle" || draft.status === "error") ? (
                    <button type="button" onClick={() => setAdjustingId(draft.id)} className="absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-1 rounded-full bg-white/90 py-1.5 text-xs font-bold text-cocoa shadow-sm transition hover:bg-white">
                      <Crop size={13} /> Adjust
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Title" value={draft.name} onChange={(v) => update(draft.id, { name: v })} disabled={draft.status === "done"} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Price (PKR)" type="number" value={draft.price} onChange={(v) => update(draft.id, { price: v })} disabled={draft.status === "done"} />
                      <Field label="Compare at" type="number" value={draft.compareAt} onChange={(v) => update(draft.id, { compareAt: v })} disabled={draft.status === "done"} />
                    </div>
                    <div>
                      <label className="label-soft">Category</label>
                      <select className="input-soft" value={draft.categoryId} disabled={draft.status === "done"} onChange={(e) => update(draft.id, { categoryId: e.target.value })}>
                        <option value="">No category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Stock" type="number" value={draft.stock} onChange={(v) => update(draft.id, { stock: v })} disabled={draft.status === "done"} />
                      <Field label="Size" value={draft.size} onChange={(v) => update(draft.id, { size: v })} disabled={draft.status === "done"} />
                    </div>
                    <Field label="Color" value={draft.color} onChange={(v) => update(draft.id, { color: v })} disabled={draft.status === "done"} />
                    <Field label="Age range" value={draft.ageRange} onChange={(v) => update(draft.id, { ageRange: v })} disabled={draft.status === "done"} />
                  </div>
                  <div>
                    <label className="label-soft">Description</label>
                    <textarea className="input-soft resize-none" rows={2} value={draft.description} disabled={draft.status === "done"} onChange={(e) => update(draft.id, { description: e.target.value })} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-4">
                      <Check label="Featured" checked={draft.isFeatured} disabled={draft.status === "done"} onChange={(v) => update(draft.id, { isFeatured: v })} />
                      <Check label="Active" checked={draft.isActive} disabled={draft.status === "done"} onChange={(v) => update(draft.id, { isActive: v })} />
                    </div>
                    <div className="flex items-center gap-3">
                      {draft.status === "error" ? <span className="text-xs font-bold text-red-500">{draft.error}</span> : null}
                      {draft.status !== "done" ? (
                        <button onClick={() => remove(draft.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-cocoa/10 hover:bg-red-50"><Trash2 size={16} /></button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Publish bar */}
          <div className="sticky bottom-20 z-30 mt-6 flex flex-col gap-3 rounded-[2rem] bg-cocoa p-4 text-white shadow-soft sm:flex-row sm:items-center sm:justify-between md:bottom-4">
            <p className="px-2 text-sm font-bold">
              {drafts.length} item{drafts.length > 1 ? "s" : ""}
              {doneCount ? ` · ${doneCount} published` : ""}
              {remaining ? ` · ${remaining} to publish` : ""}
            </p>
            <button onClick={publishAll} disabled={publishing || remaining === 0} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
              {publishing ? <Loader2 className="animate-spin" size={18} /> : <ImagePlus size={18} />}
              {publishing ? "Publishing..." : `Publish ${remaining || ""} product${remaining === 1 ? "" : "s"}`}
            </button>
          </div>
        </>
      ) : null}

      {adjustingId ? (() => {
        const adjusting = drafts.find((d) => d.id === adjustingId);
        if (!adjusting) return null;
        return (
          <ImageCropModal
            file={adjusting.file}
            onCancel={() => setAdjustingId(null)}
            onApply={(file) => { applyCrop(adjusting.id, file); setAdjustingId(null); }}
          />
        );
      })() : null}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", disabled }: { label: string; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="label-soft">{label}</label>
      <input type={type} className="input-soft" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Check({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-cocoa">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-cocoa" />
      {label}
    </label>
  );
}
