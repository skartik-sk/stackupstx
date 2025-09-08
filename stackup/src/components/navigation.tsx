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
import { GlobalSearch } from "@/components/search/global-search"
import { useWallet } from "@/contexts/WalletContextNew"
import { useState, useEffect } from "react"
import { User, Settings, LogOut, BarChart3, Copy, Wallet } from "lucide-react"
import { toast } from "react-hot-toast"

export function Navigation() {
  const [activeTab, setActiveTab] = useState("bounties")
  const { userAddress, isConnected, connectWallet, disconnectWallet, userData, isLoading } = useWallet()
  const [stxBalance, setStxBalance] = useState<string>("0 STX")
  
  console.log('🔍 Navigation Debug Info:', {
    isConnected,
    userAddress,
    userData,
    isLoading
  })
  
  // Get STX balance when connected
  useEffect(() => {
    console.log('💳 useEffect triggered - isConnected:', isConnected, 'userAddress:', userAddress)
    if (isConnected && userAddress) {
      // Fetch STX balance from Stacks API
      fetch(`https://api.testnet.hiro.so/extended/v1/address/${userAddress}/stx`)
        .then(response => response.json())
        .then(data => {
          const balance = parseFloat(data.balance) / 1000000; // Convert from microSTX
          setStxBalance(`${balance.toFixed(2)} STX`);
        })
        .catch(error => {
          console.error('Error fetching STX balance:', error);
          setStxBalance("0 STX");
        });
    } else {
      setStxBalance("0 STX");
    }
  }, [isConnected, userAddress])

  const navItems = [
    { id: "bounties", label: "Bounties", href: "/bounties" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "grants", label: "Grants", href: "/grants" },
    { id: "ideas", label: "Ideas", href: "/ideas" },
  ]

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress)
      toast.success('Address copied to clipboard!', {
        duration: 2000,
        style: {
          border: '1px solid #fc6431',
          padding: '16px',
          color: '#fc6431',
        },
        iconTheme: {
          primary: '#fc6431',
          secondary: '#FFFAEE',
        },
      })
    }
  }

  const handleConnectWallet = async () => {
    console.log('🔗 Connect wallet button clicked!')
    try {
      await connectWallet()
      console.log('✅ Wallet connection successful!')
      toast.success('Wallet connected successfully!', {
        duration: 3000,
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#10B981',
        },
      })
    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      toast.error('Failed to connect wallet', {
        duration: 3000,
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#EF4444',
        },
      })
    }
  }

  const handleDisconnectWallet = () => {
    disconnectWallet()
    toast.success('Wallet disconnected', {
      duration: 2000,
      style: {
        border: '1px solid #6B7280',
        padding: '16px',
        color: '#6B7280',
      },
    })
  }

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getAvatarInitials = () => {
    if (userData?.profile?.name) {
      const names = userData.profile.name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase()
    }
    return userAddress ? userAddress.slice(0, 2).toUpperCase() : 'SU'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#fc6431] rounded-lg flex items-center justify-center shadow-md">
<img src="./logo.png" alt=""  />
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
            {isConnected && userAddress ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-[#fc6431]/20 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData?.profile?.image?.[0]?.contentUrl} alt="User" />
                      <AvatarFallback className="bg-[#fc6431]/10 text-[#fc6431] font-semibold">
                        {getAvatarInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-green-500 border-2 border-white">✓</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.profile?.name || "Stacks User"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs leading-none text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {formatAddress(userAddress)}
                        </p>
                        <button
                          onClick={copyAddress}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy full address"
                        >
                          📋
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 pt-1">
                        <Badge variant="secondary" className="text-xs bg-[#fc6431]/10 text-[#fc6431] px-2 py-0.5">
                          💰 {stxBalance}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-600 px-2 py-0.5">
                          🟢 Connected
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
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
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
                  <DropdownMenuItem onClick={handleDisconnectWallet}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  onClick={handleConnectWallet}
                  disabled={isLoading}
                  className="bg-[#fc6431] text-white hover:bg-[#e55a2b] transition-all duration-200 disabled:opacity-50"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
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
