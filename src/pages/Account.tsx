import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Package } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../lib/storeApi";
import { isValidPkPhone, normalizePkPhone } from "../utils/validate";

export default function Account() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
      });
    }
  }, [profile]);

  if (!loading && !user) {
    return (
      <div className="container-page py-12">
        <div className="card-soft p-10 text-center">
          <h1 className="font-display text-4xl font-extrabold text-cocoa">Login to manage your account</h1>
          <Link to="/login" className="btn-primary mt-6">Login</Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    if (form.full_name.trim().length < 2) { toast.error("Please enter your full name."); return; }
    if (form.phone.trim() && !isValidPkPhone(form.phone)) { toast.error("Enter a valid mobile number, e.g. 0301 2345678."); return; }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: form.full_name.trim(),
        phone: form.phone.trim() ? normalizePkPhone(form.phone) : "",
        address: form.address.trim(),
        city: form.city.trim(),
      });
      await refreshProfile();
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-soft">Your account</p>
          <h1 className="font-display text-5xl font-extrabold text-cocoa">My Account</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/my-orders" className="btn-secondary inline-flex items-center gap-2"><Package size={17} /> My Orders</Link>
          <button onClick={handleLogout} className="btn-secondary inline-flex items-center gap-2"><LogOut size={17} /> Logout</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-soft mt-8 max-w-2xl p-5 sm:p-8">
        <h2 className="font-display text-3xl font-bold text-cocoa">Delivery details</h2>
        <p className="mt-1 text-sm font-semibold text-cocoa/55">Saved details speed up checkout next time.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="03xx xxxxxxx" />
          <div className="sm:col-span-2">
            <label className="label-soft">Email</label>
            <input value={user?.email ?? ""} disabled className="input-soft opacity-60" />
          </div>
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <div className="sm:col-span-2">
            <label className="label-soft">Delivery address</label>
            <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-soft resize-none" placeholder="House number, street, area, city..." />
          </div>
        </div>
        <button disabled={saving} className="btn-primary mt-6 w-full py-4 sm:w-auto sm:px-10">{saving ? "Saving..." : "Save changes"}</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="label-soft">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-soft" />
    </div>
  );
}
