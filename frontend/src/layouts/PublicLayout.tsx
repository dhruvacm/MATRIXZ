import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function PublicLayout() {
  return (
    <div className="public-site relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#F7F6F0] text-[#202923] antialiased">
      <Navbar />
      <main className="flex-1 pt-[68px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
