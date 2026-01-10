"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "../public/logo.png"
import Image from "next/image"
import { Button } from "./ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Inventory", icon: Package },
    { href: "/settings", label: "Settings", icon: Settings }
  ]

  return (
    <aside className="w-64 h-screen bg-card border-r border-border hidden md:flex flex-col fixed left-0 top-0 z-50 shadow-xl shadow-primary/5">
      <div className="p-8 pb-4 flex flex-col justify-center items-center">
        <Image src={logo} height={300} width={300} alt="Tech Babes Logo" />
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              {/* <Button className="btn-primary"> */}
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "btn-primary shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:btn-secondary hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "stroke-2" : "stroke-[1.5]"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {/* </Button> */}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors w-full rounded-xl hover:bg-destructive/5">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
