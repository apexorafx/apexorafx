'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  LayoutGrid,
  Menu,
  TrendingUp,
  User,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  History
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ApexoraLogo } from '../icons';
import { cn } from '@/lib/utils';

const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutGrid },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/markets", label: "Markets", icon: TrendingUp },
    { href: "/dashboard/copy-trading", label: "Copy Trading", icon: Users },
    { href: "/dashboard/deposit", label: "Deposit Funds", icon: ArrowDownToLine },
    { href: "/dashboard/withdraw", label: "Withdraw Funds", icon: ArrowUpFromLine },
    { href: "/dashboard/transactions", label: "Transactions", icon: History },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const getPageTitle = () => {
    const currentNavItem = navItems.find(item => pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard'));
    if (currentNavItem) {
        return currentNavItem.label;
    }
    if (pathname.startsWith('/dashboard/')) {
        const title = pathname.split('/')[2];
        return title.charAt(0).toUpperCase() + title.slice(1).replace('-', ' ');
    }
    return 'Dashboard';
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-6">
      <div className="md:hidden">
         <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
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
          </SheetContent>
        </Sheet>
      </div>
      
      <h1 className="text-xl font-semibold hidden md:block">{getPageTitle()}</h1>
      
      <div className="ml-auto flex items-center gap-4">
        <Button asChild>
            <Link href="/dashboard/deposit">Deposit Funds</Link>
        </Button>
        <ThemeToggle />
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.email || 'A'}`} alt={user?.email || 'User'}/>
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
