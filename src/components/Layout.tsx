import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import Navbar from "./Navbar";
export default function Layout() { return <div className="min-h-screen"><Navbar /><main><Outlet /></main><Footer /><MobileBottomNav /></div>; }
