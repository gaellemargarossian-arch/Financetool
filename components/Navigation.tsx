"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Receipt, Target, Brain, BarChart3, DollarSign, FileUp, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/networth", label: "Net Worth", icon: TrendingUp },
  { href: "/import", label: "Import/Edit", icon: FileUp },
  { href: "/ai-coach", label: "AI Coach", icon: Brain },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-black border-border shadow-lg border-glow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-8">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary glow-sm" />
            <span className="text-xl font-bold text-primary">Mizan</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    isActive
                      ? "text-primary font-semibold glow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

