"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"
import { GlobalSearch } from "@/components/search/global-search"
import { useStacks } from "@/providers/StacksProvider"
import { useState } from "react"
import { User, Settings, LogOut, BarChart3, Copy } from "lucide-react"
import { microStxToStx } from "@/lib/contracts"
import { toast } from "react-hot-toast"

export function Navigation() {
  const [activeTab, setActiveTab] = useState("bounties")
  const { account, isConnected, disconnect } = useStacks()

  const navItems = [
    { id: "bounties", label: "Bounties", href: "/bounties" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "grants", label: "Grants", href: "/grants" },
    { id: "ideas", label: "Ideas", href: "/ideas" },
  ]

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast.success('Address copied!')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Stacks Hub</span>
                <span className="text-xs text-muted-foreground leading-none">Ecosystem Boost</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <GlobalSearch />
            </div>

            <div className="flex items-center space-x-3">
              {isConnected && account ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>
                          {account.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-green-500">✓</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Stacks User</p>
                        <p className="text-xs leading-none text-muted-foreground font-mono">
                          {formatAddress(account.address)}
                        </p>
                        <div className="flex items-center space-x-1 pt-1">
                          <Badge variant="secondary" className="text-xs">
                            {microStxToStx(account.balance).toFixed(2)} STX
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Dashboard Hub</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/creator-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        <span>Creator Center</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/stacker-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        <span>Mission Control</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyAddress}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy Address</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={disconnect}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <ConnectWalletButton />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
