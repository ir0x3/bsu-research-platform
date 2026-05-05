import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Chatbot } from "./ChatBot";

function NavItem(props: { to: string; label: string }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-800 hover:text-blue-600"
        ].join(" ")
      }
    >
      {props.label}
    </NavLink>
  );
}

export function Layout() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <div className="min-h-dvh bg-surface text-foreground">
      
      {/* 🔝 Header */}
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white shadow-sm text-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:flex-nowrap">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="shrink-0" size={44} />
            <div className="leading-tight text-gray-800">
              <div className="text-sm font-semibold">جامعة بني سويف</div>
              <div className="text-xs text-gray-500">منصة أبحاث قسم علوم المعلومات</div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3" aria-label="التنقل">
            <NavItem to="/" label="الرئيسية" />
            <NavItem to="/library" label="مكتبة الأبحاث" />
            <NavItem to="/services" label="الخدمات الإضافية" />
            <NavItem to="/about" label="عن المنصة" />
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-xl bg-bsu-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:opacity-95"
              >
                الإدارة
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 📄 Content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      {/* 🔻 Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div className="text-sm">
              <div className="font-semibold">BSU Information Science Research Platform</div>
              <div className="text-xs text-muted">Metadata only — external links to official sources.</div>
            </div>
          </div>
          <div className="text-xs text-muted">
            © {new Date().getFullYear()} Faculty of Arts – Beni-Suef University
          </div>
        </div>
      </footer>

      {/* 🤖 Chatbot (هنا أهم إضافة) */}
      <Chatbot />

    </div>
  );
}