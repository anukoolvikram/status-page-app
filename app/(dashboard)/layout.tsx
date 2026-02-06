import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Server, AlertCircle, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50/40">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded bg-primary" />
              <span>StatusPage</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <NavLink href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/services" icon={Server}>
              Services
            </NavLink>
            <NavLink href="/dashboard/incidents" icon={AlertCircle}>
              Incidents
            </NavLink>
            <NavLink href="/dashboard/settings" icon={Settings}>
              Settings
            </NavLink>
          </nav>
          <div className="border-t p-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}