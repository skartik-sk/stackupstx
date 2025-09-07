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
import { User, Settings, LogOut, BarChart3, Copy, Wallet } from "lucide-react"
import { toast } from "react-hot-toast"

// Simple utility function
const microStxToStx = (microStx: number): number => {
  return microStx / 1_000_000;
};

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
    return `${address.slice(0, 8)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#fc6431] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none text-gray-900">StackUp</span>
              <span className="text-xs text-gray-500 leading-none">Ecosystem Boost</span>
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
                    ? "bg-[#fc6431] text-white hover:bg-[#e55a2b]"
                    : "text-gray-600 hover:text-[#fc6431] hover:bg-orange-50"
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
                      <AvatarFallback className="bg-[#fc6431]/10 text-[#fc6431] font-semibold">
                        {account.address.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-green-500 border-2 border-white">✓</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Stacks User</p>
                      <p className="text-xs leading-none text-gray-500 font-mono">
                        {formatAddress(account.address)}
                      </p>
                      <div className="flex items-center space-x-1 pt-1">
                        <Badge variant="secondary" className="text-xs bg-[#fc6431]/10 text-[#fc6431]">
                          {microStxToStx(account.balance || 0).toFixed(2)} STX
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
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
                      <span>Stacker Hub</span>
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
              <>
                <ConnectWalletButton />
                <Button size="sm" className="bg-[#fc6431] text-white hover:bg-[#e55a2b] shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href="/bounties">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
