'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ApexoraLogo } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  User,
  TrendingUp,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  LifeBuoy,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/markets", label: "Markets", icon: TrendingUp },
  { href: "/dashboard/copy-trading", label: "Copy Trading", icon: Users },
  { href: "/dashboard/deposit", label: "Deposit Funds", icon: ArrowDownToLine },
  { href: "/dashboard/withdraw", label: "Withdraw Funds", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", label: "Transactions", icon: History },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <ApexoraLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline">Apexora</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
