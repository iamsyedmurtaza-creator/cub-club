import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteCategory, fetchCategories, saveCategory } from "../../lib/storeApi";
import { Category } from "../../types";
import { slugify } from "../../utils/format";

const emptyForm = { name: "", slug: "", description: "", sort_order: 0, is_active: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    fetchCategories(true).then(setCategories).finally(() => setLoading(false));
  }

  useEffect(() => { void load(); }, []);

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: categories.length + 1 });
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveCategory(form, editingId ?? undefined);
      toast.success(editingId ? "Category updated" : "Category saved");
      resetForm();
      await load();
    } catch (error: any) {
      toast.error(error.message || "Could not save category");
    }
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted");
      if (editingId === category.id) resetForm();
      await load();
    } catch (error: any) {
      toast.error(error.message || "Could not delete category. It may still have products.");
    }
  }

  return (
    <div>
      <div>
        <p className="label-soft">Store navigation</p>
        <h1 className="font-display text-5xl font-extrabold text-cocoa">Categories</h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit} className="admin-card h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-cocoa">{editingId ? "Edit category" : "Add category"}</h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-cocoa/55 hover:text-honey"><X size={14} /> Cancel</button>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4">
            <div>
              <label className="label-soft">Name</label>
              <input required className="input-soft" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : (form.slug || slugify(e.target.value)) })} />
            </div>
            <div>
              <label className="label-soft">Slug</label>
              <input required className="input-soft" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
            </div>
            <div>
              <label className="label-soft">Description</label>
              <textarea className="input-soft resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label-soft">Sort order</label>
              <input type="number" className="input-soft" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-3xl bg-cream p-4 text-sm font-extrabold text-cocoa">
              <span>Active</span>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-5 w-5 accent-cocoa" />
            </label>
          </div>
          <button className="btn-primary mt-5 w-full">{editingId ? "Update category" : "Save category"}</button>
        </form>

        <section className="admin-card">
          <h2 className="font-display text-2xl font-bold text-cocoa">Current categories</h2>
          {loading ? (
            <div className="mt-5 h-64 animate-pulse rounded-3xl bg-cream" />
          ) : (
            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <div key={category.id} className="rounded-3xl bg-cream p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold text-cocoa">{category.name}</p>
                      <p className="text-xs font-bold text-cocoa/45">/{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={category.is_active ? "badge-soft bg-mint" : "badge-soft bg-blush"}>{category.is_active ? "Active" : "Hidden"}</span>
                      <button onClick={() => startEdit(category)} aria-label="Edit category" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cocoa shadow-sm transition hover:text-honey"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(category)} aria-label="Delete category" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
