import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/category/toddler-garments", label: "Garments" },
  { to: "/shop?q=girls", label: "Girls" },
  { to: "/shop?q=boys", label: "Boys" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="bg-cream py-2 text-center text-[11px] font-semibold text-ink/70">
        Export-quality kids garments with cash on delivery across Pakistan.
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink lg:hidden"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="group flex items-center">
          <img src="/cubclub-logo.png" alt="Cub Club" className="h-14 w-auto max-w-[150px] object-contain transition group-hover:scale-[1.03]" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "relative text-xs font-bold uppercase tracking-[0.16em] transition after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-honey after:transition-all hover:text-honey hover:after:w-full",
                  isActive ? "text-honey after:w-full" : "text-ink/75"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/shop" className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition hover:border-honey hover:text-honey sm:flex">
            <Search size={19} />
          </Link>
          <Link to="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition hover:border-honey hover:text-honey">
            <ShoppingBag size={19} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-honey px-1 text-[11px] font-extrabold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to={isAdmin ? "/admin" : "/my-orders"} className="btn-secondary py-3">
                {isAdmin ? "Admin" : "Account"}
              </Link>
              <button onClick={handleLogout} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition hover:border-honey hover:text-honey">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-honey hover:text-ink md:inline-flex">
              <UserRound size={17} /> Login
            </Link>
          )}
        </div>
      </div>

      {open ? (
        <div className="container-page pb-5 lg:hidden">
          <div className="grid gap-2 border border-black/10 bg-white p-3 shadow-soft">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="bg-paper px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink">
                {item.label}
              </Link>
            ))}
            <Link to={user ? (isAdmin ? "/admin" : "/my-orders") : "/login"} onClick={() => setOpen(false)} className="bg-ink px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">
              {user ? (isAdmin ? "Admin Dashboard" : "My Orders") : "Login / Signup"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
