'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useStacks } from '@/providers/StacksProvider'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'

// Simple utility functions
const microStxToStx = (microStx: number): number => {
  return microStx / 1_000_000;
};

const formatStxAmount = (microStx: number): string => {
  const stx = microStxToStx(microStx);
  return `${stx.toLocaleString(undefined, { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 6 
  })} STX`;
};

export function ConnectWalletButton() {
  const { account, isConnected, connect, disconnect } = useStacks()

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast.success('Address copied to clipboard!')
    }
  }

  const openInExplorer = () => {
    if (account?.address) {
      const explorerUrl = `https://explorer.stacks.co/address/${account.address}?chain=testnet`
      window.open(explorerUrl, '_blank')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (isConnected && account) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(account.address)}
            <Badge variant="secondary">
              {formatStxAmount(account.balance || 0)}
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connected
            </DialogTitle>
            <DialogDescription>
              Your Stacks wallet is connected and ready to use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {account.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={openInExplorer}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Balance</label>
                <div className="mt-1">
                  <span className="text-2xl font-bold">
                    {microStxToStx(account.balance || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                  <span className="text-lg text-gray-500 ml-2">STX</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={copyAddress}
                className="flex-1 gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Address
              </Button>
              <Button
                variant="outline"
                onClick={openInExplorer}
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Explorer
              </Button>
            </div>
            
            <Button
              onClick={disconnect}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button
      onClick={connect}
      disabled={false}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}

// Simplified version for mobile or compact spaces
export function ConnectWalletCompact() {
  const { account, isConnected, connect } = useStacks()

  if (isConnected && account) {
    return (
      <Badge variant="outline" className="gap-1">
        <Wallet className="h-3 w-3" />
        {account.address.slice(0, 6)}...
      </Badge>
    )
  }

  return (
    <Button
      size="sm"
      onClick={connect}
      disabled={false}
      variant="outline"
      className="gap-1"
    >
      <Wallet className="h-3 w-3" />
      Connect
    </Button>
  )
}

export default ConnectWalletButton
