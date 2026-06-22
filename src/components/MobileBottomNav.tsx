import { Home, LayoutDashboard, PackageSearch, ShoppingBag, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import clsx from "clsx";
export default function MobileBottomNav() {
  const { user, isAdmin } = useAuth();
  const { count } = useCart();
  const items = [{ to: "/", label: "Home", icon: Home }, { to: "/shop", label: "Shop", icon: PackageSearch }, { to: "/cart", label: "Cart", icon: ShoppingBag, count }, { to: user ? (isAdmin ? "/admin" : "/account") : "/login", label: isAdmin ? "Admin" : "Account", icon: isAdmin ? LayoutDashboard : UserRound }];
  return <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:hidden"><nav className="mx-auto grid max-w-md grid-cols-4 rounded-full bg-ink/95 p-2 text-white shadow-soft backdrop-blur-xl">{items.map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx("relative flex flex-col items-center gap-1 rounded-full px-2 py-2 text-[11px] font-extrabold transition", isActive ? "bg-honey text-ink" : "text-white/75")}><Icon size={19} /><span>{item.label}</span>{item.count ? <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-honey px-1 text-[10px] text-ink">{item.count}</span> : null}</NavLink>; })}</nav></div>;
}
