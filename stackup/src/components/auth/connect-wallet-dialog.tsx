"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { Wallet, Loader2 } from "lucide-react"

interface ConnectWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectWalletDialog({ open, onOpenChange }: ConnectWalletDialogProps) {
  const { connectWallet, isConnecting } = useAuth()

  const handleConnect = async () => {
    await connectWallet()
    onOpenChange(false)
  }

  const wallets = [
    {
      name: "Leather",
      description: "The most popular Stacks wallet",
      icon: "/leather-wallet.png",
    },
    {
      name: "Xverse",
      description: "Bitcoin & Stacks wallet",
      icon: "/xverse-wallet.png",
    },
    {
      name: "Asigna",
      description: "Multi-signature wallet for teams",
      icon: "/asigna-wallet.png",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </DialogTitle>
          <DialogDescription>Choose a wallet to connect to the Stacks Ecosystem Hub</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">{wallet.name[0]}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-xs text-muted-foreground">{wallet.description}</div>
                </div>
                {isConnecting && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
              </div>
            </Button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center pt-2">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}
